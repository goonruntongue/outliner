$(function () {
  $(".hero-title").outliner({ width: "0.06em", color: "#f5f7ff" });

  function renderDemo() {
    var width = $("#width-control").val() || 5;
    var color = $("#color-control").val() || "#f5f7ff";
    var rounded = $("#rounded-control").is(":checked");
    var smoothness = $("#corner-smoothness-control").val() || 3;
    var corner = rounded ? smoothness + "px" : "0px";

    $("#width-value").text(width + "px");
    $("#corner-control").prop("hidden", !rounded);
    $("#corner-smoothness-value").text(smoothness + "px");
    $("#demo-text").outliner({
      width: width + "px",
      color: color,
      corner: corner,
    });
    $("#usage-code code").text(
      '$(".headline").outliner({\n' +
      '  width: "' + width + 'px",\n' +
      '  color: "' + color + '",\n' +
      '  corner: "' + corner + '"\n' +
      "});"
    );
  }

  $("#width-control, #color-control, #rounded-control, #corner-smoothness-control").on("input change", renderDemo);
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
