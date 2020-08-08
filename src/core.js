/**
 * 將一組資料加入字典樹
 * 
 * @param {Map Object} map 字典樹
 * @param {String} src 來源字串
 * @param {String} dest 目的字串
 */
function addPair(map, src, dest) {
    let n=src.length,
        i=0,
        stack=[map];
    for(i=0;i<n;++i) {
        let top=stack[stack.length-1];
        let c=src.codePointAt(i); 
        let t=top.get(c);
        switch(typeof t) {
        case 'undefined':
            if(i+1==n) {
                top.set(c, dest);
                return;
            } else {
                t=new Map();
                top.set(c, t);
                stack.push(t);
            }
            break;
        case 'string':
            if(i+1==n) {
                //throw new Error(`重複: ${src} => ${dest}`);
                return;
            } else {
                let tmp=new Map();
                tmp.set('', t);
                top.set(c, tmp);
                stack.push(tmp);
            }
            break;
        case 'object':
            if(i+1==n) {
                if(t.get('')==='') {
                    //throw new Error(`重複: ${src} => ${dest}`);
                    t.set('', dest);
                } else {
                    t.set('', dest);
                }
                return;
            } else {
                stack.push(t);
            }
            break;
        default:
        }
    }
}

/**
 * 使用字典樹轉換一段文字
 * 
 * @param {String} text 要被轉換的文字
 * @param {Map Object} map 字典樹
 * @returns {String} 轉換後的字串
 */
function translate(text, map) {
    let i,j,
        n=text.length,
        m,arr=[],tmpstr,last_idx,orig_idx=null;
    
    for(i=0;i<n;) {
        m=map;
        tmpstr=null;
        last_idx=null;
        for(j=i;j<n;) {
            let c=text.codePointAt(j);
            let t=m.get(c);
            let tp=typeof t;
			
            if(t===undefined) {
                break;
            }
            if(tp==='string') {
                tmpstr=t;
                last_idx=++j;
                break;
            }
            if(tp==='object') {
                m=t;
                t=m.get('');
                if(t!==undefined) {
                    tmpstr=t;
                    last_idx=j+1;
                }
                ++j;
                continue;
            }
            throw new Error('ERR'+tp);
        }
        if(last_idx!==null) {
            if(orig_idx!==null) {
                arr.push(text.substring(orig_idx, i));
                orig_idx=null;
            }
            arr.push(tmpstr);
            i=last_idx;
        } else {
            if(orig_idx===null) {
                orig_idx=i;
            }
            //arr.push(text.substring(i,i+1));
            ++i;
        }
    }
    if(orig_idx!==null) {
        arr.push(text.substring(orig_idx, i));
    }
    return arr.join('');
}

/**
 * 將 config 轉換為 字典樹
 * 
 * @param {Array} config data 陣列
 * @returns {Map Object} 字典樹
 */
function createMapByConfig(config) {
    let m=new Map();
    config.forEach((data)=>{
        if(Array.isArray(data)) {
            data.forEach((row)=>{
                addPair(m, row[0], row[1]);
            });
        } else {
            data.rev.forEach((row)=>{
                addPair(m, row[1], row[0]);
            });
        }
    });
    return m;
}
//====exports====
exports.createMapByConfig=createMapByConfig;
exports.translate=translate;