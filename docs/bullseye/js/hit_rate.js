Math.roundf = function( value, keta ){
  return Math.round( value * 10 ** keta ) / 10 ** keta ;
}

function grouping_radius_from_hit_rate( hit_rate ){
  var bull_radius     = 22 ; // mm
  var grouping_radius = Math.sqrt( ( bull_radius * bull_radius * 100 ) / hit_rate );

  return Math.roundf( grouping_radius, 2 );
}

function hit_rate_from_grouping_radius( g_radius ){
  var bull_radius = 22; // mm
  var hit_rate    = (bull_radius*bull_radius)/(g_radius*g_radius)*100;

  return Math.roundf( hit_rate, 2 );
}

var png = new Image();
png.src = "./img/soft_board.png";

function draw_grouping_circle(){
  var canvas_w  = document.getElementById('canvas_wrapper');
  var canvas    = document.getElementById('canvas');
  canvas.width  = 400;
  canvas.height = 400;

  var h = Math.roundf( slider_hit_rate.noUiSlider.get(), 2 );
  var g_radius = grouping_radius_from_hit_rate( h );
  
  var ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(png, 0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = '#f33';
  ctx.lineWidth = 1 ;
  ctx.beginPath();
  ctx.arc( canvas.width / 2, canvas.height / 2, ( canvas.width * 2 * g_radius / 1000 ), 0, Math.PI * 2);
  ctx.stroke();
}

function update_grouping(){
  var hit_rate = Math.roundf( slider_hit_rate.noUiSlider.get(), 2 );
  var target = grouping_radius_from_hit_rate( hit_rate );
  if( slider_grouping.noUiSlider.get() != Math.round(target) ){
    slider_grouping.noUiSlider.set(target);
    document.getElementById("text-grouping").value = target;
  }
  draw_grouping_circle();
  document.getElementById("text-hit-rate").value = hit_rate;
};

function update_hit_rate(){
  var g_radius = slider_grouping.noUiSlider.get()
    var target = hit_rate_from_grouping_radius( g_radius );
  if( slider_hit_rate.noUiSlider.get() != Math.round(target) ){
    slider_hit_rate.noUiSlider.set(target);
    document.getElementById("text-hit-rate").value = target;
  }
  document.getElementById("text-grouping").value = g_radius;
};

var slider_hit_rate;
var textbx_hit_rate;
var slider_grouping;
var textbx_grouping;

var timeoutId ;

window.addEventListener( "resize",
  function () {
    clearTimeout( timeoutId ) ;
    timeoutId = setTimeout( draw_grouping_circle, 1 ) ;
  }
);

window.onload = function(){

  slider_hit_rate = document.getElementById("slider-hit-rate");
  textbx_hit_rate = document.getElementById("text-hit-rate");

  slider_grouping = document.getElementById("slider-grouping");
  textbx_grouping = document.getElementById("text-grouping");

  var func_update_hit_rate_value = function(){ document.getElementById("text-hit-rate").value = slider_hit_rate.noUiSlider.get(); };
  var func_update_grouping_value = function(){ document.getElementById("text-grouping").value = slider_grouping.noUiSlider.get(); };

  textbx_hit_rate.oninput = function(){ slider_hit_rate.noUiSlider.set( textbx_hit_rate.value ); };
  textbx_grouping.oninput = function(){ slider_grouping.noUiSlider.set( textbx_grouping.value ); };

  noUiSlider.create( slider_hit_rate, { start: [ 20],    step: 1, range: { 'min': 1,  'max': 100 } });
  noUiSlider.create( slider_grouping, { start: [ 49.19], step: 1, range: { 'min': 22, 'max': 225 } });

  slider_hit_rate.noUiSlider.on('update', func_update_hit_rate_value );
  slider_hit_rate.noUiSlider.on('set',    update_grouping );

  slider_grouping.noUiSlider.on('update', func_update_grouping_value );
  slider_grouping.noUiSlider.on('set',    update_hit_rate );

  draw_grouping_circle();
}
