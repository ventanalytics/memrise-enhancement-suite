// ==UserScript==
// @name           Memrise LaTeX Integration
// @description    This will convert any text that looks like LaTeX inline math (beginning and ending with $) into an image of a well-formatted math expression
// @match          http://www.memrise.com/course/*/*/
// @match          http://www.memrise.com/course/*/garden/*
// @match          http://www.memrise.com/garden/*
// @require        https://greasyfork.org/scripts/5908-cross-platform-object-watch-js/code/cross-platform-objectwatchjs.js?version=22033
// @version        1.0
// @namespace      https://greasyfork.org/users/5238-carpiediem
// @downloadURL    https://github.com/carpiediem/memrise-enhancement-suite/raw/master/memrise-latex-integration.user.js
// @grant          none
// @run-at         document-end
// ==/UserScript==

//jsLaTeX v1.2.2 - jQuery plugin Copyright (c) 2009 Andreas Grech  <https://github.com/dreasgrech/jsLatex>
(function($){var attachToImage=function(){return $("<img/>").attr({src:this.src})},formats={'gif':attachToImage,'png':attachToImage,'swf':function(){return $("<embed/>").attr({src:this.src,type:'application/x-shockwave-flash'})}},sections={'{f}':'format','{e}':'equation'},escapes={'+':'2B','=':'3D'};$.fn.latex=function(opts){opts=$.extend({},$.fn.latex.defaults,opts);opts.format=formats[opts.format]?opts.format:'gif';return this.each(function(){var $this=$(this),format,s,element,url=opts.url;opts.equation=$.trim($this.text());for(s in sections){if(sections.hasOwnProperty(s)&&(format=url.indexOf(s))>=0){url=url.replace(s,opts[sections[s]])}}for(s in escapes){if(escapes.hasOwnProperty(s)&&(format=url.indexOf(s))>=0){url=url.replace(s,'%'+escapes[s])}}opts.src=url;element=formats[opts.format].call(opts);$this.html('').append(element);if(opts.callback){opts.callback.call(element)}})};$.fn.latex.defaults={format:'gif',url:'http://latex.codecogs.com/{f}.latex?{e}'}}(jQuery));

var re_LaTeX = /^\s*\$(.+)\$\s*$/;

// On the level list page, check each row in both columns A & B
var levelListCells = $(".col_a div, .col_b div");
for (var i=0; i<levelListCells.size(); i++) {
  var reArr = levelListCells.eq(i).text().match(re_LaTeX);
  if (reArr)  levelListCells.eq(i).text(reArr[1]).latex({format:"png"});
}


// On the garden page, trigger every time the page content changes
if (typeof(MEMRISE.garden)!="undefined") MEMRISE.garden.watch('box', function (id, oldval, newval) {
  if (typeof(newval)==undefined) return false;
  //console.log('The box template is now ' + newval.box_dict.template);
  setTimeout(function(){
    var gardenText = $("div.row-value, div.qquestion, li.choice span.val");
      for (var i=0; i<gardenText.size(); i++) {
        var reArr = gardenText.eq(i).text().match(re_LaTeX);
        if (reArr) {
          gardenText.eq(i).text( gardenText.eq(i).text().replace(/\$/g,"") );  //For some reason, $ are pushed into the image URL in this case, but not on the level list
          gardenText.eq(i).latex({format:"png"});
        }
      }
  }, 200);
  return newval;
});
