(function (lib, img, cjs, ss) {

var p; // shortcut to reference prototypes

// library properties:
lib.properties = {
	width: 300,
	height: 200,
	scale:0.3,
	fps: 24,
	color: "#FFFFFF",
	opacity: 1.00,
	manifest: []
};



lib.ssMetadata = [];


// symbols:



(lib.спичка = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#B85652").s().p("AgeCsQhLAAgjhBIgCgEQAelUDBBMQCkB0kNDcg");
	this.shape.setTransform(141.9,17.6);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#EBCAAA").s().p("Aq0PeIAAgCIT0/2IAHgFQAjBABLABIzsfsIAAACQgbAQgXAAQgtAAgehCg");
	this.shape_1.setTransform(69.4,134.1);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,156.2,239.8);


(lib.коробка = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#DDBFA4").s().p("Ai2CTIAAklIFtCqIlrB8g");
	this.shape.setTransform(108.9,141.1);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#F7DFCD").s().p("AkrACIgCk8IACABIJYENIAAAHIAAgGIgBAAIACFmgAkigBIACABIJCEfIgCk9IjUheIluisg");
	this.shape_1.setTransform(119.6,156.1);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#EED5BC").s().p("AtECXIFth7IDUBeIACE+gAtQigIQRkXIKQDbIxHFIg");
	this.shape_2.setTransform(174.5,140.7);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#6D3A33").s().p("AoDARIQFk5IACAAIAAD9IwCFUg");
	this.shape_3.setTransform(204.5,151.9);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#DCBDA9").s().p("AolgOIABAAIAAAGIAAgGIRHlKIADE6IxJF3gAoFAGIAFEXIQClUIAAj9IgCAAg");
	this.shape_4.setTransform(204.7,153.1);

	this.instance = new lib.спичка();
	this.instance.parent = this;
	this.instance.setTransform(227.7,122.9,0.398,0.398,41.2,0,0,78.1,120);

	this.instance_1 = new lib.спичка();
	this.instance_1.parent = this;
	this.instance_1.setTransform(215,120.9,0.398,0.398,41.2,0,0,78.2,119.9);

	this.instance_2 = new lib.спичка();
	this.instance_2.parent = this;
	this.instance_2.setTransform(205.8,116.9,0.398,0.398,41.2,0,0,78.3,120);

	this.instance_3 = new lib.спичка();
	this.instance_3.parent = this;
	this.instance_3.setTransform(195.5,113.3,0.398,0.398,41.2,0,0,78.2,119.9);

	this.instance_4 = new lib.спичка();
	this.instance_4.parent = this;
	this.instance_4.setTransform(185.9,110.5,0.398,0.398,41.2,0,0,78.1,120);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#D4D4D4").s().p("AjShFIGjiJIAAD4IACAEImiChg");
	this.shape_5.setTransform(280.6,126.7);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("#C7CDD0").s().p("AkuBIIAAjYIJaClIADABImDB7g");
	this.shape_6.setTransform(266.8,103.7);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#C2BEB7").s().p("Ai4gOIFxheIAAABIAADYg");
	this.shape_7.setTransform(217.9,100);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f("#E7E7E7").s().p("ABmCXIgNgEIGFh6IgDgBIpaimIABgBIgBABIlzBdIgZgIIGVhnIKCC4IgBAAImlCJg");
	this.shape_8.setTransform(249.3,103.4);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_8},{t:this.shape_7},{t:this.shape_6},{t:this.shape_5},{t:this.instance_4},{t:this.instance_3},{t:this.instance_2},{t:this.instance_1},{t:this.instance},{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(89.4,54.1,212.4,133.6);


// stage content:
(lib.matchbox = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 2
	this.instance = new lib.коробка();
	this.instance.parent = this;
	this.instance.setTransform(227.9,143.2,1,1,0,0,0,266.6,172.8);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(200.7,124.5,212.4,133.6);

})(lib = lib||{}, images = images||{}, createjs = createjs||{}, ss = ss||{});
var lib, images, ss;

if (window.modelNS) {
	modelNS.IReact.libs.matchbox = lib;
	lib = null;
}