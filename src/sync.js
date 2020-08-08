const core=require('./core.js');
let cfgDict=require('./config.json');

for(tp in cfgDict) {
    let tmp=cfgDict[tp];
    for(loc in tmp) {
        let cfg=tmp[loc].map((s)=>{
            let rev,fname;
            if(s[0]==='~') {
                rev=true;
                fname=s.slice(1);
            } else {
                rev=false;
                fname=s;
            }
            let d=require(`../data/${fname}.json`);
            return rev?{rev:d}:d;
        });
        tmp[loc]=core.createMapByConfig(cfg);
    }
}

exports.convert=function(text, fromLoc, toLoc) {
    if(fromLoc!=='t') {
        text=core.translate(text, cfgDict.from[fromLoc]);
    }
    if(toLoc!=='t') {
        text=core.translate(text, cfgDict.from[toLoc]);
    }
    return text;
}
