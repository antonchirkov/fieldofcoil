(function (lib, img, cjs, ss) {

var p; // shortcut to reference prototypes

// library properties:
lib.properties = {
	width: 150,
	height: 250,
	scale:0.35,
	fps: 24,
	color: "#FFFFFF",
	opacity: 1.00,
	manifest: []
};



lib.ssMetadata = [];


// symbols:



(lib.behindglass = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// стенка1
	this.shape = new cjs.Shape();
	this.shape.graphics.lf(["rgba(53,53,53,0.49)","rgba(154,154,154,0.259)","rgba(38,38,38,0.471)"],[0,0.694,0.992],-90.1,44.5,90.2,44.5).s().p("ANzBkIAAgBQAAhNkCg1QkBg2luAAQlrAAkAA2QkCA1gBBNIAAABIgYAAQAChTEGg4QEJg8FzAAQF0AAEJA8QEGA4ACBTg");
	this.shape.setTransform(90.2,-34.5);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.lf(["rgba(60,60,60,0.302)","rgba(132,132,133,0.153)","rgba(216,217,218,0.2)","rgba(188,191,198,0.153)","rgba(134,138,155,0.502)"],[0,0.102,0.486,0.918,1],-88.9,20.5,87.1,20.5).s().p("AgHQjIgvAAIhGgBIhugDIixgOQhPgKhIgMQimgkg+gsQgtgggVgWQgKgKgEgIIgKgTQgGgMgBgHIAAgHIAA5rIgBgyIAAgBQAAhMECg3QEAg3FuAAQFsAAEBA3QEBA3AABMIAAABIATAAIgBAJQgCATgRASIAAATIgBZpIgBAEQgCAQgNAVQgPAYhBAsQgsAdheAaIgwAMQiCAaibANIjIAJIhsAAg");
	this.shape_1.setTransform(91.4,62.8);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("rgba(140,140,140,0.522)").s().p("AgLgVIAAgDIAWAAIABAxQgWgXgBgXg");
	this.shape_2.setTransform(1.3,-21.9);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	// дно
	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.rf(["rgba(129,136,152,0.8)","rgba(160,164,178,0.702)","rgba(205,203,198,0.49)"],[0.004,0.855,1],-0.2,0.2,0,-0.2,0.2,53.7).s().p("AAABlIghAAQjKgCiSgcQgzgJgjgLQhIgXAAgcIAAAAQADgpCbgdQCfgeDeAAQDgAACeAeQCeAdAAApIgBAGQgIAZhBAUQgiALgyAJQiZAdjUABIgRAAg");
	this.shape_3.setTransform(90.2,160);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.rf(["rgba(160,164,178,0.702)","rgba(205,203,198,0.49)"],[0.039,0.902],-1,-0.6,0,-1,-0.6,69).s().p("An8BfQjTgnAAg4QAAg3DTgnQDTgoEpAAQEqAADTAoQDTAnAAA3QAAA4jTAnQjTAokqAAQkpAAjTgogAl9hGQibAdgDApIAAAAQAAAcBJAXQAiALAzAJQCTAcDJACIAhAAIASAAQDUgBCYgdQAygJAjgLQBBgUAHgZIABgGQAAgpiegdQiegejgAAQjeAAifAeg");
	this.shape_4.setTransform(90.2,160);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.rf(["rgba(205,203,198,0.49)","rgba(160,164,178,0.2)"],[0.788,1],-1,-0.6,0,-1,-0.6,89.9).s().p("Ap8B3QkHgxgBhGQABgxCJgoQAigKArgJIAxgKQEIgyF0AAQF0AAEIAyIAsAJQArAJAiAKQCPAoAAAyQABBGkJAxQkIAyl0AAQl0AAkIgygAn8heQjUAnAAA3QAAA4DUAnQDTAoEpAAQEqAADTgoQDTgnAAg4QAAg3jTgnQjTgokqAAQkpAAjTAog");
	this.shape_5.setTransform(90.2,160);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_5},{t:this.shape_4},{t:this.shape_3}]}).wait(1));

	// дно1
	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.rf(["rgba(160,164,178,0.502)","rgba(205,203,198,0.302)"],[0.808,1],-1.2,0,0,-1.2,0,59.7).s().p("AmtBLQiwgeAMgvQAMgwCxgeQCwgdDqAGQDtAHCvAdQCxAeAAAoQAAAqixAeQivAej3AAQj5AAiwgeg");
	this.shape_6.setTransform(87.9,174.8);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.rf(["rgba(205,203,198,0.302)","rgba(255,255,255,0.114)"],[0.392,1],-2.9,-0.3,0,-2.9,-0.3,146.7).s().p("AhHCTQlngLjMhKQjMhGADg1QACg0DogSQDpgTFMADIJYAKQEPAEACBFQABBDkUBMQj2BFk3AAIhMgBgAmWhHQiwAegMAuQgMAxCwAdQCwAfD5AAQD2AACwgfQCwgdAAgrQAAgniwgfQiwgdjtgGIhRgBQi5AAiQAYg");
	this.shape_7.setTransform(88.1,173.9);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_7},{t:this.shape_6}]}).wait(1));

	// блик
	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.lf(["rgba(255,255,255,0)","rgba(255,255,255,0.2)","rgba(255,255,255,0)"],[0,0.349,1],44.9,3.1,-37.5,3).s().p("AkLMkQkxAABMgMQCXgZAlgqQAoguAWg0QAVgzAAgvQABABAAABQAAABAAAAQAAAAAAAAQAAAAAAgBIAAkFIgBwzQDOACCSAOQCTAOB2AbQB1AbABAGIACPZIAAC6QgDANgBA1QgEA0gUAbQhyCWkGAoQhbANh0ACIgbAAIiNgCg");
	this.shape_8.setTransform(114.4,81.9);

	this.timeline.addTween(cjs.Tween.get(this.shape_8).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,-44.5,180.3,233.3);


(lib.aboveglass = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// блик
	this.shape = new cjs.Shape();
	this.shape.graphics.lf(["rgba(255,255,255,0)","rgba(255,255,255,0.2)","rgba(255,255,255,0)"],[0,0.349,1],-44.8,1.1,37.6,-1.8).s().p("AhrPeQkGgqhyjBQgUgigEhEQgBhFgDgRIAAjzIAB0uQARAKB3AdQB3AcBxALQCcAPDTgFIAAS9IAAFVQAAABAAAAQAAAAAAAAQAAAAAAgCQAAgBABgBQAAA+AVBBQAWBEAoA6QAlA2CXAbQBMANkxALQhnAGhBABIgjABQhfAAhNgNg");
	this.shape.setTransform(67.9,84.6,1,1,0,0,0,0,-0.8);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.lf(["rgba(255,255,255,0)","rgba(255,255,255,0.2)","rgba(255,255,255,0)"],[0,0.349,1],-44.8,1.1,37.6,-1.8).s().p("AhrPNQkGgqhyi9QgUghgEhCQgBhEgDgSIAAjuIAB0XQARAKB3AcQB3AcBxAKQCcAPDTgFIAASoIAAFPIABgEQAAA9AVBBQAWBCAoA6QAlA0CXAbQBMANkxALQhnAGhBABIgdAAQhiAAhQgMg");
	this.shape_1.setTransform(67,86.1);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	// толщина
	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#515151").s().p("ANtMvIAD61IABACIgCa4QgDASgMAeQgLAdgGAGQAag0AEgkgAtWNyQgUgigEgdIgC52IADACIACZ2QAGAZAFALQADAKANAYIAFAJIgLgSgAttt/IAAgDIAAADg");
	this.shape_2.setTransform(90.4,64.5);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("rgba(128,128,128,0.4)").s().p("Ap8PzQh2gahMg9Qg9gxgIgvIgBgIIAA9hQABAZAYAWIAAABIAAZsIACAKQACAFAPAbQAQAcA/AsQA/AsCxAlQCxAmFqAAQFrAACxgjQCwgkBCgrQBCgrAPgZQAOgaADgTIgB53QARgSADgTIAAdbQgCAzg5AyQhIA+iFAcQkaA7ljAAQlyAAkKg7g");
	this.shape_3.setTransform(90.2,83);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_3},{t:this.shape_2}]}).wait(1));

	// фон
	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.lf(["rgba(98,98,98,0.78)","rgba(255,255,255,0.502)","rgba(77,77,77,0.651)"],[0.02,0.259,1],-90.1,0,90.2,0).s().p("Ap8AqQi3gpg4gzQgZgWAAgZIAAgDIAYAAIABAGQALBJD3AyQEBA3FqAAQFtAAECg3QDrgvAVhFQACgGAAgHIASAAIAAABIAAACIAAAGQgDATgRASQg1A2i/AqQkIA7l1AAQl0AAkIg7g");
	this.shape_4.setTransform(90.2,-14.4);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.lf(["rgba(132,134,140,0.302)","rgba(216,217,218,0.153)","rgba(199,200,200,0.153)","rgba(57,62,70,0.302)"],[0,0.243,0.761,1],-90.1,22,90.2,22).s().p("AAAQsQl0AAkIg7IgdgHQhjgbhCg1Qg9gxgIgvIgBgIIAA9dQABAZAYAWIAAABQA5A0C2ApQEHA7F1AAQF2AAEHg7QC+grA2g3IAAAAQARgSADgTIAAdYQgCAzg5AxQg7AzhjAcIgOADIghAIQktA7lDAAIgNAAg");
	this.shape_5.setTransform(90.2,83.2);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_5},{t:this.shape_4}]}).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,-25.8,180.3,215.9);


(lib.стаканмерный = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// up
	this.instance = new lib.aboveglass();
	this.instance.parent = this;
	this.instance.setTransform(90.2,94.8,1,1,0,0,0,90.2,95);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	// down
	this.instance_1 = new lib.behindglass();
	this.instance_1.parent = this;
	this.instance_1.setTransform(92.4,94.9,1,1,0,0,0,92.4,95);

	this.instance_2 = new lib.behindglass();
	this.instance_2.parent = this;
	this.instance_2.setTransform(92.4,94.9,1,1,0,0,0,92.4,95);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_2},{t:this.instance_1}]}).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,-44.6,180.3,234.5);


(lib.стакан_жид_1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.lf(["rgba(255,255,255,0)","rgba(255,255,255,0.4)","rgba(255,255,255,0)"],[0,0.502,1],-28.6,2,28.7,2).s().p("AAAJuQjIgLhVgcIAAy5QBUAUDJAMQCtAKBxgCIAAS5Qg1AEhGAAQhKAAhZgFg");
	this.shape.setTransform(45.7,139);

	var color = lib.properties.color || lib.properties.defColor;
	
	if (color) {
		var rgb = color.indexOf('#')===0 ? convertToRGB(color) : color,
			rgb = color.indexOf('rgb') === 0 ? rgb.replace(/rgb\((.*?)\)/gi, '$1').split(',') : rgb;
	}

	this.shape_1 = new cjs.Shape();
	this.shape_2 = new cjs.Shape();
	
	if (color) {
		this.shape_1.graphics.f("rgba("+rgb.join(",")+",0.5)").s().p("AjzJCQh6gIhPgbQhQgcgtgpQgkgigBgdIABvfQADAKALAKQAOAOAeAMQAVAIAdAJIAdAHIAoAJQCyAkD6AAQD7AACzgkIAogJQBwgbAUgiQAEgFABgGIAAPoQgDAbgcAbQgnAnhRAbQhSAciDAJQhdAIiZAAQinAAhJgFg");
	this.shape_1.setTransform(63.6,143.5);
		
		this.shape_2.graphics.f("rgba("+rgb.join(",")+",0.4)").s().p("AmsBWIgpgJIgdgHQgcgIgVgJQgYgKgOgLIgGgEIgJgKIgEgJIgBgCIgBgCIAAgFIAAgEIABgCIABgCIAEgJIAJgJIAGgGQAOgKAYgKIAhgLIAQgGIAdgHIApgJQCygkD6AAQD7AACyAkIApAJQAZAGAUAHQBAATATAYIAEAGQAEAFABAFIAAAEIAAAAIAAACIAAADQgBAFgEAGIgEAFQgZAfhnAZIgpAJQiyAkj7AAQj6AAiygkg");
	this.shape_2.setTransform(63.6,84.9);
	}
	

	this.instance = new lib.стаканмерный();
	this.instance.parent = this;
	this.instance.setTransform(63.9,128,0.705,0.705,0,0,0,90.7,63);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,52.1,127.1,165.2);


// stage content:
(lib.glass = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Слой 1
	this.instance = new lib.стакан_жид_1();
	this.instance.parent = this;
	this.instance.setTransform(75.1,125,1,1,0,0,0,63.6,108.6);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(86.5,193.5,127.1,165.2);

})(lib = lib||{}, images = images||{}, createjs = createjs||{}, ss = ss||{});
var lib, images, ss;

if (window.modelNS) {
	modelNS.IReact.libs.glass = lib;
	lib = null;
}