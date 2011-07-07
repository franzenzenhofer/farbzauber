var drawingBoardCanvas, isthere = false, loaddone = false, mainImage, originalCanvas, originalCanvasContext, brushCanvas, brushIO, brushIOimagedata, brushIOimagedatadata, brushIOimagedatadataA, brushsize=50, bsradius=Math.floor(brushsize/2),bsradius2=(bsradius*bsradius), BrushCanvasCollection = {}, getImageCanvas = function(a) {
 // alert(a.width);
 // alert(a.height);
  var h = document.createElement("canvas");
  h.width = a.width;
  h.height = a.height;
  oCanvasContext = h.getContext("2d");
  oCanvasContext.drawImage(a, 0, 0, h.width, h.height);
  //$(a).attr('style', 'border:1px solid green;');
  //$(h).attr('style', 'border:1px solid blue;');
  //$('body').append(a);
  //$('body').append(h);
  return h
}, setBrushCanvas = function(a,n) {
  var stored = false;
  if(n){
    if(BrushCanvasCollection[n])
    {
      stored = true; 
      brushCanvas = BrushCanvasCollection[n]['canvas'];
      brushIOimagedata = BrushCanvasCollection[n]['data'];
      brushIOimagedatadata=brushIOimagedata.data;
      brushIOimagedatadataA  = BrushCanvasCollection[n]['dataA'];
    }
  }
  if(!stored)
  {
    if(typeof a == 'function')
    {
      a = a();
    }
    brushCanvas = a;
    brushIO = $.inim.canvasIoFactory($(brushCanvas), true);
    brushIOimagedata = brushIO[1];
    brushIOimagedatadata = brushIOimagedata.data;
    brushIOimagedatadataA = [];
    for(a = 0;a < brushIOimagedatadata.length;a++) {
      brushIOimagedatadataA[a] = brushIOimagedatadata[a]
    }
    if(n)
    {
      BrushCanvasCollection[n]={
        'canvas': brushCanvas,
        'data': brushIOimagedata,
        'dataA': brushIOimagedatadataA 
      }
    }
  }
   if(n&&$('#'+n).get(0))
    {
      $('.circle').removeClass('high');
      $('#'+n).addClass('high');
      $('#brushsize').hide();
    }
  return this
};
function handleFileSelect(a) {
  a.stopPropagation();
  a.preventDefault();
  f = (a.target.files ? a.target.files : a.dataTransfer.files)[0];
  if(f.type.match("image.*")) {
    if(isthere === true)
    {
      $("#list").empty();
      loaddone = false;
      BrushCanvasCollection = {};
    }
    a = new FileReader;
    a.onloadstart = function() {
      //alert("onloadstart")
    };
    a.onerror = function(h) {
     // alert("onerror");
      //alert(h)
    };
    a.onload = function() {
      return function(h) {
        var m = $(document.createElement("img"));
        mainImage = m[0];
        $(m).load(function() {
          if(loaddone===true)
            {
              //alert('hohoho');
              return this;
            }
            loaddone = true;
          
         // alert("hi");
          var b = drawingBoardCanvas;
          $(m).hide().appendTo("#list");
          var u = this.width, x = this.height;
          if(this.width > $(window).width()) {
            this.width = Math.floor($(window).width() * 0.9);
            this.height = Math.floor(this.height * (this.width / u))
          }
          if(this.height > $(window).height()) {
            this.height = Math.floor($(window).height() * 0.9);
            if(u == this.width) {
              this.width = Math.floor(this.width * (this.height / x))
            }
          }
          originalCanvas = getImageCanvas(this);
          setBrushCanvas(originalCanvas,'color');
          /*document.createElement("canvas");
          originalCanvas.width = this.width;
          originalCanvas.height = this.height;
          originalCanvasContext = originalCanvas.getContext("2d");
          originalCanvasContext.drawImage(this, 0, 0, this.width, this.height);
          */
          b = $(m).inimImgCanvas(function(y) {
            
            
            b = y;
            setBrushCanvas($(b));
            var l = brushIO[1].width, q = brushIO[1].height;
            $(b).inimBwOutline();
            $("#start").hide();
            $(b).fadeIn(2E3).addClass("shadow");
            $('#tools').fadeIn(500).draggable({ axis: 'x', delay: 200, start: function(){$('#brushsize').fadeOut(200);}  });
            isthere = true;
            $(b).inimBwOutline();
            var r = $.inim.canvasIoFactory($(b), true), v = r[1], z = v.data, w = function(d, A) {
            
              var g = $(A).offset(), e = d.pageX - g.left, i = d.pageY - g.top;
              g = e - bsradius;
             
              var j = i - bsradius, n = brushsize;
              if(n > l - g) {
                n = l - g
              }else {
                if(e < bsradius) {
                  n = e + bsradius
                }
              }
              e = brushsize;
              if(e > q - j) {
                e = q - j
              }else {
                if(i < bsradius) {
                  e = i + bsradius
                }
              }
              if(g < 0 || g + brushsize > l || j < 0 || j + brushsize > q) {
                i = e = false
              }else {
                e = r[0].getImageData(g, j, n, e);
                i = e.data
              }
              for(var o = 0;o < brushsize;o++) {
                for(var p = 0;p < brushsize;p++) {
                  var c = o - bsradius;
                  c = c * c;
                  var k = p - bsradius, B = k * k;
                  k = g + o;
                  var s = j + p;
                  if(k > -1 && k <= l && s > -1 && s <= q) {
                    if(c + B < bsradius2) { 
                      c = $.inim.getPixelOpt(brushIOimagedatadataA, k, s, l);
                      $.inim.setPixelOpt(z, k, s, c[2], c[3], c[4], c[5], l);
                      i !== false && $.inim.setPixelOpt(i, o, p, c[2], c[3], c[4], c[5], n)
                    }
                  }
                }
              }
              i === false ? r[0].putImageData(v, 0, 0) : r[0].putImageData(e, g, j)
            }, t = false;
            $(b).mousemove(function(d) {
              t && w(d, this)
            });
            $(b).click(function(d) {
              w(d, this); 
              //alert('click '+d.pageX+' this'+this);
            });
            $(b).mousedown(function() {
              t = true
            });
            $(b).mouseup(function() {
              t = false
            });
            $(b).bind("touchstart", function(d) {
              d.preventDefault()
            });
            $(b).bind("touchend", function(d) {
              d.preventDefault()
            });
            $(b).bind("touchmove", function(d) {
              d.preventDefault();
              w(d.originalEvent.touches[0] || d.originalEvent.changedTouches[0], this)
            })
          })
        });
        $(m).attr("src", h.target.result)
      }
    }(f);
    a.readAsDataURL(f)
  }
}
function handleDragOver(a) {
  a.stopPropagation();
  a.preventDefault();
}
var dropZone = document.getElementById("drop_zone");
dropZone.addEventListener("dragover", handleDragOver, false);
dropZone.addEventListener("drop", handleFileSelect, false);
document.getElementById("files").addEventListener("change", handleFileSelect, false);

$('output').mousedown(function(e){ e.preventDefault(); });

//onclick="setBrushCanvas($(getImageCanvas(mainImage)).inimBlackWhite(),'bw');" 
//onclick="setBrushCanvas(getImageCanvas(mainImage),'color');"
$('#color').click(function(){setBrushCanvas(function(){return getImageCanvas(mainImage)},'color');});
$('.draw').qtip({
   position: { corner: {target: 'rightMiddle', tooltip: 'leftMiddle'}},
   style: {  name: 'cream',  tip: 'leftMiddle', border: {width: 2, radius: 5 }  }
});
$('#bw').click(function(){setBrushCanvas(function(){return $(getImageCanvas(mainImage)).inimBlackWhite();},'bw');});
$('#red').click(function(){setBrushCanvas(function(){return $(getImageCanvas(mainImage)).inimRed();},'red');});
$('#blue').click(function(){setBrushCanvas(function(){return $(getImageCanvas(mainImage)).inimBlue();},'blue');});
$('#green').click(function(){setBrushCanvas(function(){return $(getImageCanvas(mainImage)).inimGreen();},'green');});
$('#yellow').click(function(){setBrushCanvas(function(){return $(getImageCanvas(mainImage)).inimYellow();},'yellow');});
$('#magenta').click(function(){setBrushCanvas(function(){return $(getImageCanvas(mainImage)).inimMagenta();},'magenta');});
$('#aqua').click(function(){setBrushCanvas(function(){return $(getImageCanvas(mainImage)).inimAqua();},'aqua');});
//setBrushCanvas($(getImageCanvas(mainImage)).inimInvert(),'invert');
$('#invert').click(function(){setBrushCanvas(function(){return $(getImageCanvas(mainImage)).inimInvert();},'invert');});
$('#b').click(function(){brushsizer();});
$('#b').qtip({
   position: { corner: {target: 'topMiddle', tooltip: 'leftBottom'}},
   style: {  name: 'cream',  tip: 'bottomLeft', border: { width: 2, radius:5 }  }
});

$('#d').click(function(){ Canvas2Image.saveAsPNG($('#_canvas').get(0)); });
$('#d').qtip({
   position: { corner: {target: 'topMiddle', tooltip: 'leftBottom'}},
   style: {  name: 'cream',  tip: 'bottomLeft', border: { width: 2, radius:5 }  }
});
$('#sizeofbrush').change(function(e){
  brushsize=$(this).val();
  bsradius=Math.floor(brushsize/2);
  bsradius2=(bsradius*bsradius);
});

var brushsizer = function()
{
  //get current brush size
  
  //display brushsize next to the #b
  var b = $('#b').get(0);
  var bs =  $('#brushsize').get(0);
  //$('#brushsize').css('top', b.offsetTop);
  //$('#brushsize').css('left', b.offsetLeft);
    var vari = 55;
    if($(window).width()-($(b).offset().left+vari)<310&&$(b).offset().left+vari>310)
    {
      vari = -310;
    }
    $('#brushsize').toggle().css({ position:'fixed',
 bottom:68+'px',
 left:$(b).offset().left+vari+'px'});
 //alert($(b).offset().left);
  //$('#brushsize').css('left', 0);
  
}
