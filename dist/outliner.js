/*!
 * jQuery Outliner Plugin v1.0.0
 * Make outlined text by cloning only text nodes, with optional rounded corners.
 *
 * MIT License
 * Copyright (c) 2025 Katsuyori Murakami
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to do so, subject to the
 * following conditions:
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

(function ($) {
  "use strict";

  var PLUGIN = "outliner";

  var defaults = {
    width: "4px", // outline width (e.g., "4px", "0.1em")
    color: "#000000", // outline color
    corner: "0px", // positive value switches to a rounded outline renderer
  };

  function pixelValue(value) {
    var parsed = parseFloat(value);
    return isFinite(parsed) && parsed > 0 ? parsed : 0;
  }

  /**
   * 文字の周囲に小さな text-shadow を円形に並べる。
   * text-stroke に linejoin はないため、この方式で角丸の輪郭を作る。
   */
  function roundedOutline(width, color, corner) {
    var radius = pixelValue(width) / 2;
    if (!radius) return "";

    // corner を大きくするほど円周上のサンプル数を増やし、より滑らかにする。
    var samples = Math.min(72, Math.max(16, Math.ceil(16 + pixelValue(corner) * 8)));
    var shadows = [];
    for (var i = 0; i < samples; i++) {
      var angle = (Math.PI * 2 * i) / samples;
      var x = Math.cos(angle) * radius;
      var y = Math.sin(angle) * radius;
      shadows.push(x.toFixed(2) + "px " + y.toFixed(2) + "px 0 " + color);
    }
    return shadows.join(", ");
  }

  /**
   * ストロークを .clone に適用
   * ※ 負の z-index は使わない（親背景の背面に落ちないようにする）
   */
  function applyStroke($clone, sw, sc, corner) {
    var rounded = pixelValue(corner) > 0;
    var styles = {
      position: "absolute",
      top: 0,
      left: 0,
      transform: "none",
      zIndex: 0, // ← 背面（同スタック内）だが負ではない
      pointerEvents: "none",
      color: "transparent", // 塗りは消して輪郭のみ
      whiteSpace: "pre-wrap",
      "-webkit-text-stroke": rounded ? "0 transparent" : sw + " " + sc,
      "text-stroke": rounded ? "0 transparent" : sw + " " + sc,
      textShadow: rounded ? roundedOutline(sw, sc, corner) : "none",
    };
    $clone.css(styles);
  }

  /**
   * ラッパと original の基本スタイル
   * ※ .outline-text に z-index:0 を与え、スタッキングコンテキストを形成
   *    → 親背景があっても .clone はその「上」に描画される
   */
  function styleWrap($wrap) {
    $wrap.css({
      position: "relative",
      display: "inline-block",
      lineHeight: "inherit",
      verticalAlign: "baseline",
      zIndex: 0, // ← スタッキングコンテキストの発生点
    });
    $wrap.children(".original").css({
      position: "relative",
      zIndex: 1, // ← 前面（塗り）
      whiteSpace: "pre-wrap",
    });
  }

  /**
   * DOM を壊さず対象のテキストノードを収集
   * （script/style/textarea/noscript/code/pre や既処理ノードは除外）
   */
  function collectTextNodes($root) {
    var SKIP_SELECTOR =
      "script,style,textarea,noscript,code,pre,.outline-text,.original,.clone";
    var result = [];

    function walk(node) {
      // Element
      if (node.nodeType === 1) {
        if ($(node).is(SKIP_SELECTOR)) return;
        var children = node.childNodes;
        for (var i = 0; i < children.length; i++) {
          walk(children[i]);
        }
        return;
      }
      // Text
      if (node.nodeType === 3) {
        var raw = node.nodeValue;
        if (!raw || !raw.replace(/\s+/g, "").length) return;
        var p = node.parentNode;
        if (
          p &&
          p.nodeType === 1 &&
          p.classList &&
          p.classList.contains("original")
        )
          return;
        result.push(node);
      }
    }

    $root.each(function () {
      walk(this);
    });

    return result;
  }

  /**
   * 単一のテキストノードをラップして返す
   * <span class="outline-text">
   *   <span class="original">[moved text node]</span>
   *   <span class="clone">[copied text]</span>
   * </span>
   *
   * ※ 先に insertBefore でラッパを差し込み、その後にテキストノードを移動
   *   （replaceWith 前に移動すると HierarchyRequestError になるため）
   */
  function wrapOneTextNode(textNode) {
    var raw = textNode.nodeValue;

    var $wrap = $('<span class="outline-text"></span>');
    var $orig = $('<span class="original"></span>');
    var $clone = $('<span class="clone" aria-hidden="true"></span>');
    $clone.text(raw);

    var parent = textNode.parentNode;
    parent.insertBefore($wrap[0], textNode); // 先に挿入

    $orig.append(textNode); // テキストノードを移動
    $wrap.append($orig, $clone); // 子を組み立て

    styleWrap($wrap); // 基本スタイル付与

    return $wrap;
  }

  /**
   * 初回ラップ処理
   */
  function initialWrap($root) {
    var nodes = collectTextNodes($root);
    for (var i = 0; i < nodes.length; i++) {
      wrapOneTextNode(nodes[i]);
    }
  }

  /**
   * 既存クローンへストロークを適用/更新
   */
  function updateClones($root, sw, sc, corner) {
    $root.find(".outline-text > .clone").each(function () {
      applyStroke($(this), sw, sc, corner);
    });
  }

  /**
   * jQuery プラグイン本体
   */
  $.fn[PLUGIN] = function (options) {
    var opts = $.extend({}, defaults, options || {});
    var sw = String(opts.width || defaults.width);
    var sc = String(opts.color || defaults.color);
    var corner = String(opts.corner || defaults.corner);

    return this.each(function () {
      var $target = $(this);

      // 初回ラップ（既ラップ箇所はスキップされる）
      initialWrap($target);

      // ストローク適用/更新
      updateClones($target, sw, sc, corner);
    });
  };
})(jQuery);
