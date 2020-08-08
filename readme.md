# quick-opencc-js

追求快速的繁簡轉換
(純 Javascript 使用 OpenCC)

## 前言

原本是想解決 [node-opencc](https://github.com/compulim/node-opencc) 的性能問題，於是另外開一個專案。在完成核心程式碼後，才發現有 [opencc-js](https://github.com/nk2028/opencc-js) 這個專案，同樣使用樹狀字典是一個巧合。不過後續在規劃 API 時，覺得 opencc-js 採用地區名稱，可以自由選擇來源與目的的方式，相較於 node-opencc 更有彈性，所以也沿用下來了。

### 專案方向

* 降低轉換需要花費的時間
* 方便使用者自行更新與維護字詞庫

### 關於速度

透過 [test/speed_test.html](test/speed_test.html) 測試，和目前版本的 opencc-js 比較，FireFox 花費時間約為原本的 25%~30% 左右，Chrome 花費時間約為原本的 10% 左右。
（以上僅以當前版本而言，也可能跟個人設備有關）

技術上雖然跟 opencc-js 都是採用樹狀字典，但為了減少字串的裁切，樹狀結構使用 [Map Object](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Map)，這讓程式可以藉由 code point 搜尋資料，而不需要一直從原字串裁切字串下來。

## 使用方式

這個函式庫使用方式有下列兩種：

1. 同步：字詞資料直接內嵌在 javascript 裡面，使用上比較簡單。如果要更新字詞庫，必須透過 webpack 等打包工具重新打包。
2. 非同步：字詞資料在需要時才從伺服器上抓取，適合自行維護字詞庫的使用者。

## 同步使用說明

1. 將 [dist/quick-opencc-full.js](dist/quick-opencc-full.js) 複製下來，並透過 script 標籤引用。
2. 呼叫 `quickOpenCC.convert(text, fromLoc, toLoc)` 就會回傳 text 轉換後的字串。

上面的 fromLoc 與 toLoc是一個字串（沿用 opencc-js 的命名方式），目前允許的有：

* `'t'`：OpenCC 繁體
* `'cn'`：大陸簡體
* `'tw'`：台灣繁體
* `'twp'`：台灣繁體+慣用語替換
* `'hk'`：香港繁體
* `'jp'`：日本新字體

例如要從簡體轉換成台灣地區繁體，fromLoc 使用 `'cn'` ，toLoc 使用 `'tw'`

### 範例

參考 [test/example_sync.html](test/example_sync.html)

### 字詞庫的更新

在同步使用的方式下，必須重新打包函式庫，步驟如下：

1. 透過 `node scripts/txt2json.js 來源資料夾 目的資料夾` 把 [OpenCC 專案內的 dictionary](https://github.com/BYVoid/OpenCC/tree/master/data/dictionary) 轉成 json 格式。
2. 將轉換好的 josn 檔案放到 data 資料夾內。
3. 使用 webpack 重新產生 quick-opencc-async.js。

## 非同步使用說明

1. 將 [dist/quick-opencc-async.js](dist/quick-opencc-async.js) 複製下來，並透過 script 標籤引用。
2. 透過 `quickOpenCC.config({url:資料網址, type:資料類型, version:(選擇性)版本字串})` 設定字詞資料的網址，以及資料類型。
3. 用 `quickOpenCC.createConverter(fromLoc, toLoc)` 建立 converter，這會回傳一個 Promise。（ fromLoc 與 toLoc 與同步使用說明相同）
4. 取得 converter 後，用 `converter(text)` 就會回傳 text 轉換後的字串。

### 範例

參考 [test/example_async.html](test/example_async.html)

### 字詞庫的建立與更新

如果是使用 txt 資料格式，直接抓取[OpenCC 專案內的 dictionary](https://github.com/BYVoid/OpenCC/tree/master/data/dictionary)即可。如果要使用 json 資料格式，可以參考同步使用說明內關於 [scripts/txt2json.js](scripts/txt2json.js) 的敘述。

如果更新或修改字詞庫，直接更新伺服器資料即可，不需要重新打包函式庫。
