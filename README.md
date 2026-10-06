# jQuery Outliner

A lightweight jQuery plugin for adding an outline to text without covering its fill color. It can use the browser's native `text-stroke` rendering, or generate a rounded outline with layered `text-shadow` values when you need softer corners.

文字の塗りをつぶさずにアウトラインを付けられる、軽量なjQueryプラグインです。通常はブラウザ標準の `text-stroke` を使い、より丸い角が必要な場合は `text-shadow` を重ねた描画方式を選べます。

## Installation / インストール

Install jQuery and the plugin with npm.

npmでjQueryとプラグインをインストールします。

```bash
npm install @goonruntongue/outliner jquery
```

Or, load jQuery first and then load Outliner from a CDN.

または、jQueryを先に読み込んだあと、CDNからOutlinerを読み込みます。

```html
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@goonruntongue/outliner@1/dist/outliner.min.js"></script>
```

For a fully pinned version, use:

特定バージョンへ完全に固定したい場合は、こちらを使用します。

```html
<script src="https://cdn.jsdelivr.net/npm/@goonruntongue/outliner@1.0.0/dist/outliner.min.js"></script>
```

UNPKG: `https://unpkg.com/@goonruntongue/outliner@1/dist/outliner.min.js`

## Usage / 使い方

Call `.outliner()` on the elements whose text should have an outline.

アウトラインを付けたい文字を含む要素に対して、`.outliner()` を実行します。

```js
$("div").outliner({
  width: "12px", // Outline width / アウトラインの幅
  color: "#fff", // Outline color / アウトラインの色
  corner: "3px" // Rounded-corner smoothness / 角丸描画の滑らかさ
});
```

Set `corner` to `"1px"` or more to use a circular stack of `text-shadow` values instead of the sharp joins of `text-stroke`. Higher values add more points around the outline and make corners smoother. The default, `corner: "0px"`, uses `text-stroke`. When using rounded rendering, `px` is recommended for `width`.

`corner` に `"1px"` 以上を指定すると、`text-stroke` の鋭い結合ではなく、円形に重ねた `text-shadow` でアウトラインを描画します。値を大きくするほど描画点が増え、角がなめらかになります。初期値の `corner: "0px"` では `text-stroke` を使用します。角丸描画では、`width` は `px` 指定を推奨します。

## Nested elements / 入れ子の要素

Outliner processes text nodes inside the selected element, so nested child elements can also receive an outline.

Outlinerは選択要素内のテキストノードを処理するため、入れ子になった子要素の文字にもアウトラインを付けられます。

```html
<p class="outline-parent">
  <span>Outlined text / アウトラインを付ける文字</span>
</p>

<script src="jquery.js"></script>
<script src="outliner.js"></script>
<script>
  $(".outline-parent").outliner();
</script>
```

## License / ライセンス

Released under the [MIT License](./LICENSE). Copyright © 2025 Katsuyori Murakami.

[MITライセンス](./LICENSE)で公開しています。著作権者はKatsuyori Murakamiです。
