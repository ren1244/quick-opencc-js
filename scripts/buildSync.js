//語法： buildSync config_file
const path=require('path');
const fs=require('fs');

if(process.argv.length!==3) {
    console.log('node buildSync.js config_file');
    process.exit();
}

let dict=require(path.resolve('./', process.argv[2]));

let fnameList={};
let tmpCode=['const cfgDict={'];
for(tfType in dict) {
    let d=dict[tfType];
    tmpCode.push(`\t"${tfType}":{`);
    for(loc in d) {
        let cfg=d[loc];
        tmpCode.push(`\t\t"${loc}":core.createMapByConfig([`);
        cfg.forEach((s,i)=>{
            let fname;
            if(s[0]==='~') {
                fname=s.slice(1);
                tmpCode.push(`\t\t\t{"rev":${fname}},`);
            } else {
                fname=s;
                tmpCode.push(`\t\t\t${fname},`);
            }
            fnameList[fname]=true;
        });
        tmpCode.push(`\t\t]),`);
    }
    tmpCode.push(`\t},`);
}
tmpCode.push(`};`);
;

let fullCode=[
    `const core=require('./core.js');`,
    Object.keys(fnameList).map(fname=>`const ${fname}=require('../data/${fname}')`).join('\n'),
    tmpCode.join('\n'),
`exports.convert=function(text, fromLoc, toLoc) {
    let m;
    if(fromLoc!=='t') {
        if(!((m=cfgDict.from[fromLoc]) instanceof Map)) {
            throw new Error('錯誤的字典');
        }
        text=core.translate(text, m);
    }
    if(toLoc!=='t') {
        if(!((m=cfgDict.to[toLoc]) instanceof Map)) {
            throw new Error('錯誤的字典');
        }
        text=core.translate(text, m);
    }
    return text;
}
`];
fullCode=fullCode.join('\n');
console.log(fullCode);
fs.writeFileSync('./src/sync.js', fullCode);
