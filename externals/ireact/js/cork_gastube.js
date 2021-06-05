(function (lib, img, cjs, ss) {

var p; // shortcut to reference prototypes

// library properties:
lib.properties = {
	// width: 50,
	width: 140,
	height: 250,
	fps: 24,
	color: "#FFFFFF",
	opacity: 1.00,
	scale: 0.5,
	gas: false, // false || true
	part: 'gastube', // 'gastube', // gastube || cork || hose
	manifest: []
};



lib.ssMetadata = [];


// symbols:



(lib.Tween2 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.rf(["rgba(202,202,205,0.298)","rgba(142,190,238,0.902)"],[0.365,1],0,0,0,0,0,1.8).s().p("AgBARQgGgBgDgDIgDgDQgEgFABgGQABgHAGgFQAFgEAEABIACAAQAEABADACQADABABADQAFAFgBAGIgDAIIgEAEQgEADgGAAIgBAAg");
	this.shape.setTransform(0.2,11.6);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.rf(["rgba(202,202,205,0.298)","rgba(142,190,238,0.902)"],[0.365,1],0,0,0,0,0,2.3).s().p("AgBAWQgIgBgEgEIgEgEQgFgHABgIQABgJAIgGQAGgFAGABIACAAQAGABAEADQADACACADQAGAHgBAHQgBAGgDAFIgFAFQgGAEgGAAIgCAAg");
	this.shape_1.setTransform(-1.8,31.8);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.rf(["rgba(202,202,205,0.298)","rgba(142,190,238,0.902)"],[0.365,1],0,0,0,0,0,1.5).s().p("AAAAPQgFgBgDgDIgCgCQgFgFABgFQACgGAFgEQAEgDADAAIABAAQAEABAEACIACADQAFAFgBAEQgBAFgCADIgDADQgEADgFAAIAAAAg");
	this.shape_2.setTransform(1.3,52.8);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.rf(["rgba(202,202,205,0.298)","rgba(142,190,238,0.902)"],[0.365,1],0,0,0,0,0,2.3).s().p("AgBAWQgIgBgEgEIgEgEQgFgHABgIQABgJAIgGQAGgFAGABIACAAQAGABAEADQADACACADQAGAHgBAHQgBAGgDAFIgFAFQgGAEgGAAIgCAAg");
	this.shape_3.setTransform(-1.8,80.4);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.rf(["rgba(202,202,205,0.298)","rgba(142,190,238,0.902)"],[0.365,1],0,0,0,0,0,1.8).s().p("AgBARQgGgBgDgDIgDgDQgEgFABgGQABgHAGgFQAFgEAEABIACAAQAEABADACQADABABADQAFAFgBAGIgDAIIgEAEQgEADgGAAIgBAAg");
	this.shape_4.setTransform(0.2,-70.9);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.rf(["rgba(202,202,205,0.298)","rgba(142,190,238,0.902)"],[0.365,1],0,0,0,0,0,2.3).s().p("AgBAWQgIgBgEgEIgEgEQgFgHABgIQABgJAIgGQAGgFAGABIACAAQAGABAEADQADACACADQAGAHgBAHQgBAGgDAFIgFAFQgGAEgGAAIgCAAg");
	this.shape_5.setTransform(-1.8,-50.7);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.rf(["rgba(202,202,205,0.298)","rgba(142,190,238,0.902)"],[0.365,1],0,0,0,0,0,2.3).s().p("AgBAWQgIgBgEgEIgEgEQgFgHABgIQABgJAIgGQAGgFAGABIACAAQAGABAEADQADACACADQAGAHgBAHQgBAGgDAFIgFAFQgGAEgGAAIgCAAg");
	this.shape_6.setTransform(1.8,-29.7);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.rf(["rgba(202,202,205,0.298)","rgba(142,190,238,0.902)"],[0.365,1],0,0,0,0,0,2.3).s().p("AgBAWQgIgBgEgEIgEgEQgFgHABgIQABgJAIgGQAGgFAGABIACAAQAGABAEADQADACACADQAGAHgBAHQgBAGgDAFIgFAFQgGAEgGAAIgCAAg");
	this.shape_7.setTransform(-1.8,-2.1);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_7},{t:this.shape_6},{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-4,-72.6,8.1,155.4);


(lib.probka = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.lf(["rgba(0,0,0,0.698)","rgba(102,102,102,0.698)","rgba(0,0,0,0.698)"],[0.008,0.337,0.992],-39.2,-12.7,39.6,-12.7).s().p("AjyA9QhlgXAAghIACgGIgMhRQAbALAsAKQB0AcClAAQCkAAB0gcQAvgKAdgNIgPBWIAAADQAAAhhkAXQhlAYiMAAQiNAAhkgYg");
	this.shape.setTransform(46.1,51.5);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#333333").s().p("AkZBBQhVgTgXgaQgJgKAAgKQAAglB1gbQB1gcCkAAQCkAAB1AcQB2AbAAAlIgCAIQgLAhhpAYQh1AcikAAQikAAh1gcg");
	this.shape_1.setTransform(45.9,16.7);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.lf(["#000000","#666666","#000000"],[0.008,0.337,0.992],-39.4,6,39.4,6).s().p("AkcB9QgsgKgbgMIgmjyQAYAaBVATQB1AcClAAQCjAAB1gcQBpgXALgiIgpD8QgdANguALQh1AbijAAQilAAh1gbg");
	this.shape_2.setTransform(46.3,32.8);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(6,7.4,79.9,52.7);


(lib.трубка = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 2 (mask)
	var mask = new cjs.Shape();
	mask._off = true;
	mask.graphics.p("AgsIcIAAxFIBYAAIAARFQgHANglAAQghAAgLgNg");
	mask.setTransform(267.1,8.5);

	// пузыри
	if (lib.properties.gas) {
		this.instance = new lib.Tween2("synched",0);
		this.instance.parent = this;
		this.instance.setTransform(267.5,46.2);

		this.instance.mask = mask;

		this.timeline.addTween(cjs.Tween.get(this.instance).to({y:-33.8},49).wait(1));
	}

	// основа
	this.shape = new cjs.Shape();
	this.shape.graphics.lf(["#B1C4CD","rgba(166,192,217,0.4)","rgba(175,200,254,0)","rgba(136,167,204,0.4)","#A3C8DC"],[0,0.102,0.329,0.851,1],-4.5,14.4,4.5,14.4).s().p("AgsIcIAAvsIAAhZIBYAAIAABZIAAPsQgHANglAAQghAAgLgNg");
	this.shape.setTransform(267.1,8.5);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(50));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(262.6,-46.9,9,110.8);


(lib.шланг2_1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#5B5B5B").s().p("AiYDUQhAg8AAhUIAAk+IAAgWIADABIAJAEIABAHIAAE+QAABUA8A8QA8A9BTAAQBUAAA8g8IABgBQA8g8AAhUIAAk+IAAgFQAEgDAIgCIAAAUIAAE+QAABUg/A8IgBABQhAA8hZAAQhYAAhAg9g");
	this.shape.setTransform(31.5,27.7);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#5B5B5B").s().p("AjeDlQhchcAAiCIAAk9IAAgEQAEgDAHgDIAAE1QABCABYBdQBaBcB8AAQB9AABahcQBYhdABiAIAAk2IAIADIADABIAAAHIAAE9QAACChdBcQhcBdiCAAQiBAAhdhdg");
	this.shape_1.setTransform(31.5,32.8);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#333333").s().p("AjeDoQhchcAAiCIAAk+IAAgCIAAgBQAEgDAHgDIAFgCQASgFAYAAQAXAAAQAEIABgBIAAABIADABIAJAEIAAAHIAAE+QAABUA9A8QA8A9BTAAQBUAAA8g8IAAgBQA9g8AAhUIAAk+IAAgFQAEgDAHgCIAAgBIABABIABgBQARgFAZAAQAaAAARAFIABAAIAIAEIADABIAAAEIAAACIAAE+QAACChdBcQhcBdiCAAQiBAAhdhdg");
	this.shape_2.setTransform(31.5,32.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,63,65.1);

// stage content:
(lib.cork_gastube = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	var outsetX = -50,
		outsetY = 70;
		
	if (lib.properties.part == 'hose' || lib.properties.part == 'gastube') {
		// Layer 1
		this.instance = new lib.шланг2_1();
		this.instance.parent = this;
		this.instance.setTransform(23.8,43+outsetY,1,1,-180,0,0,40,4.7);
		this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));
		
		// Layer 1
		this.instance = new lib.шланг2_1();
		this.instance.parent = this;
		this.instance.setTransform(92.5,43+outsetY,1,1,0,0,0,40,4.7);
		this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));
	}
	
	// стеклянный наконечник газоотводной трубки, за него тянем
	if (lib.properties.part == 'gastube') {
		this.instance_4 = new lib.трубка();
		this.instance_4.parent = this;
		this.instance_4.setTransform(-151.8,55.9,1,1,0,0,0,5.3,6.3);
		this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(50));
	}
	
	var outsetX = -50,
		outsetY = 19;
	
	if (lib.properties.part == 'cork') {

		this.instance_1 = new lib.трубка();
		this.instance_1.parent = this;
		this.instance_1.setTransform(-188.3+outsetX,60.1+outsetY,1,1,0,0,0,5.3,6.3);
		
		this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1}]}).wait(1));

		this.instance_2 = new lib.probka();
		this.instance_2.parent = this;
		this.instance_2.setTransform(74.3+outsetX,119.8+outsetY,0.5,0.5,0,0,0,45.9,24.3);
		this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(50));

		this.instance_4 = new lib.трубка();
		this.instance_4.parent = this;
		this.instance_4.setTransform(-188.3+outsetX,190.9+outsetY,1,1,0,0,0,5.3,6.3);
		this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(50));
	}

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(107.7,127.4,165.2,378.6);

})(lib = lib||{}, images = images||{}, createjs = createjs||{}, ss = ss||{});
var lib, images, ss;


if (window.modelNS) {
	modelNS.IReact.libs.cork_gastube = lib;
	lib = null;
}