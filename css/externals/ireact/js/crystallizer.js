(function (lib, img, cjs, ss) {

var p; // shortcut to reference prototypes

// library properties:
lib.properties = {
	width: 150,
	height: 130,
	scale: 0.4,
	fps: 24,
	color: "#FFFFFF",
	opacity: 1.00,
	part: '',
	manifest: []
};



lib.ssMetadata = [];


// symbols:



(lib.дно = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#00265C").s().p("AiWAeQhAgRAAgRQAAgSA/gNQA/gMBYAAQBZgBA/ANQA/AMAAASQAAARg+ASQhDAThVAAQhTAAhEgTg");
	this.shape.setTransform(21.5,4.9);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,43.1,9.8);


(lib.блик = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFFFF").s().p("Agxh0IBhgOIACDvQgGAFgPAFQgdALgwABg");
	this.shape.setTransform(7.9,60.1);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(2.9,47,10.2,26.3);


(lib.кристаллизатор_1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	if (lib.properties.part == 'front') {
		this.shape = new cjs.Shape();
		this.shape.graphics.f("rgba(139,159,173,0.2)").s().p("AhHgUIACk3IAPgFQBjgjAsgpIAAFuIgQFxIihBbg");
		this.shape.setTransform(79,128);

		this.shape_1 = new cjs.Shape();
		this.shape_1.graphics.f("rgba(139,159,173,0.098)").s().p("AhIFEIgRlxIAAlwQAsA1BzAjIABEyIASGxg");
		this.shape_1.setTransform(-33.9,127.9);

		this.instance = new lib.блик();
		this.instance.parent = this;
		this.instance.setTransform(-6.3,66.8,2.97,2.97,0,0,180,6.5,36.6);
		this.instance.alpha = 0.238;
		
		this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance},{t:this.shape_1},{t:this.shape}]}).wait(1));	
	}

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f().ls(["#DCECF3","rgba(195,215,233,0.6)","rgba(175,200,254,0)","rgba(180,203,231,0.6)","#C5DFEE"],[0,0.102,0.329,0.851,1],-41.6,-17.6,41.7,17.4).ss(4,1,1).p("AK3AAQAABVjMA9QjLA9kgAAQkfAAjLg9QjMg9AAhVQAAhVDMg9QDLg8EfAAQEgAADLA8QDMA9AABVg");
	this.shape_2.setTransform(22.8,81,1.003,1);
	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_2}]}).wait(1));

	if (lib.properties.part != 'front') {
		this.instance_1 = new lib.дно();
		this.instance_1.parent = this;
		this.instance_1.setTransform(22.7,162.9,2.97,2.97,0,0,0,21.4,5);
		this.instance_1.alpha = 0.102;
		
		this.shape_3 = new cjs.Shape();
		this.shape_3.graphics.lf(["#B1C4CD","rgba(166,192,217,0.6)","rgba(175,200,254,0)","rgba(136,167,204,0.6)","#A3C8DC"],[0,0.102,0.329,0.851,1],-72.3,-53.7,69.2,-52.8).s().p("AntG/Qi+g5AAhkIAAsSIABAAQAMBcCxA1QC1A1E4AAQEzABDEhCQCqg7ALhOIAAMUQAABUi1A/QjEBBkzAAQk4AAi1g1g");
		this.shape_3.setTransform(23,130.7);

		this.shape_4 = new cjs.Shape();
		this.shape_4.graphics.lf(["rgba(177,196,205,0.498)","rgba(166,192,217,0.4)","rgba(175,200,254,0)","rgba(136,167,204,0.4)","rgba(163,200,220,0.6)"],[0,0.102,0.329,0.851,1],68.5,-53.2,-73,-52.3).s().p("AJ5GqQgugkhUgdQhZgdiHgLQhigIi1ABQilAAhyAKQh/AKhXAaQhbAbgtAfQgvAigGAtIgBAAIAAsSQAAhkC+g5QC1g2E4AAQEzAADEBCQC1A+AABVIAAMTQgGgngtgjg");
		this.shape_4.setTransform(23,110.9);

		this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_4},{t:this.shape_3},{t:this.instance_1}]}).wait(1));
	}

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-48.9,58.2,143.4,122.6);


// stage content:
(lib.crystallizer = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.instance = new lib.кристаллизатор_1();
	this.instance.parent = this;
	this.instance.setTransform(75.4,0,1,1,0,0,0,23.1,55);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(98.3,87.8,143.4,122.6);

})(lib = lib||{}, images = images||{}, createjs = createjs||{}, ss = ss||{});
var lib, images, ss;


if (window.modelNS) {
	modelNS.IReact.libs.crystallizer = lib;
	lib = null;
}
