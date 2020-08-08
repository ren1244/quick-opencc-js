const path=require('path');
const fs=require('fs');

const dict=require('../src/config.json');
if(process.argv.length!==4) {
    console.log('node text2json.js srcDir destDir');
    process.exit();
}
let srcDir=path.resolve('./', process.argv[2]);
let destDir=path.resolve('./', process.argv[3]);
let fnameList=Object.values(dict).map(x=>Object.values(x)).flat(2).reduce((sum, s)=>{
    let fname=s[0]==='~'?s.slice(1):s;
    if(sum.indexOf(fname)<0) {
        sum.push(fname);
    }
    return sum;
},[]);

fnameList.forEach((fname)=>{
    let srcPath=path.resolve(srcDir, fname+'.txt');
    let destPath=path.resolve(destDir, fname+'.json');
    if(!fs.existsSync(srcPath)) {
        console.log(srcPath+' not exists!');
        return;
    }
    let d=fs.readFileSync(srcPath, {encoding:'utf8'});
    d=d.trim().split('\n').map((r)=>{
        r=r.trim();
        if(r) {
            return r.split(/\s+/);
        } else {
            return false;
        }
    }).filter(x=>x!==false);
    fs.writeFileSync(destPath, JSON.stringify(d));
});
