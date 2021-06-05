(function (lib, img, cjs, ss) {

var p; // shortcut to reference prototypes

// library properties:
lib.properties = {
	width: 300,
	height: 50,
	scale: 0.6,
	fps: 24,
	// color: "#FFFFFF",
	opacity: 1.00,
	manifest: []
};



lib.ssMetadata = [];


// symbols:


/*
(lib.проволока = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFDBCD").s().p("Ag/A1IABAAQgTgGgTgUQgXgXACgQIAAgBQAFgjAjgGQAXgGA9AKQAEABACADQADAEgBAEQgBAEgDACQgDADgEgBQg4gJgVAEQgVAEgDAVQABAKAOANIAAABQAPAPAPAFIAAAAQAaAJAegQIAAAAQBGgpAsAHQAEAAACAEQADADgBACQAAAEgEADQgDACgEAAQgngFg/AmIgBABQgYAMgWAAQgNAAgMgEg");
	this.shape.setTransform(11.2,4.8);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FFDBCD").s().p("AyEAJQgEAAgDgCQgDgDAAgEQAAgDADgDQADgCAEgBMAkJAAAQAEABADACQADADAAADQAAAEgDADQgDACgEAAg");
	this.shape_1.setTransform(135.6,4.9);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#C2875A").s().p("AhDBDIgBAAQgWgHgWgXQgcgeAEgUIAAgCQAHgvAtgIIAAAAQAYgFBBAKQAKACAGAIQAHAJgCAKQgCAKgIAGQgIAGgJgBQg2gJgTADIgBAAQgJACgCAJQACAFAJAIQAMAMALAFIABAAQAUAGAZgNIgCABQBMgtAwAJQAKABAGAIQAGAJgBAIQgBAKgJAGQgIAHgKgCQgjgDg6AjIgBABQgbAPgZAAQgQAAgOgGg");
	this.shape_2.setTransform(11.2,4.8);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#C2875A").s().p("ASFAZMgkJAAAQgKAAgIgIQgHgHAAgKQAAgJAHgHQAIgIAKAAMAkJAAAQAKAAAIAIQAHAHAAAJQAAAKgHAHQgIAIgKAAIAAAAg");
	this.shape_3.setTransform(135.6,4.9);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-2.5,-2.5,256.4,14.6);
*/


(lib.жидк = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});
	
	var color = lib.properties.color || "rgba(0,0,0,0.102)";

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s(color).ss(1,1,1).p("AkOgIQgCgCgBgDQgHgIgKgBQgBgBgCAAIgbAAQgEAAgEACQgmAHgxAcIABgBQgYANgUgGIgBAAQgMgFgLgMQgJgIgCgFQACgJAJgCIAAAAQAUgDA2AJQAKABAJgGQAIgGACgKQABgLgGgIQgGgIgKgCQhDgKgZAFIABAAQgtAIgHAvQAAABAAABQgEAUAcAeQAWAXAWAHQAAAAABAAQAlAOAugXQABgBABAAQAvgdAggDIATAAQAHAAAGgFQAFgEADgGIMvAAAkOgIIgyAAQgEAAgDADQgDADAAACQAAAEADADQADADAEAAIAyAAAIhgIIsvAAAkjAZINEAAAIhgXItGAA");
	this.shape.setTransform(54.5,7.3);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f(color).s().p("AnaBDIgBAAQgWgHgWgXQgcgeAEgUIAAgCQAHgvAtgIIgBAAQAZgFBDAKQAKACAGAIQAGAIgBALQgCAKgIAGQgJAGgKgBQg2gJgUADIAAAAQgJACgCAJQACAFAJAIQALAMAMAFIABAAQAUAGAYgNIgBABQAxgcAmgHQAEgCAEAAIAbAAINGAAIAAAPIsvAAIgDgFQgHgIgKgBIgDgBIADABQAKABAHAIIADAFIgyAAQgEAAgDADQgDADAAACQAAAEADADQADADAEAAIAyAAQgDAGgFAEQgGAFgHAAIgTAAQggADgvAdIgCABQgdAPgZAAQgPAAgOgGgAkjAZQAHAAAGgFQAFgEADgGIMvAAIAAAPgAkOAKIgyAAQgEAAgDgDQgDgDAAgEQAAgCADgDQADgDAEAAIAyAAIMvAAIAAASgAIhgIgAkOgIg");
	this.shape_1.setTransform(54.5,7.3);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1,-1,111.1,16.6);


// stage content:
(lib.liquid = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.instance = new lib.жидк();
	this.instance.parent = this;
	this.instance.setTransform(80.2,23,1,1,0,0,0,54.5,7.3);
	// this.instance.alpha = 0.102;
	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).wait(1));

	// this.instance_1 = new lib.проволока();
	// this.instance_1.parent = this;
	// this.instance_1.setTransform(153.9,23,1,1,0,0,0,125.7,4.8);
	// this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1}]}).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(175.2,40.2,256.9,15.6);

})(lib = lib||{}, images = images||{}, createjs = createjs||{}, ss = ss||{});
var lib, images, ss;

if (window.modelNS) {
	modelNS.IReact.libs.liquid = lib;
	lib = null;
}