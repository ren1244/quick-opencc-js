/**
 * 將一組資料加入字典樹
 * 
 * @param {Map Object} map 字典樹
 * @param {String} src 來源字串
 * @param {String} dest 目的字串
 */
function addPair(map, src, dest) {
    let n=src.length,
			i=0;
		for(i=0;i<n;) {
			let c=src.codePointAt(i);
			i+=c>0xffff?2:1;
			let m=map.get(c);
			if(m===undefined) {
				m=new Map();
				map.set(c, m);
			}
			map=m;
		}
		map.set('', dest);
}

/**
 * 使用字典樹轉換一段文字
 * 
 * @param {String} text 要被轉換的文字
 * @param {Map Object} map 字典樹
 * @returns {String} 轉換後的字串
 */
function translate(text, map) {
    let n=text.length,
        arr=[],orig_i=null;
    for(let i=0;i<n;) {
        let m=map, k=0, v=null, x=0;
        for(let j=i;j<n;) {
            x=text.codePointAt(j);
            j+=x>0xffff?2:1;
            let tmp=m.get(x);
            if(tmp===undefined) {
                break;
            }
            m=tmp;
            tmp=m.get('');
            if(tmp!==undefined) {
                k=j;
                v=tmp;
            }
        }
        if(k>0) { //有替代
            if(orig_i!==null) {
                arr.push(text.slice(orig_i, i));
                orig_i=null;
            }
            arr.push(v);
            i=k;
        } else { //無替代
            if(orig_i===null) {
                orig_i=i;
            }
            i+=text.codePointAt(i)>0xffff?2:1;
        }
    }
    if(orig_i!==null) {
        arr.push(text.slice(orig_i, n));
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