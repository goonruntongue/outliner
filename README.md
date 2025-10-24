# jQuery Outliner

文字にアウトラインをつける jQuery プラグインです。cssのtext-strokeだと文字の内側（塗部分）がつぶれてしまう問題を解消するために作りました。


---

## 使い方
<br>

1.htmlにjqueryとoutlinerを読み込む

```html
<script src="path/to/jquery"></script>
<script src="path/to/outliner.min.js"></script>
<body>
```

もしくはcdnから
```html
<script src="path/to/jquery"></script>
<script src="https://cdn.jsdelivr.net/gh/goonruntongue/outliner@1.1.0/dist/outliner.js"></script>
<body>
```

<br>
2.以下のようにoutlinerを実行

```js
$("div").outliner({
  width: "12px", //アウトラインの幅
  color: "#fff" //アウトラインの色
});
```

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
