(function (lib, img, cjs, ss) {

var p; // shortcut to reference prototypes

// library properties:
lib.properties = {
	width: 120,
	height: 300,
	fps: 24,
	scale: 0.4,
	color: "#FFFFFF",
	opacity: 1.00,
	manifest: []
};



lib.ssMetadata = [];


// symbols:



(lib.колонна3 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#5B5E64").ss(3,1,1).p("EADIgoHQhFgHhAgKQhHgMhBgQQhLgRg2gUEABDgiiQhHgMhBgQQhLgRg2gUABD8sQhHgMhBgQQhLgRg2gUABD22QhHgMhBgQQhLgRg2gUABDxAQhHgMhBgQQhLgRg2gUADIq5QhFgHhAgKQhHgMhBgQQhLgRg2gUABDlUQhHgMhBgPQhLgSg2gUABDAgQhHgMhBgPQhLgQg2gUABDGWQhHgMhBgQQhLgRg2gUABDMMQhHgMhBgPQhLgSg2gUADISUQhFgIhAgKQhHgMhBgPQhLgSg2gUABDX4QhHgMhBgPQhLgSg2gUABDduQhHgMhBgPQhLgSg2gUEABDAjkQhHgMhBgPQhLgSg2gUEABDApaQhHgMhBgQQhLgRg2gU");
	this.shape.setTransform(67.1,330.3);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("rgba(117,136,180,0.102)").s().p("EgCagvoQCZgkCchgMAAABg8QhFBnjwA2g");
	this.shape_1.setTransform(194.9,383,1,1,0,0,0,-9.5,6);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("rgba(255,255,255,0.302)").s().p("EgDlAv6MAAAhhQQDiBLDoAFMAAABhcg");
	this.shape_2.setTransform(73,385,1,1,0,0,0,0,0.8);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f().s("#A4AEC6").ss(2,1,1).p("AgiAqQADgrBCgo");
	this.shape_3.setTransform(3.7,23.8);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f().s("rgba(164,174,198,0.498)").ss(2,1,1).p("EgSlgzvQBbg2DOgrQFxhNIIAAQIGAAFwBNQFwBNAABtQAABslqBMQgDABgDAAQlwBOoGAAQoIAAlxhOQgCAAgDgBQlqhMAAhsQAAgCAAgCEgSlgzvQBcg8DOgxQFxhXIKAAQILAAFxBXQFyBXAAB7QAABChqA3QgQAJgTAIIiwBrIgLAGIAAAdQgsBCjgAxQkWA+mHAAQmJAAkWg+QjlgygphFIAAgaIgJgGIjTh/QgDgCgDgCQhbg0AAg9QAAgIACgIQAJgtA9gogEgOwAzpIAAgRMAAAhhOEAOmAzWIAAADQAAAJgDAJQgaBOj1A6QkRBBmDAAQmCAAkShBQkShAAAhbQAAhbEShBQEShAGCAAQGDAAERBAQEQBAACBagEAOmgtyMAAABhI");
	this.shape_4.setTransform(126.2,350.8);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.lf(["#B1C4CD","rgba(166,192,217,0.4)","rgba(175,200,254,0)","rgba(136,167,204,0.4)","#A3C8DC"],[0,0.102,0.329,0.851,1],-93.5,0,93.5,0).s().p("AqUCbQkShAAAhbQAAhaEShAQEShAGCAAQGDAAESBAQEQBAABBaIgCASQgaBQj1A5QkSBBmDAAQmCAAkShBg");
	this.shape_5.setTransform(126.2,679.6);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.lf(["#B1C4CD","rgba(166,192,217,0.4)","rgba(175,200,254,0)","rgba(136,167,204,0.4)","#A3C8DC"],[0,0.102,0.329,0.851,1],-101,-1.1,101.9,-1.1).s().p("EgOrA06MAAAhhMQApBEDkAzQEWA9GIABQGJgBEWg9QDfgyAthCMAAABhIQgChakQhAQkShAmDAAQmCAAkSBAQkRBAAABbgEgN3gt6IgFgBQlrhMAAhsIAAgEQAJgtA+goQBbg2DOgrQFwhMIHgBQIHABFxBMQFwBNAABtQAABslqBMIgGABQlxBOoHAAQoHAAlwhOg");
	this.shape_6.setTransform(125.8,340.9);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.lf(["#B1C4CD","rgba(166,192,217,0.4)","rgba(175,200,254,0.6)","rgba(136,167,204,0.4)","#A3C8DC"],[0,0.102,0.329,0.851,1],-101.4,302.1,101.5,302.1).s().p("AqiE7QjlgzgphEIAAgbIgJgGIjTh/IgGgDQhbgyAAg+QAAgIACgIIAAAEQAABqFqBMIAFABQFxBOIIAAQIGAAFwhOIAGgBQFqhMAAhqQAAhtlwhNQlwhMoGgBQoIABlxBMQjOArhaA2QBbg8DOgwQFxhYIKAAQILAAFxBYQFyBWAAB7QAABChqA1QgQAKgTAHIiwBrIgLAHIAAAcQgsBCjgAyQkWA9mHABQmJgBkWg9g");
	this.shape_7.setTransform(126.2,37.7);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_7},{t:this.shape_6},{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	// дно
	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f("rgba(140,145,161,0.2)").s().p("AqACWQj7g7gOhSIgBgHIAAgCQAChXEIg+QEKg/F2AAQF3AAEJA/QEIA+ADBXIAAACIgBAHQgOBSj8A7QkJA/l3AAQl2AAkKg/g");
	this.shape_8.setTransform(126.3,51.5);

	this.timeline.addTween(cjs.Tween.get(this.shape_8).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1,-1,254.5,703.6);


// stage content:
(lib.glass_cylinder = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.instance = new lib.колонна3();
	this.instance.parent = this;
	this.instance.setTransform(60.1,150.2,0.4,0.4,0,0,0,126.4,351.3);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(69.2,159.3,101.8,281.4);

})(lib = lib||{}, images = images||{}, createjs = createjs||{}, ss = ss||{});
var lib, images, ss;

if (window.modelNS) {
	modelNS.IReact.libs.glass_cylinder = lib;
	lib = null;
}