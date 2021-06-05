(function (lib, img, cjs, ss) {

var p; // shortcut to reference prototypes

// library properties:
lib.properties = {
	width: 50,
	height: 130,
	scale:0.5,
	fps: 12,
	color: "#FFFF00",
	opacity: 1.00,
	manifest: []
};



lib.ssMetadata = [];


// symbols:



(lib.Tween1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("rgba(0,102,255,0.2)").s().p("AgFF0QhYgEgUg2IAAqsQBtAWB2gXIAAKtQgfA6hRAAIgHAAg");
	this.shape.setTransform(-0.1,-9.6);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-11.6,-46.8,23,74.5);


(lib.Symbol1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});
	
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
		'#FFFF00' : prepareColor([0, 0, 0, 0]),
		'#A67C2A' : prepareColor([89, 131, -42, 0]),
	};
	
	/*
	function _tempDiff (color1, color2)
	{
		var diffColor = [];
		color1 = colorToArray(color1);
		color2 = colorToArray(color2);
		for (var i=0; i<3; i++) diffColor.push(color1[i]-color2[i]);
		console.log(color1[3], color2[3])
		diffColor.push((color1[3]||1) - (color2[3]||1));
		return diffColor;
	}
	_tempDiff('#FFFF00', '#A67C2A');
	*/

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f(colors["#A67C2A"]).s().p("AgmAOIgIgGQgQgMgDgTQAGAGAKAFQAUAIAbABIAFAAQAagBATgIIAHgEIAJgGIACgCIAAABQgDATgRAMQgTARgbAAQgVAAgRgLg");
	this.shape.setTransform(6.7,9);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f(colors["#FFFF00"]).s().p("AgCAqQgbgBgUgIQgKgFgFgGIgBgHQAAgIACgHIABgCQAFgMAMgLQATgQAaAAQAbAAATAQQANALAEANIABABQACAHAAAIIAAAGIgCACIgJAGIgHAEQgTAIgaABg");
	this.shape_1.setTransform(6.7,4.3);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,13.3,11.5);


(lib.эмульсия = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.instance = new lib.Symbol1();
	this.instance.parent = this;
	this.instance.setTransform(33.1,5.5,0.436,0.436,0,0,0,6.7,5.8);
	this.instance.alpha = 0.801;

	this.instance_1 = new lib.Symbol1();
	this.instance_1.parent = this;
	this.instance_1.setTransform(6,15.5,0.543,0.696);
	this.instance_1.alpha = 0.801;

	this.instance_2 = new lib.Symbol1();
	this.instance_2.parent = this;
	this.instance_2.setTransform(13,67.7,0.57,0.723,2.7,0,0,0.1,0.1);
	this.instance_2.alpha = 0.801;

	this.instance_3 = new lib.Symbol1();
	this.instance_3.parent = this;
	this.instance_3.setTransform(25.7,110.9,0.586,0.586);
	this.instance_3.alpha = 0.801;

	this.instance_4 = new lib.Symbol1();
	this.instance_4.parent = this;
	this.instance_4.setTransform(8.7,112.6,0.432,0.549);
	this.instance_4.alpha = 0.801;

	this.instance_5 = new lib.Symbol1();
	this.instance_5.parent = this;
	this.instance_5.setTransform(14,113,0.543,0.696);
	this.instance_5.alpha = 0.801;

	this.instance_6 = new lib.Symbol1();
	this.instance_6.parent = this;
	this.instance_6.setTransform(9.8,13.9,0.957,0.957,0,0,0,6.9,5.9);
	this.instance_6.alpha = 0.801;

	this.instance_7 = new lib.Symbol1();
	this.instance_7.parent = this;
	this.instance_7.setTransform(9.4,109,1,1,0,0,0,6.7,5.8);
	this.instance_7.alpha = 0.801;

	this.instance_8 = new lib.Symbol1();
	this.instance_8.parent = this;
	this.instance_8.setTransform(18.2,51.5,0.382,0.489,0,0,0,0.3,0);
	this.instance_8.alpha = 0.801;

	this.instance_9 = new lib.Symbol1();
	this.instance_9.parent = this;
	this.instance_9.setTransform(7.7,80.3,0.432,0.549);
	this.instance_9.alpha = 0.801;

	this.instance_10 = new lib.Symbol1();
	this.instance_10.parent = this;
	this.instance_10.setTransform(25.1,99.3,0.922,0.766,0,0,0,6.8,5.8);
	this.instance_10.alpha = 0.801;

	this.instance_11 = new lib.Symbol1();
	this.instance_11.parent = this;
	this.instance_11.setTransform(24,26.4,0.586,0.586);
	this.instance_11.alpha = 0.801;

	this.instance_12 = new lib.Symbol1();
	this.instance_12.parent = this;
	this.instance_12.setTransform(25.6,17.3,0.436,0.436,0,0,0,6.7,5.8);
	this.instance_12.alpha = 0.801;

	this.instance_13 = new lib.Symbol1();
	this.instance_13.parent = this;
	this.instance_13.setTransform(18,11.5,1.304,1.304,0,0,0,6.7,5.8);
	this.instance_13.alpha = 0.801;

	this.instance_14 = new lib.Symbol1();
	this.instance_14.parent = this;
	this.instance_14.setTransform(12.2,5.3,0.737,0.737,0,0,0,6.7,5.8);
	this.instance_14.alpha = 0.801;

	this.instance_15 = new lib.Symbol1();
	this.instance_15.parent = this;
	this.instance_15.setTransform(28.7,9.3,1.217,1.217,0,0,0,6.7,5.8);
	this.instance_15.alpha = 0.801;

	this.instance_16 = new lib.Symbol1();
	this.instance_16.parent = this;
	this.instance_16.setTransform(21.7,4.3,0.737,0.737,0,0,0,6.7,5.8);
	this.instance_16.alpha = 0.801;

	this.instance_17 = new lib.Symbol1();
	this.instance_17.parent = this;
	this.instance_17.setTransform(5.4,6.8,0.737,0.737,0,0,0,6.7,5.8);
	this.instance_17.alpha = 0.801;

	this.instance_18 = new lib.Symbol1();
	this.instance_18.parent = this;
	this.instance_18.setTransform(12.2,41.8,0.624,0.624,0,0,0,6.7,5.8);
	this.instance_18.alpha = 0.801;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_18},{t:this.instance_17},{t:this.instance_16},{t:this.instance_15},{t:this.instance_14},{t:this.instance_13},{t:this.instance_12},{t:this.instance_11},{t:this.instance_10},{t:this.instance_9},{t:this.instance_8},{t:this.instance_7},{t:this.instance_6},{t:this.instance_5},{t:this.instance_4},{t:this.instance_3},{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,37,123.8);


// stage content:
(lib.blur = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.instance = new lib.эмульсия();
	this.instance.parent = this;
	this.instance.setTransform(25,63.1,1,1,0,0,0,18.5,61.9);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(31.5,88.2,37,123.8);

})(lib = lib||{}, images = images||{}, createjs = createjs||{}, ss = ss||{});
var lib, images, ss;

if (window.modelNS) {
	modelNS.IReact.libs.blur = lib;
	lib = null;
}