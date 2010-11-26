$(document).ready(function() {
  $('#svgTest').svg({
    settings: {
      height: 1000
    },
    onLoad: function(svg) {
      svg.add($('#kit'))
    }
  });
})
