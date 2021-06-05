(function (lib, img, cjs, ss) {

var p; // shortcut to reference prototypes

// library properties:
lib.properties = {
	width: 50,
	height: 130,
	// scale:0.6,
	fps: 12,
	color: "rgba(181,208,238,0.902)",
	opacity: 1.00,
	speed:1,
	manifest: []
};



lib.ssMetadata = [];


// symbols:



(lib.Tween2 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});
	
	// rgba(242,203,47,0.353);
	var color = lib.properties.color || lib.properties.defColor || 'rgba(242,203,47,0.353)',
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

	// брать в качестве основного - с наибольшей alfa
	var colors = {
		'rgba(181,208,238,0.902)': prepareColor([0, 0, 0, 0]),
		'rgba(251,251,255,0.298)': prepareColor([-70, -43, -17, 0.6040000000000001]), // 'rgba(251,251,255,0.298)'
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
	_tempDiff('rgba(181,208,238,0.902)', 'rgba(251,251,255,0.298)');
	*/


	var size = lib.properties.size || 1,
		spacing = 1, //0.1,
		distance = 1; //0.5;


	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.rf([colors["rgba(251,251,255,0.298)"],colors["rgba(181,208,238,0.902)"]],[0.365,1],0,0,0,0,0,1.8).s().p("AgBARQgGgBgDgDIgDgDQgEgFABgGQABgHAGgFQAFgEAEABIACAAQAEABADACQADABABADQAFAFgBAGIgDAIIgEAEQgEADgGAAIgBAAg");
	this.shape.setTransform(0.2*spacing,11.6*distance,size,size);
	
	// this.shape.graphics.rf(['rgba(181,208,238,0.902)','rgba(181,208,238,0.902)'],[0.365,1],0,0,0,0,0,1.8).s().p("AgBARQgGgBgDgDIgDgDQgEgFABgGQABgHAGgFQAFgEAEABIACAAQAEABADACQADABABADQAFAFgBAGIgDAIIgEAEQgEADgGAAIgBAAg");
	// this.shape.setTransform(0.2,11.6,0.8,0.8);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.rf([colors["rgba(251,251,255,0.298)"],colors["rgba(181,208,238,0.902)"]],[0.365,1],0,0,0,0,0,2.3).s().p("AgBAWQgIgBgEgEIgEgEQgFgHABgIQABgJAIgGQAGgFAGABIACAAQAGABAEADQADACACADQAGAHgBAHQgBAGgDAFIgFAFQgGAEgGAAIgCAAg");
	this.shape_1.setTransform(-1.8*spacing,31.8*distance,size,size);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.rf([colors["rgba(251,251,255,0.298)"],colors["rgba(181,208,238,0.902)"]],[0.365,1],0,0,0,0,0,1.5).s().p("AAAAPQgFgBgDgDIgCgCQgFgFABgFQACgGAFgEQAEgDADAAIABAAQAEABAEACIACADQAFAFgBAEQgBAFgCADIgDADQgEADgFAAIAAAAg");
	this.shape_2.setTransform(4*spacing,52.8*distance,size,size);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.rf([colors["rgba(251,251,255,0.298)"],colors["rgba(181,208,238,0.902)"]],[0.365,1],0,0,0,0,0,2.3).s().p("AgBAWQgIgBgEgEIgEgEQgFgHABgIQABgJAIgGQAGgFAGABIACAAQAGABAEADQADACACADQAGAHgBAHQgBAGgDAFIgFAFQgGAEgGAAIgCAAg");
	this.shape_3.setTransform(-1.8*spacing,80.4*distance,size,size);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.rf([colors["rgba(251,251,255,0.298)"],colors["rgba(181,208,238,0.902)"]],[0.365,1],0,0,0,0,0,1.8).s().p("AgBARQgGgBgDgDIgDgDQgEgFABgGQABgHAGgFQAFgEAEABIACAAQAEABADACQADABABADQAFAFgBAGIgDAIIgEAEQgEADgGAAIgBAAg");
	this.shape_4.setTransform(0.2*spacing,-70.9*distance,size,size);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.rf([colors["rgba(251,251,255,0.298)"],colors["rgba(181,208,238,0.902)"]],[0.365,1],0,0,0,0,0,2.3).s().p("AgBAWQgIgBgEgEIgEgEQgFgHABgIQABgJAIgGQAGgFAGABIACAAQAGABAEADQADACACADQAGAHgBAHQgBAGgDAFIgFAFQgGAEgGAAIgCAAg");
	this.shape_5.setTransform(-1.8*spacing,-50.7*distance,size,size);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.rf([colors["rgba(251,251,255,0.298)"],colors["rgba(181,208,238,0.902)"]],[0.365,1],0,0,0,0,0,2.3).s().p("AgBAWQgIgBgEgEIgEgEQgFgHABgIQABgJAIgGQAGgFAGABIACAAQAGABAEADQADACACADQAGAHgBAHQgBAGgDAFIgFAFQgGAEgGAAIgCAAg");
	this.shape_6.setTransform(4.5*spacing,-29.7*distance,size,size);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.rf([colors["rgba(251,251,255,0.298)"],colors["rgba(181,208,238,0.902)"]],[0.365,1],0,0,0,0,0,2.3).s().p("AgBAWQgIgBgEgEIgEgEQgFgHABgIQABgJAIgGQAGgFAGABIACAAQAGABAEADQADACACADQAGAHgBAHQgBAGgDAFIgFAFQgGAEgGAAIgCAAg");
	this.shape_7.setTransform(-7.2*spacing,-3.4*distance,size,size);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_7},{t:this.shape_6},{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-9.4,-72.6,16.2,155.4);


// stage content:
(lib.gasup = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 3 (mask)
	var mask = new cjs.Shape();
	mask._off = true;
	mask.graphics.p("AgJJGQiKgGgfhVIAAwuQCsAjC5glIAAQwQgwBbh/AAIgNAAg");
	mask.setTransform(25.3,68);

	// Layer 2
	this.instance = new lib.Tween2("synched",0);
	this.instance.parent = this;
	this.instance.setTransform(28.6,149.6,1.86,1.86,0,0,0,0,0.1);

	this.instance.mask = mask;

	var speed = lib.properties.speed || 0;

	this.timeline.addTween(cjs.Tween.get(this.instance).to({y:-31.9},speed ? 20/speed : 0).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(36,79.3,30.1,112);

})(lib = lib||{}, images = images||{}, createjs = createjs||{}, ss = ss||{});
var lib, images, ss;


if (window.modelNS) {
	modelNS.IReact.libs.gasup = lib;
	lib = null;
}
