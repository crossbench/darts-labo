function no_scaling()    { document.addEventListener("touchmove", mobile_no_scroll, { passive: false }); }
function return_scaling(){ document.removeEventListener('touchmove', mobile_no_scroll, { passive: false }); }
function mobile_no_scroll(event) { if (event.touches.length >= 2) { event.preventDefault(); } }

Math.roundf = function( value, keta ){
  return Math.round( value * ( 10.0 ** keta ) ) / 10.0 ** keta ;
}

function grouping_radius_from_hit_rate( hit_rate ){
  var bull_radius     = 22 ; // mm
  var grouping_radius = Math.sqrt( ( bull_radius * bull_radius * 100 ) / hit_rate );

  return Math.roundf( grouping_radius, 2 );
}

function grouping_radius_from_hit_rate_with_cep( hit_rate, prob ){
  var bull_radius     = 22;
  var grouping_radius = bull_radius * Math.sqrt( Math.log( 1 - prob ) / Math.log( 1 - hit_rate * 1.0 / 100 ) );

  return Math.roundf( grouping_radius, 2 );
}

function hit_rate_from_grouping_radius( g_radius ){
  var bull_radius = 22; // mm
  var hit_rate    = (bull_radius*bull_radius)/(g_radius*g_radius)*100;

  return Math.roundf( hit_rate, 2 );
}

function prob_from_hit_rate( hit_rate ){
  var sbull_radius = 22.0; // mm
  var dbull_radius =  9.0; // mm

  var prob_raw = 1 - Math.exp( ( dbull_radius * dbull_radius ) / ( sbull_radius * sbull_radius ) * Math.log( 1 - hit_rate * 1.0 / 100 ) );

  return Math.roundf( prob_raw * 100, 2 );
}

var png = new Image();
png.src = "./img/soft_board.png";

function draw_grouping_circle(){
  var canvas_w  = document.getElementById('canvas_wrapper');
  var canvas    = document.getElementById('canvas');
  canvas.width  = 400;
  canvas.height = 320;

  var h = Math.roundf( slider_hit_rate.noUiSlider.get(), 2 );

  var ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(png, 0, 0, canvas.width, canvas.height);
  ctx.lineWidth = 1 ;

  if( false ){
    var g_radius = grouping_radius_from_hit_rate( h );

    ctx.beginPath();
    ctx.strokeStyle = '#f33';
    ctx.arc( canvas.width / 2, canvas.height / 2, ( canvas.width * 2 * g_radius / 1000 ), 0, Math.PI * 2);
    ctx.stroke();
  }else{
    var g_radius_a = grouping_radius_from_hit_rate_with_cep( h, 1.0 / 3 );
    var g_radius_b = grouping_radius_from_hit_rate_with_cep( h, 1.0 / 2 );
    var g_radius_c = grouping_radius_from_hit_rate_with_cep( h, 1.0 - 1.0 / 3 );
    var g_radius_d = grouping_radius_from_hit_rate_with_cep( h, 1.0 - 1.0 / 24 );

    ctx.beginPath();
    ctx.strokeStyle = '#f33';
    ctx.arc( canvas.width / 2, canvas.height / 2, ( canvas.width * 2 * g_radius_a / 1000 ), 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = '#33f';
    ctx.arc( canvas.width / 2, canvas.height / 2, ( canvas.width * 2 * g_radius_b / 1000 ), 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = '#f3f';
    ctx.arc( canvas.width / 2, canvas.height / 2, ( canvas.width * 2 * g_radius_c / 1000 ), 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = '#3f3';
    ctx.arc( canvas.width / 2, canvas.height / 2, ( canvas.width * 2 * g_radius_d / 1000 ), 0, Math.PI * 2);
    ctx.stroke();

    document.getElementById("prob_db").innerHTML   = prob_from_hit_rate( h ) + " %";
    document.getElementById("radius_33").innerHTML = g_radius_a + "mm";
    document.getElementById("radius_50").innerHTML = g_radius_b + "mm";
    document.getElementById("radius_66").innerHTML = g_radius_c + "mm";
    document.getElementById("radius_96").innerHTML = g_radius_d + "mm";
  }
}

function update_grouping(){
  var hit_rate = Math.roundf( slider_hit_rate.noUiSlider.get(), 2 );
  var target = grouping_radius_from_hit_rate( hit_rate );
  draw_grouping_circle();
  document.getElementById("text-hit-rate").value = hit_rate;
};

var slider_hit_rate;
var textbx_hit_rate;

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

  var func_update_hit_rate_value = function(){ document.getElementById("text-hit-rate").value = slider_hit_rate.noUiSlider.get(); };

  textbx_hit_rate.oninput = function(){ slider_hit_rate.noUiSlider.set( textbx_hit_rate.value ); };

  noUiSlider.create( slider_hit_rate, { start: [ 20 ],   step: 1, range: { 'min': 1,  'max': 100 } });

  slider_hit_rate.noUiSlider.on('update', func_update_hit_rate_value );
  slider_hit_rate.noUiSlider.on('set',    update_grouping );

  draw_grouping_circle();
}
