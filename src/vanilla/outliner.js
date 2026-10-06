/*
 * Outliner Vanilla v1.0.0
 * Dependency-free text outlines that preserve the original fill.
 * MIT License — Katsuyori Murakami
 */
(function (global) {
  "use strict";

  var defaults = {
    width: "4px",
    color: "#000000",
    corner: "0px"
  };

  function number(value) {
    var parsed = parseFloat(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  }

  function roundedOutline(width, color, corner) {
    var radius = number(width) / 2;
    if (!radius) return "";

    var samples = Math.min(72, Math.max(16, Math.ceil(16 + number(corner) * 8)));
    var shadows = [];
    for (var i = 0; i < samples; i += 1) {
      var angle = (Math.PI * 2 * i) / samples;
      shadows.push(
        (Math.cos(angle) * radius).toFixed(2) + "px " +
        (Math.sin(angle) * radius).toFixed(2) + "px 0 " + color
      );
    }
    return shadows.join(", ");
  }

  function isSkipped(element) {
    return element && element.closest && element.closest(
      "script, style, textarea, noscript, code, pre, .outline-text, .original, .clone"
    );
  }

  function collectTextNodes(root) {
    var nodes = [];
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        if (!node.nodeValue || !node.nodeValue.replace(/\s+/g, "")) {
          return NodeFilter.FILTER_REJECT;
        }
        return isSkipped(node.parentElement)
          ? NodeFilter.FILTER_REJECT
          : NodeFilter.FILTER_ACCEPT;
      }
    });

    while (walker.nextNode()) nodes.push(walker.currentNode);
    return nodes;
  }

  function wrapTextNode(node) {
    var wrap = document.createElement("span");
    var original = document.createElement("span");
    var clone = document.createElement("span");

    wrap.className = "outline-text";
    original.className = "original";
    clone.className = "clone";
    clone.setAttribute("aria-hidden", "true");
    clone.textContent = node.nodeValue;

    wrap.style.position = "relative";
    wrap.style.display = "inline-block";
    wrap.style.lineHeight = "inherit";
    wrap.style.verticalAlign = "baseline";
    wrap.style.zIndex = "0";
    original.style.position = "relative";
    original.style.zIndex = "1";
    original.style.whiteSpace = "pre-wrap";

    node.parentNode.insertBefore(wrap, node);
    original.appendChild(node);
    wrap.append(original, clone);
  }

  function update(root, options) {
    var rounded = number(options.corner) > 0;
    root.querySelectorAll(".outline-text > .clone").forEach(function (clone) {
      clone.style.position = "absolute";
      clone.style.inset = "0 auto auto 0";
      clone.style.zIndex = "0";
      clone.style.pointerEvents = "none";
      clone.style.color = "transparent";
      clone.style.whiteSpace = "pre-wrap";
      clone.style.webkitTextStroke = rounded ? "0 transparent" : options.width + " " + options.color;
      clone.style.textStroke = rounded ? "0 transparent" : options.width + " " + options.color;
      clone.style.textShadow = rounded ? roundedOutline(options.width, options.color, options.corner) : "none";
    });
  }

  function elements(target) {
    if (typeof target === "string") return Array.from(document.querySelectorAll(target));
    if (target instanceof Element) return [target];
    return Array.from(target || []);
  }

  function apply(target, options) {
    var config = Object.assign({}, defaults, options || {});
    elements(target).forEach(function (root) {
      collectTextNodes(root).forEach(wrapTextNode);
      update(root, config);
    });
    return target;
  }

  var api = { apply: apply, defaults: defaults };
  global.Outliner = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(window);
