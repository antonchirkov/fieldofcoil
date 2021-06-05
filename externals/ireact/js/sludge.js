// Жидкость из пробирки

(function (lib, img, cjs, ss) {

var p; // shortcut to reference prototypes

// library properties:
lib.properties = {
	width: 35,
	height: 70,
	scale: 0.9,
	fps: 12,
	color: "rgba(200,0,200,0.7)",
	opacity: 1.00,
	size: 40,	// высота жидкости (max 40ml, min 10ml)
	manifest: [],
	// blur: {color:'rgba(212,212,212,1)'}// {color:"#000000", play:false}, // анимация растворения жидкости. Так как текущая сверху, (временно?) используется так же как верхний осадок
};



lib.ssMetadata = [];


// symbols:

// Осадок ----------------------------------------------------------------------
(lib.Sludge3 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	var color = colorToArray(lib.properties.color);
	var color1 = color.slice(0);
		color1[3] = 0;
	var color2 = color.slice(0);
		color2[3] = color[3]/3;
	var color3 = color.slice(0);
		color3[3] = color[3]/2;


	// Layer 1
	this.shape = new cjs.Shape();
	// this.shape.graphics.lf(["rgba(255,255,255,0)","#939393","#CBCBCB","rgba(233,233,233,0)"],[0,0.263,0.729,1],0,-16.9,0,16.8).s().p("AjxCsIAAlXIHjAAIAAFXg");
	this.shape.graphics.lf(["rgba("+color1.join(",")+")","rgba("+color3.join(",")+")","rgba("+color2.join(",")+")","rgba("+color1.join(",")+")"],[0,0.263,0.729,1],0,-16.9,0,16.8).s().p("AjxCsIAAlXIHjAAIAAFXg");
	this.shape.setTransform(0,0,1,1.098);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-24.2,-18.9,48.5,37.8);

(lib.Sludge2 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	var color = colorToArray(lib.properties.color);
	var color2 = color.slice(0);
		color2[3] = color[3]/1.6;
	var color3 = color.slice(0);
		color3[3] = color[3]/2;

	// Layer 1
	this.shape = new cjs.Shape();
	// this.shape.graphics.f().s("rgba(102,102,102,0.498)").ss(1,1,1,3,true).p("AByAAQAAALghAHQgiAIgvAAQguAAgigIQghgHAAgLQAAgKAhgIQAigHAuAAQAvAAAiAHQAhAIAAAKg");
	this.shape.graphics.f().s("rgba("+color.join(",")+")").ss(1,1,1,3,true).p("AByAAQAAALghAHQgiAIgvAAQguAAgigIQghgHAAgLQAAgKAhgIQAigHAuAAQAvAAAiAHQAhAIAAAKg");
	this.shape.setTransform(0,-3.5);

	this.shape_1 = new cjs.Shape();
	// this.shape_1.graphics.f("#D0D0D0").s().p("AhQASQghgHAAgLQAAgKAhgIQAigHAuAAQAvAAAiAHQAhAIAAAKQAAALghAHQgiAIgvAAQguAAgigIg");
	this.shape_1.graphics.f("rgba("+color2.join(",")+")").s().p("AhQASQghgHAAgLQAAgKAhgIQAigHAuAAQAvAAAiAHQAhAIAAAKQAAALghAHQgiAIgvAAQguAAgigIg");
	this.shape_1.setTransform(0,-3.5);

	this.shape_2 = new cjs.Shape();
	// this.shape_2.graphics.f("#999999").s().p("AgFAyQhYgDgVg1IAAgrQAIAHAYAFIARAEIAQACIAYACIAYAAIABAAIAAAAIABAAIABAAIBMgGIAJgCQATgEAJgEIAAAnQggA4hRAAIgHAAg");
	this.shape_2.graphics.f("rgba("+color.join(",")+")").s().p("AgFAyQhYgDgVg1IAAgrQAIAHAYAFIARAEIAQACIAYACIAYAAIABAAIAAAAIABAAIABAAIBMgGIAJgCQATgEAJgEIAAAnQggA4hRAAIgHAAg");
	this.shape_2.setTransform(0,1.1);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-12.5,-7.1,25,13.4);
// Осадок ----------------------------------------------------------------------



// stage content:
(lib.sludge = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});
	
	var outsetY = -65;

	// Осадок
	var mask = new cjs.Shape();
	mask._off = true;
	mask.graphics.p("AgFETQhYgDgVg3IAAnrIABAAIAAACQAAAMAiAHQAhAIAuAAQAwAAAhgIQAhgHABgLIAAHoQggA6hRAAIgHAAg");
	mask.setTransform(15.8,107.3+outsetY);

	// Layer 6
	this.instance_2 = new lib.Sludge3("synched",0);
	this.instance_2.parent = this;
	this.instance_2.setTransform(16.2,131+outsetY,1,2.113,0,0,0,0,8.1);

	this.instance_2.mask = mask;

	this.timeline.addTween(cjs.Tween.get(this.instance_2).to({regY:8,scaleY:0.14},14).to({_off:true},1).wait(5));

	// осадок
	this.instance_3 = new lib.Sludge2("synched",0);
	this.instance_3.parent = this;
	this.instance_3.setTransform(15.8,128+outsetY);
	this.instance_3.alpha = 0;

	this.timeline.addTween(cjs.Tween.get(this.instance_3).to({alpha:1},19).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(1,1,1,1);

})(lib = lib||{}, images = images||{}, createjs = createjs||{}, ss = ss||{});
var lib, images, ss;

if (window.modelNS) {
	modelNS.IReact.libs.sludge = lib;
	lib = null;
}
