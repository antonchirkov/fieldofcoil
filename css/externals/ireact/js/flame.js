(function (lib, img, cjs, ss) {

var p; // shortcut to reference prototypes

// library properties:
lib.properties = {
	width: 30,
	height: 50,
	fps: 12,
	// defColor: 'rgba(255,255,255,0.3)',	// smoke
	defColor: 'rgba(255,0,0,0.773)',
	opacity: 1.00,
	// smoke:true,
	scale:0.8,
	manifest: []
};



lib.ssMetadata = [];


// symbols:



(lib.flame_1 = function(mode,startPosition,loop) {
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
		'rgba(255,0,0,0.773)' : prepareColor([0, 0, 0, 0]),
		'rgba(255,102,0,0.651)' : prepareColor([0, -102, 0, 0.122]),
		'rgba(255,153,0,0.553)' : prepareColor([0, -153, 0, 0.22]),
		'rgba(255,255,0,0.373)' : prepareColor([0, -255, 0, 0.4]),
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
	_tempDiff('rgba(255,0,0,0.773)', 'rgba(255,255,0,0.373)');
	*/

	// пламя
	this.shape = new cjs.Shape();
	this.shape.graphics.rf([colors['rgba(255,0,0,0.773)'],colors['rgba(255,102,0,0.651)'],colors['rgba(255,153,0,0.553)'],colors['rgba(255,255,0,0.373)']],[0,0.094,0.4,1],-0.1,6.7,0,-0.1,6.7,21.5).s().p("AAABfIAAAAQhPhMA1g9QAfgogHgKIAAgBIABgBIABAAIAAAAQBHA9ghA+IgYAvIgGALIgCADIgBABIAAAAIgBAAIgBAAIgCADIgBABIAAAAIAAAAg");
	this.shape.setTransform(18.3,-10.8);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.rf([colors['rgba(255,0,0,0.773)'],colors['rgba(255,102,0,0.651)'],colors['rgba(255,153,0,0.553)'],colors['rgba(255,255,0,0.373)']],[0,0.094,0.4,1],0.1,7.6,0,0.1,7.6,21.6).s().p("AgSBLIgBgDIgBgCIgEgIIgEgHIAAgBQgQgiAPgbIAAgBQARgfABgWIgBgBIAAgBIAAgCIAAAAIABgBIABAAIACgBQAIgOANAJQALAEAFARIABAAIAAABQALAXgFAaIAAABIgDAOIgMAjIgBADIgEAIIgCADIAAABIgBAAIgBACIAAABIgCACIgBABIgBAAIAAAAIgDAAIgBAAIgBAAIgBAAQgDgBgEADIgIADIgDABIgCgBg");
	this.shape_1.setTransform(18,-11.7);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.rf([colors['rgba(255,0,0,0.773)'],colors['rgba(255,102,0,0.651)'],colors['rgba(255,153,0,0.553)'],colors['rgba(255,255,0,0.373)']],[0,0.094,0.4,1],0.4,7.8,0,0.4,7.8,21.5).s().p("AADBoIAAgBIgCgDIgBgCIgCgIIgGgHIgBAAIgBgBQgbgjAEgcIAAgBIALg5IAAgEIAAgBIABgCIABgBIAAgBQgDgxAOgFQAMgFAIATIABAAIABABQATAXACAaIABARQgBAVgHASIgFAMIgCAFIgBACIgBAAIAAABIgCAEIgBACIAAABIgBABQgFAFgBALQgDASAEAQQgDAIgCAAIgBAAg");
	this.shape_2.setTransform(17.7,-11.9);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.rf([colors['rgba(255,0,0,0.773)'],colors['rgba(255,102,0,0.651)'],colors['rgba(255,153,0,0.553)'],colors['rgba(255,255,0,0.373)']],[0,0.094,0.4,1],0.7,8.9,0,0.7,8.9,21.6).s().p("AAIB1IgBAAQgkgkgHgbQgGgWAKgpQADgPAQgxQANglgEgEIAAgBIABgBIABAAIABAAQAgAdAGAlQAGAhgRAgQgGAMADAiQACAhgCAEIgGALIgCADIgBABIgBAAIgBAAIgCADIgBABIgBAAg");
	this.shape_3.setTransform(17.4,-13);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.rf([colors['rgba(255,0,0,0.773)'],colors['rgba(255,102,0,0.651)'],colors['rgba(255,153,0,0.553)'],colors['rgba(255,255,0,0.373)']],[0,0.094,0.4,1],0.3,9.1,0,0.3,9.1,21.6).s().p("AAEByIgCgBIgBAAIgBgBIAAAAIAAAAIgBgBIgBAAIgBgBIgJgOQgYghABgZIAAgBQADgYAGgeIABgIIAKg0IADgPQAHgdAFAJQAAAAAAAAQAAAAAAAAQAAAAAAAAQAAABAAAAIABABIABAAIABABQAMARAIAVQAIATADAQQACAMAAAIIgCAQQgDALgHAUQgFAPgCAeIgBAHIgCAaQgBAGgDgBIgDABIgDgBg");
	this.shape_4.setTransform(17.8,-13.2);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.rf([colors['rgba(255,0,0,0.773)'],colors['rgba(255,102,0,0.651)'],colors['rgba(255,153,0,0.553)'],colors['rgba(255,255,0,0.373)']],[0,0.094,0.4,1],0.2,9.3,0,0.2,9.3,21.6).s().p("AgTBVQgVgkAJgcIAAgBQALgaAEgcIABgHIAFg3QAFg2ALAhQAIATAKAnQAMAsgBAMIgBAOQgEAVgRBDIgIAbQgBAEgCAAQgEAAgRgtg");
	this.shape_5.setTransform(17.9,-13.4);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.rf([colors['rgba(255,0,0,0.773)'],colors['rgba(255,102,0,0.651)'],colors['rgba(255,153,0,0.553)'],colors['rgba(255,255,0,0.373)']],[0,0.094,0.4,1],0.2,8.1,0,0.2,8.1,21.6).s().p("AgfAwQgLggAQgZQAQgbAEgVIABgHIgBgEIAAgBIAAgCIABgBIABAAQAFgBAHgJQAKgSAKAaQAHAWABAhIAAAPQgBAUgDALIgEAOIgDAJIgFAMIgBAFIgBACIgBACIgBAAIgBAEIgBACIgBABIAAAAQgJADgGAFQgFAEgEABQgJgDgLgog");
	this.shape_6.setTransform(17.9,-12.2);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.rf([colors['rgba(255,0,0,0.773)'],colors['rgba(255,102,0,0.651)'],colors['rgba(255,153,0,0.553)'],colors['rgba(255,255,0,0.373)']],[0,0.094,0.4,1],0.3,8.5,0,0.3,8.5,21.6).s().p("AgaA8QgPghANgbIAAAAQAPgaAEgXIABgHIAAgFIAAgBIAAgCIAAgBIABgBQAFgFAEgQQAIgdALAcQAIAVAEAiIABAQQACAXgDAKIgDAPIgCAJIgEANIgCAFIgBACIgBADIAAABIgCAEIgBADIAAAAIAAABQgHAHgIALIgGAMIgCABQgHAAgNgrg");
	this.shape_7.setTransform(17.8,-12.6);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.rf([colors['rgba(255,0,0,0.773)'],colors['rgba(255,102,0,0.651)'],colors['rgba(255,153,0,0.553)'],colors['rgba(255,255,0,0.373)']],[0,0.094,0.4,1],0.1,7.5,0,0.1,7.5,21.5).s().p("AAIBSQgIgCgIgBQgGAAgFgCQgKgKgHgiQgHgeARgYQASgcAEgSIABgGIgBgEIgBgBIABgCIABgBIABAAQAHADAIgCQAMgFAJAYQAHAWgCAfIgCAMQgEAVgEALIgEANIgDAIIgGAMIgBAEIgBACIgBABIgBABIgBADIgBACIgBAAIgBAAg");
	this.shape_8.setTransform(18,-11.6);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape}]}).to({state:[{t:this.shape_1}]},1).to({state:[{t:this.shape_2}]},1).to({state:[{t:this.shape_3}]},1).to({state:[{t:this.shape_4}]},1).to({state:[{t:this.shape_5}]},1).to({state:[{t:this.shape_6}]},1).to({state:[{t:this.shape}]},1).to({state:[{t:this.shape_6}]},1).to({state:[{t:this.shape_5}]},1).to({state:[{t:this.shape_7}]},1).to({state:[{t:this.shape_8}]},1).to({state:[{t:this.shape}]},1).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(13.4,-20.3,9.7,19.2);


// stage content:
(lib.flame = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.instance = new lib.flame_1();
	this.instance.parent = this;
	
	if (lib.properties.smoke) {
		this.instance.setTransform(35,55.6,0.3,1.5,0,0,0,89.2,12.3);
	} else {
		this.instance.setTransform(121.4,59.6,1.5,1.5,0,0,0,89.2,12.3);	
	}

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(22.7,35.7,14.6,28.7);

})(lib = lib||{}, images = images||{}, createjs = createjs||{}, ss = ss||{});
var lib, images, ss;



if (window.modelNS) {
	modelNS.IReact.libs.flame = lib;
	lib = null;
}