(function (lib, img, cjs, ss) {

var p; // shortcut to reference prototypes

// library properties:
lib.properties = {
	width: 42,
	height: 50,
	scale: 0.6,
	fps: 12,
	color: null, // "#cc0000",
	opacity: 1.00,
	manifest: []
};



lib.ssMetadata = [];


// symbols:



(lib.низкап = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.lf(["#D4D4D4","#FCFCFC","#EAEAEA","#A3A2A2","#C9C9C9"],[0,0.263,0.529,0.804,1],-6.7,0.3,11.8,0.3).s().p("AgZCSQgMgEAAgGIgRkdQASAHAZAFQAeAIAkAFIgOEEQAAAGgMAEQgLADgRAAQgPAAgLgDg");
	this.shape.setTransform(11.4,58.7);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.lf(["#D4D4D4","#FCFCFC","#EAEAEA","#A3A2A2","#C9C9C9"],[0,0.263,0.529,0.804,1],-34.8,0,34.8,0).s().p("AixDhQgkgGgggHQgZgFgSgHQg6gTgBgZIAAgBIABmFIABAAQAaAKAlAJQB1AaClAAQClAAB1gaQAngJAZgKIABAAIAAGJQgEAfhiAWQhlAXiQAAQhiAAhPgKg");
	this.shape_1.setTransform(34.8,23.6);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));
	
	var color = lib.properties.color;
	
	if (color) {
		this.shape = new cjs.Shape();
		this.shape.graphics.lf([color,color,color,color,color],[0,0.263,0.529,0.804,1],-6.7,0.3,11.8,0.3).s().p("AgZCSQgMgEAAgGIgRkdQASAHAZAFQAeAIAkAFIgOEEQAAAGgMAEQgLADgRAAQgPAAgLgDg");
		this.shape.setTransform(11.4,58.7);

		this.shape_1 = new cjs.Shape();
		this.shape_1.graphics.lf([color,color,color,color,color],[0,0.263,0.529,0.804,1],-34.8,0,34.8,0).s().p("AixDhQgkgGgggHQgZgFgSgHQg6gTgBgZIAAgBIABmFIABAAQAaAKAlAJQB1AaClAAQClAAB1gaQAngJAZgKIABAAIAAGJQgEAfhiAWQhlAXiQAAQhiAAhPgKg");
		this.shape_1.setTransform(34.8,23.6);

		this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));
	}

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,69.6,73.7);


(lib.капельница = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.instance = new lib.низкап();
	this.instance.parent = this;
	this.instance.setTransform(46.2,80.2,1,1,0,0,0,34.8,36.8);
	this.instance.alpha = 0.672;
	
	var color = lib.properties.color;

	this.shape = new cjs.Shape();
	if (color) {
		this.shape.graphics.lf([color,color,color,color,color],[0,0.345,0.361,0.804,1],-28,0,28,0).s().p("AjdAQIgEgBQgZgGgTgGIgKgDIAAgfIAEAHIAGAHQATAOA1AKIAMADQBOAQBrAAQBrAABPgQIALgDQBBgMANgUQAEgFAAgFIAAAjQgVAHggAIIgEABQhdAUiBAAQiAAAhdgUg");
	} else {
		this.shape.graphics.lf(["#D4D4D4","#FCFCFC","#EAEAEA","#A3A2A2","#C9C9C9"],[0,0.345,0.361,0.804,1],-28,0,28,0).s().p("AjdAQIgEgBQgZgGgTgGIgKgDIAAgfIAEAHIAGAHQATAOA1AKIAMADQBOAQBrAAQBrAABPgQIALgDQBBgMANgUQAEgFAAgFIAAAjQgVAHggAIIgEABQhdAUiBAAQiAAAhdgUg");
	}
	this.shape.setTransform(46.2,34.9);

	// внешний круг
	this.shape_1 = new cjs.Shape();
	if (color) {
		this.shape_1.graphics.lf([color,color,color],[0,0.804,1],32,1.8,-32,1.8).s().p("Ak1AkQgJgIAAgKQAAgcBdgVQBegWCDAAQCEAABeAWQBeAVAAAcQAAAKgKAIQgIAHgNAGIgKAEIAAgjIAAgBQgBgYhRgSQhSgThzAAQh0AAhRATQhMARgGAVIAAAEIAAAEIAAAhQgUgJgKgJg");
	} else {
		this.shape_1.graphics.lf(["#D4D4D4","#A3A2A2","#C9C9C9"],[0,0.804,1],32,1.8,-32,1.8).s().p("Ak1AkQgJgIAAgKQAAgcBdgVQBegWCDAAQCEAABeAWQBeAVAAAcQAAAKgKAIQgIAHgNAGIgKAEIAAgjIAAgBQgBgYhRgSQhSgThzAAQh0AAhRATQhMARgGAVIAAAEIAAAEIAAAhQgUgJgKgJg");	
	}
	this.shape_1.setTransform(46.2,29.5);

	// круг внутри, маленький
	this.shape_2 = new cjs.Shape();
	if (color) {
		this.shape_2.graphics.lf([color,color,color,color,color],[0,0.263,0.529,0.804,1],-29,-0.2,6.9,-0.2).s().p("AgpAJQgRgEAAgFQAAgEARgEQARgEAYAAQAYAAARAEQASAEABAEQgBAFgSAEQgRAEgYAAQgYAAgRgEg");
	} else {
		this.shape_2.graphics.lf(["#D4D4D4","#FCFCFC","#EAEAEA","#A3A2A2","#C9C9C9"],[0,0.263,0.529,0.804,1],-29,-0.2,6.9,-0.2).s().p("AgpAJQgRgEAAgFQAAgEARgEQARgEAYAAQAYAAARAEQASAEABAEQgBAFgSAEQgRAEgYAAQgYAAgRgEg");	
	}
	this.shape_2.setTransform(46.2,31.3);

	// круг средний
	this.shape_3 = new cjs.Shape();
	if (color) {
		this.shape_3.graphics.lf([color,color,color,color,color],[0,0.38,0.38,0.804,1],24,0.4,-24,0.4).s().p("AB4ADQAAgEgMgGQgJgDgOgEQgjgIgyAAQgwAAgjAIQgPAEgIADQgMAGAAAEIAAAvIgfgFIgTgEQhBgPgFgTIAAgEQAAgUBGgQQBGgQBiAAQBkAABFAQQBGAQABAUIgBADQgEAUhCAPIgSAEIgeAFg");
	} else {
		this.shape_3.graphics.lf(["#D4D4D4","#EAEAEA","#FCFCFC","#A3A2A2","#C9C9C9"],[0,0.38,0.38,0.804,1],24,0.4,-24,0.4).s().p("AB4ADQAAgEgMgGQgJgDgOgEQgjgIgyAAQgwAAgjAIQgPAEgIADQgMAGAAAEIAAAvIgfgFIgTgEQhBgPgFgTIAAgEQAAgUBGgQQBGgQBiAAQBkAABFAQQBGAQABAUIgBADQgEAUhCAPIgSAEIgeAFg");
	}
	
	this.shape_3.setTransform(46.1,30.9);

	// внешняя сторона центральной трубки
	this.shape_4 = new cjs.Shape();
	if (color) {
		this.shape_4.graphics.lf([color,color,color,color,color],[0,0.263,0.529,0.804,1],-12,0,12.1,0).s().p("Ah3ATIAAgtQABALAiAIQAkAHAwAAQAxAAAjgHQAjgIAAgLIABAtQg2AIhCAAQhCAAg1gIg");
	} else {
		this.shape_4.graphics.lf(["#D4D4D4","#FCFCFC","#EAEAEA","#A3A2A2","#C9C9C9"],[0,0.263,0.529,0.804,1],-12,0,12.1,0).s().p("Ah3ATIAAgtQABALAiAIQAkAHAwAAQAxAAAjgHQAjgIAAgLIABAtQg2AIhCAAQhCAAg1gIg");
	}
	
	this.shape_4.setTransform(46.2,34);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#F3F3F3").s().p("AjdBLQgdgEgagGIgFgCQg1gMgdgOQgdgOgFgRIgBgKQAJgiBsgZQB1gaCkAAQCmAAB1AaQBqAZAKAhIAAALQgFARgdAOQgdAOg1AMIgGACQgaAGgdAEQhhAPh9AAQh7AAhigPgAjhgyQhdAWAAAcQAAAJAJAIQAKAKAVAIIAKAEQASAGAZAGIAEAAQBdAVCAgBQCBABBdgVIAEAAQAggIAWgJIAJgEQAOgGAHgHQAKgIAAgJQAAgchegWQhdgViFgBQiDABheAVgAi5AtIgMgCQg1gMgSgPIgHgHIgDgGIAAgGQAGgYBLgRQBSgTBzAAQBzAABSATQBRASABAaIAAAAQAAAEgDAFQgOAThBAPIgLACQhPARhrAAQhrAAhOgRgAipgmQhGAQAAAWIAAACQAFAUBBAPIATAEIAfAFQA1AIBCgBQBCABA2gIIAegFIATgEQBBgPAEgUIABgCQAAgWhGgQQhGgPhjgBQhjABhGAPgAhUASQgjgIAAgKQAAgFAMgGQAJgEAOgDQAkgJAwAAQAxAAAjAJQAOADAJAEQAMAGAAAFQAAAKgjAIQgjAIgxAAQgwAAgkgIgAgpgJQgRAFAAAEQAAAEARAEQASAFAXAAQAYAAASgFQASgEAAgEQAAgEgSgFQgSgDgYAAQgXAAgSADg");
	this.shape_5.setTransform(46.2,31.4);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.lf(["#D4D4D4","#FCFCFC","#EAEAEA","#A3A2A2","#C9C9C9"],[0,0.263,0.529,0.804,1],-40,0,40,0).s().p("AkZA0QgmgIgagKIAAgCIAAACQgzgUgCgVIAAgCIAAgHIAAg+QAFARAeAOQAdAOA1AMIAFACQAaAFAdAFQBhANB8AAQB9AABhgNQAdgFAagFIAGgCQA0gMAegOQAdgOAFgRIAAA+IABAHQgBAWgzAUIgCABQgaAKglAIQh1AbimAAQikAAh1gbg");
	this.shape_6.setTransform(46.2,40);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_6},{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape},{t:this.instance}]}).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(6.2,22.3,80,94.7);


// stage content:
(lib.cap_dropper = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// основа
	this.instance = new lib.капельница();
	this.instance.parent = this;
	this.instance.setTransform(20.9,3,0.5,0.5,0,0,0,45.9,24.3);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(30,36.4,40,47.4);

})(lib = lib||{}, images = images||{}, createjs = createjs||{}, ss = ss||{});
var lib, images, ss;


if (window.modelNS) {
	modelNS.IReact.libs.cap_dropper = lib;
	lib = null;
}
