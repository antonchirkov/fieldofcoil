// Жидкость из пробирки

(function (lib, img, cjs, ss) {

var p; // shortcut to reference prototypes

// library properties:
lib.properties = {
	width: 35,
	height: 85,
	scale: 0.9,
	fps: 12,
	color: "#E9E9E9", // "rgba(238, 202, 170, 0.5)"
	opacity: 1.00,
	size: 40,	// высота жидкости (max 40ml, min 10ml)
	manifest: [],
};



lib.ssMetadata = [];


// symbols:

// Налет ------------------------------------------------------------------------
(lib.Tween1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});
	
	// #E9E9E9
	
	var color = lib.properties.color || lib.properties.defColor,
		rgba = colorToArray(color);
	
	function prepareColor(diff)
	{
		var diffColor = [];
		for (var i=0; i<3; i++) {
			var c = rgba[i] - diff[i];
			if (c<0) c=0;
			if (c>255) c=255;
			diffColor.push(c);
		}
		var alfa = rgba[3] ? rgba[3] : 1;
		if (diff[3]) alfa -= diff[3];
		return 'rgba(' + diffColor.join(',') + ','+alfa+')';
	}

	var colors = {
		'#E9E9E9' : prepareColor([0, 0, 0, 0]),
		'#252525' : prepareColor([196, 196, 196, 0]),
		'#FFFFFF' : prepareColor([-22, -22, -22, 0]),
	};
	
	/*
	function _tempDiff (color1, color2) {
		var diffColor = [];
		color1 = colorToArray(color1);
		color2 = colorToArray(color2);
		for (var i=0; i<3; i++) diffColor.push(color1[i]-color2[i]);
		console.log(color1[3], color2[3])
		diffColor.push((color1[3]||1) - (color2[3]||1));
		return diffColor;
	}
	_tempDiff('#E9E9E9', '#FFFFFF');
	*/	

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.lf([colors["#252525"],colors["#FFFFFF"],colors["#E9E9E9"],colors["#252525"]],[0,0.145,0.682,1],-11.5,9.6,11.5,9.6).s().p("AgFF0QhYgEgUg2IAAqsQBtAWB2gXIAAKtQgfA6hRAAIgHAAg");
	this.shape.setTransform(-0.1,-9.6);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-11.6,-27.6,23,55.3);

(lib.налет = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// налет
	this.instance_1 = new lib.Tween1("synched",0);
	this.instance_1.parent = this;
	this.instance_1.setTransform(15.9,107);
	this.instance_1.alpha = 0;

	this.timeline.addTween(cjs.Tween.get(this.instance_1).to({alpha:1},19).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0.1,0,32.2,134.6);
// Налет ------------------------------------------------------------------------


// stage content:
(lib.plaque = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Налет
	this.instance = new lib.налет();
	this.instance.parent = this;
	this.instance.setTransform(0,-65,1,1.1,0,0,0,0,0);
	
	this.clip = this.instance;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(427,456,80,334.5);

})(lib = lib||{}, images = images||{}, createjs = createjs||{}, ss = ss||{});
var lib, images, ss;

if (window.modelNS) {
	modelNS.IReact.libs.plaque = lib;
	lib = null;
}
