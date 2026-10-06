$(function () {
  $(".hero-title").outliner({ width: "0.06em", color: "#f5f7ff" });

  function renderDemo() {
    var width = $("#width-control").val() || 5;
    var color = $("#color-control").val() || "#f5f7ff";
    var corner = $("#rounded-control").is(":checked") ? "3px" : "0px";

    $("#width-value").text(width + "px");
    $("#demo-text").outliner({
      width: width + "px",
      color: color,
      corner: corner,
    });
  }

  $("#width-control, #color-control, #rounded-control").on("input change", renderDemo);
  renderDemo();

  $(".copy-button").on("click", function () {
    var button = $(this);
    var text = $("#" + button.data("copy-target")).text();
    navigator.clipboard.writeText(text).then(function () {
      button.text("Copied!");
      setTimeout(function () { button.text("Copy"); }, 1600);
    });
  });
});
