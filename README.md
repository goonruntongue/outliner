# jQuery Outliner 2

文字にアウトラインをつける jQuery プラグインです。CSS の `text-stroke` だと文字の内側（塗部分）がつぶれてしまう問題を解消しつつ、必要な場面では角を丸く見せる描画も選べます。


---

## 使い方
<br>

1.htmlにjqueryとoutlinerを読み込む

```html
<script src="path/to/jquery"></script>
<script src="path/to/outliner.min.js"></script>
<body>
```

または npm でインストールします。

```bash
npm install @goonruntongue/outliner2 jquery
```

CDN から利用する場合は、jQuery の後に読み込みます。

```html
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@goonruntongue/outliner2/dist/outliner.min.js"></script>
```

UNPKG: <code>https://unpkg.com/@goonruntongue/outliner2/dist/outliner.min.js</code>

<br>
2.以下のようにoutlinerを実行

```js
$("div").outliner({
  width: "12px", //アウトラインの幅
  color: "#fff", //アウトラインの色
  corner: "3px" //角を丸くする描画の滑らかさ（省略時は "0px"）
});
```

`corner` に `"1px"` 以上を指定すると、`text-stroke` のマイター結合ではなく、円形に重ねた `text-shadow` でアウトラインを描画します。値を大きくするほど円周上の描画点が増え、角がなめらかになります。`corner: "0px"`（初期値）では従来どおり `text-stroke` を使用します。角丸描画を使う場合の `width` は `px` 指定を推奨します。

<br>

---

要素内のテキストノードにアウトラインを付ける仕様なので、以下のように指定要素内の子要素に対してもアウトラインを付けられます。

```js
<p class="outline-parent">
   <a>ここにアウトライン</a>
</p>
...
..
<script src="outliner.js"></script>
<script>
$(".outline-parent").outliner();
</script>
```
