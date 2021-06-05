(function (lib, img, cjs, ss) {

var p; // shortcut to reference prototypes

// library properties:
lib.properties = {
	width: 155,
	height: 55,
	fps: 12,
	color: "#cc0000", // "#FFFFFF",
	opacity: 1.00,
	manifest: []
};



lib.ssMetadata = [];


// symbols:



(lib.gran = function(mode,startPosition,loop) {
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
		'#98977D' : prepareColor([0, 0, 0, 0]),
		'#FBFBFA' : prepareColor([-99, -100, -125, 0]),
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
	_tempDiff('#98977D', '#FBFBFA');
	*/

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.lf([colors["#98977D"],colors["#FBFBFA"],colors["#98977D"]],[0.02,0.345,0.925],-0.1,-0.2,21.9,0.6).s().p("AgBBKQgPgBgKgWQgKgWABgdQACgeALgWQALgUAMgBIACAAQAPABAJAWQAKAWgBAdQgBAfgMAVQgHAPgKAEIgFACIgCAAg");
	this.shape.setTransform(34.2,30.3);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.lf([colors["#98977D"],colors["#FBFBFA"],colors["#98977D"]],[0.02,0.345,0.925],-2.2,-7.5,2.2,7.6).s().p("AgoBEQALgVABgfQACgdgKgWQgJgWgQgBIgBAAIBRgZQAEgCAFAAIACAAQAPAAAJAWQAKAXgBAeQgBAdgMAVQgLAVgOAAIhSAZQAJgEAIgOg");
	this.shape_1.setTransform(40.8,28.9);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(30.6,20.2,16.5,17.6);


(lib.glassgran = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// лед
	this.instance_1 = new lib.gran();
	this.instance_1.parent = this;
	this.instance_1.setTransform(40.9,122.2,0.731,0.731,-56.2,0,0,40.6,28.8);

	this.instance_2 = new lib.gran();
	this.instance_2.parent = this;
	this.instance_2.setTransform(167.6,145.7,1,1,0,0,0,40.6,28.9);

	this.instance_3 = new lib.gran();
	this.instance_3.parent = this;
	this.instance_3.setTransform(137.5,155.5,0.78,0.78,130.3,0,0,40.6,28.8);

	this.instance_4 = new lib.gran();
	this.instance_4.parent = this;
	this.instance_4.setTransform(108.2,132.9,1,1,135,0,0,40.6,28.9);

	this.instance_5 = new lib.gran();
	this.instance_5.parent = this;
	this.instance_5.setTransform(104.7,142.7,1,1,0,0,0,40.6,28.9);

	this.instance_6 = new lib.gran();
	this.instance_6.parent = this;
	this.instance_6.setTransform(33.5,133.7,1,1,0,0,0,40.6,28.9);

	this.instance_7 = new lib.gran();
	this.instance_7.parent = this;
	this.instance_7.setTransform(94.6,133.7,1,1,0,0,0,40.6,28.9);

	this.instance_8 = new lib.gran();
	this.instance_8.parent = this;
	this.instance_8.setTransform(67.6,143.7,1,1,121.5,0,0,40.6,28.9);

	this.instance_9 = new lib.gran();
	this.instance_9.parent = this;
	this.instance_9.setTransform(48.9,133.3,0.77,0.77,0,0,0,40.6,28.9);

	this.instance_10 = new lib.gran();
	this.instance_10.parent = this;
	this.instance_10.setTransform(27.3,131.2,1,1,58.5,0,0,40.6,28.9);

	this.instance_11 = new lib.gran();
	this.instance_11.parent = this;
	this.instance_11.setTransform(18.2,141.7,1,1,0,0,0,40.6,28.9);

	this.instance_12 = new lib.gran();
	this.instance_12.parent = this;
	this.instance_12.setTransform(38.7,139.2,1,1,0,0,0,40.6,28.9);

	this.instance_13 = new lib.gran();
	this.instance_13.parent = this;
	this.instance_13.setTransform(55,142.5,1,1,0,0,0,40.6,28.9);

	this.instance_14 = new lib.gran();
	this.instance_14.parent = this;
	this.instance_14.setTransform(84.2,145.5,1,1,57.5,0,0,40.6,28.9);

	this.instance_15 = new lib.gran();
	this.instance_15.parent = this;
	this.instance_15.setTransform(109.4,155.2,1,1,-35.7,0,0,40.6,28.9);

	this.instance_16 = new lib.gran();
	this.instance_16.parent = this;
	this.instance_16.setTransform(126.2,143.4,1,1,175,0,0,40.6,29.2);

	this.instance_17 = new lib.gran();
	this.instance_17.parent = this;
	this.instance_17.setTransform(155.3,150.2,1,1,0,0,0,40.6,28.9);

	this.instance_18 = new lib.gran();
	this.instance_18.parent = this;
	this.instance_18.setTransform(144.2,140,1,1,0,0,0,40.6,28.9);

	this.instance_19 = new lib.gran();
	this.instance_19.parent = this;
	this.instance_19.setTransform(121.3,154.8,1,1,-140.3,0,0,40.6,28.9);

	this.instance_20 = new lib.gran();
	this.instance_20.parent = this;
	this.instance_20.setTransform(118.5,140.2,1,1,0,0,0,40.6,28.9);

	this.instance_21 = new lib.gran();
	this.instance_21.parent = this;
	this.instance_21.setTransform(54.4,156.7,1,1,37.2,0,0,40.6,28.9);

	this.instance_22 = new lib.gran();
	this.instance_22.parent = this;
	this.instance_22.setTransform(81.5,158.7,1,1,0,0,0,40.6,28.9);

	this.instance_23 = new lib.gran();
	this.instance_23.parent = this;
	this.instance_23.setTransform(93.6,156.8,1,1,0,0,0,40.6,28.9);

	this.instance_24 = new lib.gran();
	this.instance_24.parent = this;
	this.instance_24.setTransform(68.8,155.7,1,1,20.5,0,0,40.6,28.9);

	this.instance_25 = new lib.gran();
	this.instance_25.parent = this;
	this.instance_25.setTransform(40.8,151.1,1,1,-169.3,0,0,40.6,28.9);

	this.instance_26 = new lib.gran();
	this.instance_26.parent = this;
	this.instance_26.setTransform(28.4,150.7,1,1,0,0,0,40.6,28.9);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_26},{t:this.instance_25},{t:this.instance_24},{t:this.instance_23},{t:this.instance_22},{t:this.instance_21},{t:this.instance_20},{t:this.instance_19},{t:this.instance_18},{t:this.instance_17},{t:this.instance_16},{t:this.instance_15},{t:this.instance_14},{t:this.instance_13},{t:this.instance_12},{t:this.instance_11},{t:this.instance_10},{t:this.instance_9},{t:this.instance_8},{t:this.instance_7},{t:this.instance_6},{t:this.instance_5},{t:this.instance_4},{t:this.instance_3},{t:this.instance_2},{t:this.instance_1}]}).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,-44.6,180.3,234.5);


// stage content:
(lib.granules = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// множество
	if (lib.properties.size == Infinity) {
		this.instance = new lib.glassgran();
		this.instance.parent = this;
		this.instance.setTransform(78.5,0,0.905,1,0,0,0,92.9,115);

		this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));
	} else {
		// один
		this.instance = new lib.gran();
		this.instance.parent = this;
		this.instance.setTransform(74,45,1,1,0,0,0,38.9,28.9);

		this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));
	}
	

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(98.4,132.8,163.2,234.5);

})(lib = lib||{}, images = images||{}, createjs = createjs||{}, ss = ss||{});
var lib, images, ss;


if (window.modelNS) {
	modelNS.IReact.libs.granules = lib;
	lib = null;
}

