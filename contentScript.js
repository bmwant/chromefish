import { SVG } from '@svgdotjs/svg.js'


var draw = SVG().addTo('body').size(300, 300).addClass('cf-draw-area');

var line = draw.line(0, 0, 100, 150)
  .stroke({ color: '#f06', width: 5, linecap: 'round' });
line.marker('end', 4, 4, function(add) {
  add.path('M0,0 V4 L3,2 Z').size(4, 4);
  this.fill('#f06');
});

