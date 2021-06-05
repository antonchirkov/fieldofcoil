(function (lib, img, cjs, ss) {

var p; // shortcut to reference prototypes

// library properties:
lib.properties = {
	width: 110,
	height: 140,
	fps: 12,
	color: "#FFFFFF",
	opacity: 1.00,
	manifest: [],
	scale: 0.4,
	// part: 'front'
};



lib.ssMetadata = [];


// symbols:



(lib.стакан100_1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	if (lib.properties.part == 'front') {
		// метки
		this.shape = new cjs.Shape();
		this.shape.graphics.f("#464D50").s().p("AgGARIAAguIAGAAIAAAtQAAADABABQACACAEAAIAAAHQgNABAAgNg");
		this.shape.setTransform(202.4,291);

		this.shape_1 = new cjs.Shape();
		this.shape_1.graphics.f("#464D50").s().p("AAUAVIAAgZQAAgKgJAAQgCAAgDACIgDAEIAAAdIgFAAIAAgcQAAgDgDgCQgCgCgEAAQAAAAgBAAQAAAAgBABQAAAAgBAAQgBABAAAAIgEAEIAAAdIgHAAIAAgoIAEAAIADAFQAEgGAHAAQAIAAACAGQABgDAEgBIAHgCQAGAAAEAEQADAEAAAHIAAAag");
		this.shape_1.setTransform(197.8,291.7);

		this.shape_2 = new cjs.Shape();
		this.shape_2.graphics.f("#464D50").s().p("AgMAXQgFgHAAgRQAAgMAFgHQAFgIAHAAQAJAAAEAGQAFAHAAAPQAAANgFAIQgFAIgIAAQgIAAgEgGgAgJAAQAAAWAJAAQAFAAACgFQAEgGAAgLQgBgIgBgFQgBgEgCgDQgCgBgEAAQgJAAAAAVg");
		this.shape_2.setTransform(190,291);

		this.shape_3 = new cjs.Shape();
		this.shape_3.graphics.f("#464D50").s().p("AgNAXQgEgHAAgRQAAgMAFgHQAFgIAHAAQAJAAAEAGQAFAHAAAPQAAANgFAIQgEAIgJAAQgHAAgGgGgAgJAAQAAAWAJAAQAFAAADgFQACgGAAgLQABgIgCgFQgBgEgCgDQgCgBgEAAQgJAAAAAVg");
		this.shape_3.setTransform(185.8,291);

		this.shape_4 = new cjs.Shape();
		this.shape_4.graphics.f("#464D50").s().p("AABAcIAAgqIgJAIIAAgIIAIgGIAHgHIACAAIAAA3g");
		this.shape_4.setTransform(181.2,291);

		this.shape_5 = new cjs.Shape();
		this.shape_5.graphics.f("#464D50").s().p("AgPAYIADgGQAGAEAFAAQAJAAAAgOQAAgLgJAAQgGAAgEADIgCAAIAAgcIAaAAIAAAHIgTAAIAAAOQADgCADAAQAHAAAFAEQAEAFAAAHQAAAWgRAAQgIAAgGgFg");
		this.shape_5.setTransform(226.7,301.8);

		this.shape_6 = new cjs.Shape();
		this.shape_6.graphics.f("#464D50").s().p("AgQAcIAAgBIAQgbQAGgHAAgGQAAgIgHAAQgEAAgCABQgDACgBADIgFgFQABgDAEgCQAEgCAFAAQAGAAAFADQAFAEAAAHQAAAHgGAHIgLAUIAUAAIAAAHg");
		this.shape_6.setTransform(222.4,301.8);

		this.shape_7 = new cjs.Shape();
		this.shape_7.graphics.f("#464D50").s().p("AgNAWQgEgGAAgQQAAgMAFgJQAFgHAHAAQAJAAAEAGQAFAGAAAQQAAANgFAIQgEAIgJAAQgHAAgGgHgAgJAAQAAAWAJAAQAFAAADgFQACgFAAgMQABgJgCgEQgBgEgCgDQgCgCgEAAQgJAAAAAWg");
		this.shape_7.setTransform(226.7,282);

		this.shape_8 = new cjs.Shape();
		this.shape_8.graphics.f("#464D50").s().p("AgPAYIADgGQAGAEAFAAQAJAAAAgOQAAgLgJAAQgGAAgEADIgCAAIAAgcIAaAAIAAAHIgTAAIAAAOQADgCADAAQAHAAAFAEQAEAFAAAHQAAAWgRAAQgIAAgGgFg");
		this.shape_8.setTransform(222.5,282);

		this.shape_9 = new cjs.Shape();
		this.shape_9.graphics.f("#464D50").s().p("AgPAYIADgGQAGAEAFAAQAJAAAAgOQAAgLgJAAQgGAAgEADIgCAAIAAgcIAaAAIAAAHIgTAAIAAAOQADgCADAAQAHAAAFAEQAEAFAAAHQAAAWgRAAQgIAAgGgFg");
		this.shape_9.setTransform(226.7,262.1);

		this.shape_10 = new cjs.Shape();
		this.shape_10.graphics.f("#464D50").s().p("AgMAcIAKgYQAEgNAGgLIgZAAIAAgHIAjAAIAAADIgFAKIgGALIgFAKIgDAMIgDAJg");
		this.shape_10.setTransform(222.6,262.1);

		this.shape_11 = new cjs.Shape();
		this.shape_11.graphics.f("#464D50").s().p("AgNAWQgEgGAAgRQAAgLAFgJQAFgHAHAAQAJAAAEAGQAFAGAAAQQAAANgFAIQgEAIgJAAQgHAAgGgHgAgJAAQAAAWAJAAQAFAAADgFQACgFAAgMQABgJgCgEQgBgEgCgDQgCgCgEAAQgJAAAAAWg");
		this.shape_11.setTransform(226.7,242.3);

		this.shape_12 = new cjs.Shape();
		this.shape_12.graphics.f("#464D50").s().p("AgMAWQgFgGAAgRQAAgLAFgJQAFgHAHAAQAJAAAFAGQAEAGAAAQQAAANgEAIQgGAIgIAAQgHAAgFgHgAgJAAQAAAWAJAAQAFAAACgFQADgFAAgMQAAgJgBgEQgBgEgCgDQgDgCgDAAQgJAAAAAWg");
		this.shape_12.setTransform(222.5,242.3);

		this.shape_13 = new cjs.Shape();
		this.shape_13.graphics.f("#464D50").s().p("AABAcIAAgqIgJAIIAAgIIAIgGIAHgHIACAAIAAA3g");
		this.shape_13.setTransform(218,242.2);

		this.shape_14 = new cjs.Shape();
		this.shape_14.graphics.f().s("#75899D").ss(2,1,1).p("AlnAAILPAA");
		this.shape_14.setTransform(218.6,309.6,0.25,0.25);

		this.shape_15 = new cjs.Shape();
		this.shape_15.graphics.f().s("#75899D").ss(2,1,1).p("AlnAAILPAA");
		this.shape_15.setTransform(218.6,289.5,0.25,0.25);

		this.shape_16 = new cjs.Shape();
		this.shape_16.graphics.f().s("#75899D").ss(2,1,1).p("AlnAAILPAA");
		this.shape_16.setTransform(218.6,269.5,0.25,0.25);

		this.shape_17 = new cjs.Shape();
		this.shape_17.graphics.f().s("#75899D").ss(2,1,1).p("AixAAIFjAA");
		this.shape_17.setTransform(218.7,249.4,0.5,0.5);

		this.shape_18 = new cjs.Shape();
		this.shape_18.graphics.f().s("#75899D").ss(2,1,1).p("AAAytMAAAAlb");
		this.shape_18.setTransform(209.6,279.4,0.25,0.25);

		this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_18},{t:this.shape_17},{t:this.shape_16},{t:this.shape_15},{t:this.shape_14},{t:this.shape_13},{t:this.shape_12},{t:this.shape_11},{t:this.shape_10},{t:this.shape_9},{t:this.shape_8},{t:this.shape_7},{t:this.shape_6},{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

		// верх
		this.shape_19 = new cjs.Shape();
		this.shape_19.graphics.f().s("rgba(231,242,252,0.698)").ss(3,1,1).p("Ag6AZQARgeAigNQAbgKAnAF");
		this.shape_19.setTransform(160.4,214);

		this.shape_20 = new cjs.Shape();
		this.shape_20.graphics.f().s("rgba(148,173,198,0.698)").ss(3,1,1).p("AHEgnQgFAPghAPQgjAMhCANQiMAZjDAAQjGAAiLgZQgRgEgPgDQgBAAAAAAQgTgEgSgFIgNgBAnDgDIAGAC");
		this.shape_20.setTransform(211.6,212);

		this.shape_21 = new cjs.Shape();
		this.shape_21.graphics.f().s("rgba(117,137,157,0.698)").ss(1,1,1).p("AHtpZQgHAJgDALQgJAcAFHoQACDxAEDvIAAAKQAAAMAAAMQgFAmgRASQglAkg6AVQgrAPg7AJQgXAEgZADQhKAJhaAAQhgAAhOgLQgggEgcgFQgEgBgFgBQglgIgdgKQg7gVgkgkQgSgSgEgmQgBgMAAgMIAAgKQADh2ABibQAFk0AAi5QAAhMg/g/QgRgRgagUQgSgNgEgE");
		this.shape_21.setTransform(203.8,271.1);

		this.shape_22 = new cjs.Shape();
		this.shape_22.graphics.lf(["rgba(60,60,60,0.302)","rgba(132,132,133,0.153)","rgba(216,217,218,0.2)","rgba(188,191,198,0.153)","rgba(134,138,155,0.502)"],[0,0.102,0.486,0.918,1],46.5,0.7,-36.6,0.7).s().p("Ah5JPQgfgEgcgFIgJgCQglgIgegKQg6gVgkgkQgSgSgEgmIgBgYIAAgKIAFkRQAEk0AAi5QAAhMg/g/QgRgRgbgUQgRgNgEgEQARghAjgMQAcgKAnAEIAGACIADAAIAOACQASAGATAEIAAAAIAhAHQCLAZDEAAQDFAACLgZQBCgNAkgOQgHAJgDALQgKAcAFHoQADDxAFDvIAAAKIgBAYQgFAmgRASQgkAkg7AVQgrAPg7AJIgwAHQhKAJhaAAQhgAAhPgLg");
		this.shape_22.setTransform(203.8,271.1);

		this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_22},{t:this.shape_21},{t:this.shape_20},{t:this.shape_19}]}).wait(1));
	} else {

		// низ
		this.shape_23 = new cjs.Shape();
		this.shape_23.graphics.f().s("rgba(183,214,245,0.698)").ss(3,1,1).p("AhMBrQgIhrChhp");
		this.shape_23.setTransform(158.4,211.4,0.5,0.5);

		this.shape_24 = new cjs.Shape();
		this.shape_24.graphics.f().s("rgba(117,137,157,0.498)").ss(1,1,1).p("AH/poQgHACgIAFQgOAJgJAOQgGAJgEALQgJAcAFHoQACDxAFDvIAAAKQAAAMgBAMQgFAmgRASQgkAkg7AVQggAMgrAHQgDABgCAAIhGALQgZADgbACQg1AEg7AAQg3AAgzgEQgkgCgggFIhFgLQglgIgdgKQg7gVgkgkQgRgSgFgmQgBgMAAgMIABgKQACh2ACibQAEk0AAi5QAAhMg+g/QgSgRgagUQgOgLgGgE");
		this.shape_24.setTransform(205.6,270);

		this.shape_25 = new cjs.Shape();
		this.shape_25.graphics.f().s("rgba(117,137,157,0.498)").ss(3,1,1).p("AnYAZQACgBABgBQAagXBogTQCMgZDFAAQDDAACMAZQCMAYAAAjQAAADgBAC");
		this.shape_25.setTransform(209.5,203.7);

		this.shape_26 = new cjs.Shape();
		this.shape_26.graphics.lf(["rgba(60,60,60,0.302)","rgba(132,132,133,0.153)","rgba(216,217,218,0.2)","rgba(188,191,198,0.153)","rgba(134,138,155,0.502)"],[0,0.102,0.486,0.918,1],-2.5,3.1,-3.1,68.6).s().p("AhrBQQgjgDghgEIhFgMIgJgCQhpgZAAgiQAAghBpgZQBqgZCTAAQCUAABqAZQBpAZAAAhQAAAihpAZIgQAEIgFABIhFAKQgaAEgbACQg0AEg7AAQg4AAgzgEg");
		this.shape_26.setTransform(209.1,323.4);

		this.shape_27 = new cjs.Shape();
		this.shape_27.graphics.lf(["rgba(60,60,60,0.302)","rgba(132,132,133,0.153)","rgba(216,217,218,0.2)","rgba(188,191,198,0.153)","rgba(134,138,155,0.502)"],[0,0.255,0.486,0.753,1],-34.6,-0.2,41.5,-0.2).s().p("AEjKJQBpgZAAgiQAAgjhpgZQhqgZiVAAQiSAAhqAZQhpAZAAAjQAAAiBpAZIAJACQglgHgdgLQg7gVgkgkQgRgRgFgmIgBgZIABgKIAEkRQAEk0AAi4QAAhNg+g+QgSgRgagVIgUgPIgCgDIAAgBIgBgBIAAgBIgBgDIAAgBIAAgBIAAAAIAAgEIACgJIAAgDIACgEIABgBIABgDIAAgBQAHgNAPgQIACgCIADgDIABAAIADgEIABgBIABgBIACgCIASgOIABgCIAJgGIAMgIIAAgBIADgCQAagZBogTQCLgaDEAAQDFAACMAaQCLAZAAAkIAAAFQgHADgIAFQgOAJgJANQgGAKgEALQgJAcAFHlQACD0AFDuIAAAKIgBAZQgFAmgRARQgkAkg7AVQggAMgrAIIAQgEg");
		this.shape_27.setTransform(205.4,264.4);

		this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_27},{t:this.shape_26},{t:this.shape_25},{t:this.shape_24},{t:this.shape_23}]}).wait(1));
	}

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(153,197.6,105.4,135.3);


// stage content:
(lib.beaker100 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 2
	this.instance = new lib.стакан100_1();
	this.instance.parent = this;
	this.instance.setTransform(55.4,69.5,1,1,0,0,0,205.8,264.9);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(57.5,72.2,105.4,134.8);

})(lib = lib||{}, images = images||{}, createjs = createjs||{}, ss = ss||{});
var lib, images, ss;



if (window.modelNS) {
	modelNS.IReact.libs.beaker100 = lib;
	lib = null;
}
