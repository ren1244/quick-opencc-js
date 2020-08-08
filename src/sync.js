const core=require('./core.js');
const STPhrases=require('../data/STPhrases')
const STCharacters=require('../data/STCharacters')
const TWVariantsRevPhrases=require('../data/TWVariantsRevPhrases')
const TWVariants=require('../data/TWVariants')
const TWPhrasesIT=require('../data/TWPhrasesIT')
const TWPhrasesName=require('../data/TWPhrasesName')
const TWPhrasesOther=require('../data/TWPhrasesOther')
const HKVariantsRevPhrases=require('../data/HKVariantsRevPhrases')
const HKVariants=require('../data/HKVariants')
const JPShinjitaiPhrases=require('../data/JPShinjitaiPhrases')
const JPShinjitaiCharacters=require('../data/JPShinjitaiCharacters')
const JPVariants=require('../data/JPVariants')
const TSPhrases=require('../data/TSPhrases')
const TSCharacters=require('../data/TSCharacters')
const cfgDict={
	"from":{
		"cn":core.createMapByConfig([
			STPhrases,
			STCharacters,
		]),
		"tw":core.createMapByConfig([
			TWVariantsRevPhrases,
			{"rev":TWVariants},
		]),
		"twp":core.createMapByConfig([
			{"rev":TWPhrasesIT},
			{"rev":TWPhrasesName},
			{"rev":TWPhrasesOther},
			TWVariantsRevPhrases,
			{"rev":TWVariants},
		]),
		"hk":core.createMapByConfig([
			HKVariantsRevPhrases,
			{"rev":HKVariants},
		]),
		"jp":core.createMapByConfig([
			JPShinjitaiPhrases,
			JPShinjitaiCharacters,
			{"rev":JPVariants},
		]),
	},
	"to":{
		"cn":core.createMapByConfig([
			TSPhrases,
			TSCharacters,
		]),
		"tw":core.createMapByConfig([
			TWVariants,
		]),
		"twp":core.createMapByConfig([
			TWPhrasesIT,
			TWPhrasesName,
			TWPhrasesOther,
			TWVariants,
		]),
		"hk":core.createMapByConfig([
			HKVariants,
		]),
		"jp":core.createMapByConfig([
			JPVariants,
		]),
	},
};
exports.convert=function(text, fromLoc, toLoc) {
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
