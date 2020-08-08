const core=require('./core.js');
let cfgDict=require('./config.json');
let dataUrl='';
let dataType='json';
let dataVersion=false;
let cache={};

function convTxt2Data(txt) {
    return txt.trim().split('\n').map((r)=>{
        r=r.trim();
        if(r) {
            return r.split(/\s+/);
        } else {
            return false;
        }
    }).filter(x=>x!==false);
}

function getData(fname) {
    if(!cache[fname]) {
        if(dataType==='json') {
            cache[fname]=fetch(`${dataUrl}${fname}.json${dataVersion!==false?'?v='+dataVersion:''}`)
            .then(r=>r.json());
        } else {
            cache[fname]=fetch(`${dataUrl}${fname}.txt${dataVersion!==false?'?v='+dataVersion:''}`)
            .then(r=>r.text())
            .then(t=>convTxt2Data(t));
        }
    }
    return cache[fname];
}

function getMapFromDict(dict, key) {
    let m=dict[key];
    if(Array.isArray(m)) {
        let a=m.map((s)=>{
            let rev,fname;
            if(s[0]==='~') {
                rev=true;
                fname=s.slice(1);
            } else {
                rev=false;
                fname=s;
            }
            return getData(fname).then((d)=>{
                return rev?{rev:d}:d;
            });
        });
        dict[key]=Promise.all(a).then(cfg=>core.createMapByConfig(cfg));
    }
    return dict[key];
}

exports.createConverter=function(fromLoc, toLoc) {
    let chain=[];
    if(fromLoc!=='t') {
        chain.push(getMapFromDict(cfgDict.from, fromLoc));
    }
    if(toLoc!=='t') {
        chain.push(getMapFromDict(cfgDict.to, toLoc));
    }
    return Promise.all(chain).then((mapList)=>{
        return function(text) {
            mapList.forEach((m)=>{
                text=core.translate(text, m);
            });
            return text;
        }
    });
}

exports.config=function(opt) {
    if(opt.url) {
        dataUrl=opt.url;
    }
    if(opt.type) {
        dataType=opt.type;
    }
    if(opt.version) {
        dataVersion=opt.version;
    }
}
exports.clearCache=function() {
    cache={};
}
