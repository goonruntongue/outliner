# Outliner Vanilla

Dependency-free JavaScript edition of [jQuery Outliner](https://github.com/goonruntongue/outliner). It adds an outline behind HTML text while preserving the original fill color.

```html
<script src="https://cdn.jsdelivr.net/npm/@goonruntongue/outliner-vanilla@1/dist/outliner-vanilla.min.js"></script>
<script>
  Outliner.apply(".headline", {
    width: "5px",
    color: "#ffffff",
    corner: "3px"
  });
</script>
```

`corner: "0px"` uses text stroke. A positive `corner` value uses a smoother, rounded text-shadow outline.
