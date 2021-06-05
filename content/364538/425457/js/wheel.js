(function (lib, img, cjs, ss, an) {

var p; // shortcut to reference prototypes
lib.webFontTxtInst = {}; 
var loadedTypekitCount = 0;
var loadedGoogleCount = 0;
var gFontsUpdateCacheList = [];
var tFontsUpdateCacheList = [];
lib.ssMetadata = [];



lib.updateListCache = function (cacheList) {		
	for(var i = 0; i < cacheList.length; i++) {		
		if(cacheList[i].cacheCanvas)		
			cacheList[i].updateCache();		
	}		
};		

lib.addElementsToCache = function (textInst, cacheList) {		
	var cur = textInst;		
	while(cur != exportRoot) {		
		if(cacheList.indexOf(cur) != -1)		
			break;		
		cur = cur.parent;		
	}		
	if(cur != exportRoot) {		
		var cur2 = textInst;		
		var index = cacheList.indexOf(cur);		
		while(cur2 != cur) {		
			cacheList.splice(index, 0, cur2);		
			cur2 = cur2.parent;		
			index++;		
		}		
	}		
	else {		
		cur = textInst;		
		while(cur != exportRoot) {		
			cacheList.push(cur);		
			cur = cur.parent;		
		}		
	}		
};		

lib.gfontAvailable = function(family, totalGoogleCount) {		
	lib.properties.webfonts[family] = true;		
	var txtInst = lib.webFontTxtInst && lib.webFontTxtInst[family] || [];		
	for(var f = 0; f < txtInst.length; ++f)		
		lib.addElementsToCache(txtInst[f], gFontsUpdateCacheList);		

	loadedGoogleCount++;		
	if(loadedGoogleCount == totalGoogleCount) {		
		lib.updateListCache(gFontsUpdateCacheList);		
	}		
};		

lib.tfontAvailable = function(family, totalTypekitCount) {		
	lib.properties.webfonts[family] = true;		
	var txtInst = lib.webFontTxtInst && lib.webFontTxtInst[family] || [];		
	for(var f = 0; f < txtInst.length; ++f)		
		lib.addElementsToCache(txtInst[f], tFontsUpdateCacheList);		

	loadedTypekitCount++;		
	if(loadedTypekitCount == totalTypekitCount) {		
		lib.updateListCache(tFontsUpdateCacheList);		
	}		
};
// symbols:
// helper functions:

function mc_symbol_clone() {
	var clone = this._cloneProps(new this.constructor(this.mode, this.startPosition, this.loop));
	clone.gotoAndStop(this.currentFrame);
	clone.paused = this.paused;
	clone.framerate = this.framerate;
	return clone;
}

function getMCSymbolPrototype(symbol, nominalBounds, frameBounds) {
	var prototype = cjs.extend(symbol, cjs.MovieClip);
	prototype.clone = mc_symbol_clone;
	prototype.nominalBounds = nominalBounds;
	prototype.frameBounds = frameBounds;
	return prototype;
	}


(lib.Symbol8 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFFFF").s().p("AghDUQidijg9jVQgGgXAOgTQAOgTAYAAIGbAAQAcAAANAYQAOAYgOAXIjOFkQgLAVgYADIgGAAQgTAAgOgOg");
	this.shape.setTransform(85.5,187.2);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FFFFFF").s().p("AjNDiQgbAAgOgYQgOgYAOgXIDOlkQAMgVAXgDQAXgDAQARQCdCiA9DWQAHAXgPATQgOATgXAAg");
	this.shape_1.setTransform(207,105.2);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#FFFFFF").s().p("AjNDiQgYAAgOgTQgOgTAGgXQA9jVCdijQARgRAWADQAYADALAVIDOFkQAOAXgOAYQgNAYgcAAg");
	this.shape_2.setTransform(85.5,105.2);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#FFFFFF").s().p("AgFDiQgXgDgMgVIjOlkQgOgXAOgYQAOgYAbAAIGcAAQAXAAAOATQAPATgHAXQg9DWidCiQgOAOgTAAIgGAAg");
	this.shape_3.setTransform(207,187.2);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#FFFFFF").s().p("AgoDXIjOlkQgMgVAJgVQAJgWAXgGQBrgbBuAAQBuAABsAbQAXAGAJAWQAJAVgMAVIjOFkQgOAYgbAAQgaAAgOgYg");
	this.shape_4.setTransform(146.2,80.7);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#FFFFFF").s().p("AjZDUQgXgGgJgWQgJgVAMgVIDOlkQAOgYAaAAQAbAAAOAYIDOFkQAMAVgJAVQgJAWgXAGQhsAbhuAAQhuAAhrgbg");
	this.shape_5.setTransform(146.2,211.7);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("#FFFFFF").s().p("AgVAWQgKgJAAgNQAAgMAKgJQAJgJAMAAQANAAAJAJQAJAJAAAMQAAANgJAJQgJAJgNAAQgMAAgJgJg");
	this.shape_6.setTransform(159.8,132.7);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#FFFFFF").s().p("AgVAWQgJgJAAgNQAAgMAJgJQAJgJAMAAQANAAAJAJQAJAJAAAMQAAANgJAJQgJAJgNAAQgMAAgJgJg");
	this.shape_7.setTransform(132.7,159.8);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f("#FFFFFF").s().p("AgVAWQgJgJAAgNQAAgMAJgJQAJgJAMAAQANAAAJAJQAJAJAAAMQAAANgJAJQgJAJgNAAQgMAAgJgJg");
	this.shape_8.setTransform(165.4,146.2);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f("#FFFFFF").s().p("AgVAWQgJgJAAgNQAAgMAJgJQAJgJAMAAQANAAAJAJQAJAJAAAMQAAANgJAJQgJAJgNAAQgMAAgJgJg");
	this.shape_9.setTransform(127.1,146.2);

	this.shape_10 = new cjs.Shape();
	this.shape_10.graphics.f("#FFFFFF").s().p("AgVAWQgKgJAAgNQAAgMAKgJQAJgJAMAAQANAAAJAJQAJAJAAAMQAAANgJAJQgJAJgNAAQgMAAgJgJg");
	this.shape_10.setTransform(159.8,159.8);

	this.shape_11 = new cjs.Shape();
	this.shape_11.graphics.f("#FFFFFF").s().p("AgVAWQgJgJAAgNQAAgMAJgJQAJgJAMAAQANAAAJAJQAJAJAAAMQAAANgJAJQgJAJgNAAQgMAAgJgJg");
	this.shape_11.setTransform(132.7,132.7);

	this.shape_12 = new cjs.Shape();
	this.shape_12.graphics.f("#FFFFFF").s().p("AgVAXQgJgKAAgNQAAgMAJgJQAJgJAMAAQANAAAJAJQAJAJAAAMQAAANgJAKQgJAJgNAAQgMAAgJgJg");
	this.shape_12.setTransform(146.2,165.4);

	this.shape_13 = new cjs.Shape();
	this.shape_13.graphics.f("#FFFFFF").s().p("AgVAWQgJgJAAgNQAAgMAJgJQAJgJAMAAQANAAAJAJQAJAJAAAMQAAANgJAJQgJAJgNAAQgMAAgJgJg");
	this.shape_13.setTransform(146.2,127);

	this.shape_14 = new cjs.Shape();
	this.shape_14.graphics.f("#FFFFFF").s().p("AgrAsQgTgSAAgaQAAgZATgSQASgTAZAAQAaAAASATQATASgBAZQABAagTASQgSATgaAAQgZAAgSgTg");
	this.shape_14.setTransform(146.3,146.2);

	this.shape_15 = new cjs.Shape();
	this.shape_15.graphics.f("#000000").s().p("AmBOUQizhMiJiKQiKiJhLizQhPi4AAjKQAAjJBPi4QBLizCKiJQCJiKCzhMQC4hODJAAQDKAAC5BOQCyBMCKCKQCJCJBMCzQBOC4AADJQAADKhOC4QhMCziJCJQiKCKiyBMQi5BOjKAAQjJAAi4hOg");
	this.shape_15.setTransform(146.2,146.2);

	this.shape_16 = new cjs.Shape();
	this.shape_16.graphics.f("#6B6B6B").s().p("AmgPcQjAhSiViUQiUiVhSjAQhUjHAAjaQAAjZBUjHQBSjACUiVQCViUDAhSQDHhUDZAAQDaAADHBUQDABSCVCUQCUCVBSDAQBUDHAADZQAADahUDHQhSDAiUCVQiVCUjABSQjHBUjaAAQjZAAjHhUg");
	this.shape_16.setTransform(146.2,146.2);

	this.shape_17 = new cjs.Shape();
	this.shape_17.graphics.f("#FFFFFF").s().p("AmwQAQjHhUiZiaQibiahUjIQhYjOABjiQgBjhBYjOQBUjICbiaQCZiaDHhUQDPhYDhAAQDiAADOBYQDIBUCZCaQCbCaBUDIQBYDOAADhQAADihYDOQhUDIibCaQiZCajIBUQjOBYjiAAQjhAAjPhYg");
	this.shape_17.setTransform(146.3,146.2);

	this.shape_18 = new cjs.Shape();
	this.shape_18.graphics.f("#000000").s().p("AoZT7Qj4hpjAjAQi/jAhqj4QhtkBAAkZQAAkYBtkBQBqj4C/jAQDAjAD4hpQEBhtEYAAQEZAAEBBtQD4BpDADAQC/DABqD4QBtEBAAEYQAAEZhtEBQhqD4i/DAQjADAj4BpQkBBtkZAAQkYAAkBhtg");
	this.shape_18.setTransform(146.3,146.2);

	this.shape_19 = new cjs.Shape();
	this.shape_19.graphics.f("#494949").s().p("Ao4VDQkGhvjLjKQjKjKhvkHQhzkQAAkpQAAkpBzkPQBvkHDKjKQDLjKEGhvQEQhzEoAAQEqAAEPBzQEHBvDKDKQDKDKBvEHQBzEPAAEpQAAEphzEQQhvEHjKDKQjKDKkHBvQkPBzkqAAQkoAAkQhzg");
	this.shape_19.setTransform(146.2,146.2);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_19},{t:this.shape_18},{t:this.shape_17},{t:this.shape_16},{t:this.shape_15},{t:this.shape_14},{t:this.shape_13},{t:this.shape_12},{t:this.shape_11},{t:this.shape_10},{t:this.shape_9},{t:this.shape_8},{t:this.shape_7},{t:this.shape_6},{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

}).prototype = getMCSymbolPrototype(lib.Symbol8, new cjs.Rectangle(0,0,292.5,292.5), null);


// stage content:
(lib.wheel = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 7
	this.instance = new lib.Symbol8();
	this.instance.parent = this;
	this.instance.setTransform(245,205.1,1,1,0,0,0,146.2,146.2);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(373.8,258.9,292.5,292.5);
// library properties:
lib.properties = {
	width: 550,
	height: 400,
	fps: 24,
	color: "#FFFFFF",
	opacity: 1.00,
	webfonts: {},
	manifest: [],
	preloads: []
};




})(lib = lib||{}, images = images||{}, createjs = createjs||{}, ss = ss||{}, AdobeAn = AdobeAn||{});
var lib, images, createjs, ss, AdobeAn;


if (modelNS.IPhysicCollisionsCar) {
	modelNS.IPhysicCollisionsCar.Wheel = lib;
	lib = null;
}