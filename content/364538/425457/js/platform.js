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



// stage content:
(lib.platform = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});
	
		var color = lib.properties.color || '#A74747',
		rgb = color.indexOf('#')===0 ? convertToRGB(color) : color,
		colors = {
			'#A74747' : prepareColor([0, 0, 0]),
			'#972F2F' : prepareColor([16, 24, 24]),
			'#cf7272' : prepareColor([-40, -43, -43]),
			'#622121' : prepareColor([69, 38, 38]),
		};

	/*
	function _tempDiff (color1, color2)
	{
		var diffColor = [];
		color1 = convertToRGB(color1);
		color2 = convertToRGB(color2);
		for (var i=0; i<3; i++) diffColor.push(color1[i]-color2[i]);
		return diffColor;
	}
	_tempDiff("#948653", "#7E7247");
	*/

	function prepareColor(diff)
	{
		var diffColor = [];
		for (var i=0; i<3; i++)
		{
			var c = rgb[i] - diff[i];
			if (c<0) c=0;
			if (c>255) c=255;
			diffColor.push(c);
		}
		return 'rgba(' + diffColor.join(',') + ',1)';
	}

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f(colors["#972F2F"]).s().p("AjIBnIBAhBIgGANQgNAdAAAqQAAApANAdQAKAYAOAFIhQBPgADJkrIAAA2IgsAAIgCAAQgQABgMAcQgNAeAAApQAAAqANAcQAKAYANAFIhFBEIjBAAIgCAAQgEAAgDACg");
	this.shape.setTransform(310.2,220);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f(colors["#A74747"]).s().p("Au1hiIdpgBIAAABIACDFI9rABg");
	this.shape_1.setTransform(195.3,240.1);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#666666").s().p("AlmDqIgBAAIgEgBQgOgEgLgZQgMgdAAgpQAAgqAMgdIAHgMIAOgPQAEgCAEAAIABAAIDDAAIEmAAQgRAAgMAdQgNAdAAAqQAAApANAdQAMAdARABgAhYghIgBAAIgFgBQgOgEgKgYQgMgdAAgqQAAgpAMgeQAMgcARgBIABAAIAtAAIG8AAQgRABgMAcQgNAeAAApQAAAqANAdQAMAdARAAg");
	this.shape_2.setTransform(334.7,218.7);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#454545").s().p("AiGDqQgRgBgNgdQgNgdAAgpQAAgqANgdQANgdARAAIAAAAQARAAANAdQANAdAAAqQAAApgNAdQgNAegRAAgACHghQgRAAgNgdQgNgdAAgqQAAgpANgeQANgcARgBIAAAAQARAAANAdQANAeAAApQAAAqgNAdQgNAdgRAAg");
	this.shape_3.setTransform(361.4,218.7);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.lf([colors["#cf7272"],colors["#622121"]],[0,1],0.4,-22.1,-0.3,22.1).s().p("ALsDII9pABIGQmRIdrAAIlDFCIgPAPIhABAg");
	this.shape_4.setTransform(215.3,210.1);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	// Layer 2
	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#666666").s().p("AloDyIgCAAQgQgBgMgcQgNgdAAgqQAAgpANgeQAMgcAQgBIACAAIHpAAQgRABgNAcQgMAeAAApQAAAqAMAdQANAdARAAgAhVgpIgCAAQgQgCgMgcQgNgdAAgpQAAgqANgdQAMgcAQgBIACAAIHpAAQgRAAgNAdQgMAdAAAqQAAApAMAdQANAdARABg");
	this.shape_5.setTransform(94.9,219.6);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("#454545").s().p("AiJDyQgRAAgNgdQgMgdAAgqQAAgpAMgeQANgcARgBIABAAQARAAAMAdQANAeAAApQAAAqgNAdQgMAdgRAAgACJgpQgRgBgMgdQgNgdAAgpQAAgqANgdQAMgdARAAIAAAAQASAAANAdQAMAdAAAqQAAApgMAdQgNAegSAAg");
	this.shape_6.setTransform(121.6,219.6);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_6},{t:this.shape_5}]}).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(329.5,390,324.7,60.2);
// library properties:
lib.properties = {
	width: 550,
	height: 400,
	fps: 24,
	// color: "#FFFFFF",
	opacity: 1.00,
	webfonts: {},
	manifest: [],
	preloads: []
};




})(lib = lib||{}, images = images||{}, createjs = createjs||{}, ss = ss||{}, AdobeAn = AdobeAn||{});
var lib, images, createjs, ss, AdobeAn;

if (modelNS.IPhysicCollisionsCar) {
	modelNS.IPhysicCollisionsCar.Platform = lib;
	lib = null;
}