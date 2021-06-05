(function (lib, img, cjs, ss) {

var p; // shortcut to reference prototypes

// library properties:
lib.properties = {
	width: 150,
	height: 300,
	scale: 0.6,
	fps: 12,
	color: "#FFFFFF",
	opacity: 1.00,
	manifest: [],
	part: 'cap', // tube cap
};



lib.ssMetadata = [];


// symbols:




(lib.cap = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// glass bottom
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("rgba(102,102,102,0.302)").ss(1,1,1,3,true).p("AhZgHQADAHAXADQAbAFAkAAQAnAAAagFQAUgDAFgF");
	this.shape.setTransform(16,-24.5);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("rgba(102,102,102,0.302)").ss(1,1,1,3,true).p("AgXADQAAgDAHAAQAHgCAJAAQAKAAAIACQAFAAABAB");
	this.shape_1.setTransform(16,-15.7);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f().s("rgba(102,102,102,0.302)").ss(1,1,1,3,true).p("AhnAKQADgIAbgEQAfgHAqAAQAsAAAfAHQAWADAGAH");
	this.shape_2.setTransform(16.1,-27.9);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.lf(["#B1C4CD","rgba(166,192,217,0.6)","rgba(175,200,254,0)","rgba(136,167,204,0.6)","#A3C8DC"],[0,0.102,0.58,0.851,1],-2.9,0,3,0).s().p("AgRAHQgHgCgEgEIAAgBQAEgEAHgCQAJgDAKAAQANAAAJADIAFACIAAAIIgFADQgJADgNAAQgKAAgJgDg");
	this.shape_3.setTransform(15.9,-5.4);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.lf(["#B1C4CD","rgba(166,192,217,0.6)","rgba(175,200,254,0)","rgba(136,167,204,0.6)","#A3C8DC"],[0,0.102,0.58,0.851,1],-3,0,3,0).s().p("AgcgnIAAgIQACACAGACQAJACALAAQANAAAJgCIAHgDIAAAHIAABTIgFgCQgJgDgNAAQgKAAgJADQgHACgEAEg");
	this.shape_4.setTransform(15.9,-10.4);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.lf(["#B1C4CD","rgba(166,192,217,0.6)","rgba(175,200,254,0)","rgba(136,167,204,0.6)","#A3C8DC"],[0,0.102,0.58,0.851,1],-11,0,11.1,0).s().p("AgUCIQgGgBgCgCIgBgCQgSg6gzgpQgJgEgCgFIAAgBIABifQAGAHAZAGQAhAHAsAAQAuAAAhgHQAXgFAHgHIAACYIABAIQgCAEgHADQgwAqgWA5IgBADIAAAAIgIADQgJACgNAAQgLAAgJgCg");
	this.shape_5.setTransform(15.8,-28.5);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.lf(["#B1C4CD","rgba(166,192,217,0.6)","rgba(175,200,254,0)","rgba(136,167,204,0.6)","#A3C8DC"],[0,0.102,0.58,0.851,1],0,0,0.1,0).s().p("AAAAAIAAAAIAAABIAAgBg");
	this.shape_6.setTransform(19,-15.4);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.lf(["#B1C4CD","rgba(166,192,217,0.6)","rgba(175,200,254,0)","rgba(136,167,204,0.6)","#A3C8DC"],[0,0.102,0.58,0.851,1],0,0,0.1,0).s().p("AAAAAIAAgBIAAADIAAgCg");
	this.shape_7.setTransform(4.8,-26.5);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.lf(["#B1C4CD","rgba(166,192,217,0.6)","rgba(175,200,254,0)","rgba(136,167,204,0.6)","#A3C8DC"],[0,0.102,0.58,0.851,1],61.3,22.1,-13.6,2.1).s().p("AhNARQgagGgFgIIgCgDQAAgJAhgHQAggHAtAAQAuAAAgAHQAhAHAAAJQAAACgDADQgGAHgYAFQggAHguAAQgtAAgggHg");
	this.shape_8.setTransform(15.9,-42.8);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.lf(["#B1C4CD","rgba(166,192,217,0.6)","rgba(175,200,254,0)","rgba(136,167,204,0.6)","#A3C8DC"],[0,0.102,0.58,0.851,1],-0.1,0,0.1,0).s().p("AAAgDQAAADABAAIgBADIAAABg");
	this.shape_9.setTransform(26.9,-26.5);

	this.shape_11 = new cjs.Shape();
	this.shape_11.graphics.f().s("rgba(0,0,0,0.302)").ss(0.5,1,1).p("AiFhNQgBgCAAgBQAAgMAogJQAogJA2AAQA3AAAoAJQAoAJAAAMQAAABgBACIABCeQgBAMgnAJQgoAJg3AAQg2AAgogJQgngJgBgMgACGhNQgDALgkAHQgoAJg3AAQg2AAgogJQgkgHgDgL");
	this.shape_11.setTransform(15.8,1.6,0.75,0.75);

	this.shape_12 = new cjs.Shape();
	this.shape_12.graphics.f("#2C2A2A").s().p("AheBVQgngIAAgMIAAifQADALAkAIQAnAJA3AAQA4AAAngJQAkgIADgLIABCfQgBAMgnAIQgnAKg4gBQg3ABgngKg");
	this.shape_12.setTransform(15.8,2.8,0.75,0.75);

	this.shape_13 = new cjs.Shape();
	this.shape_13.graphics.f("#414040").s().p("AheAVQgkgIgDgLIAAgCQAAgLAngJQAngIA3AAQA4AAAnAIQAoAJAAALIgBACQgDALgkAIQgnAIg4ABQg3gBgngIg");
	this.shape_13.setTransform(15.8,-4.5,0.75,0.75);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_13},{t:this.shape_12},{t:this.shape_11},{t:this.shape_9},{t:this.shape_8},{t:this.shape_7},{t:this.shape_6},{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	// Layer 4

	this.shape_19 = new cjs.Shape();
	this.shape_19.graphics.f().s("rgba(0,0,0,0.302)").ss(0.5,1,1).p("ABbgOQgDAHgYAFQgbAFglAAQglAAgagFQgYgFgDgHQAAgBAAgBQAAgIAbgGQAPgEAUgBIAAAQQABABAAAAQAIAFATAAQAWABAHgHIAAgQQATABAQAEQAbAGAAAIQAAABAAABIAAAfQgBAIgaAFQgbAGglAAQglAAgagGQgbgFAAgIIAAgf");
	this.shape_19.setTransform(16,98);

	this.shape_20 = new cjs.Shape();
	this.shape_20.graphics.f("#2C2A2A").s().p("Ag/AUQgbgGAAgHIAAggQADAIAYAFQAaAGAlAAQAlAAAbgGQAYgFADgIIAAAfQgBAIgaAGQgbAGglAAQglAAgagGg");
	this.shape_20.setTransform(16,99.1);

	this.shape_21 = new cjs.Shape();
	this.shape_21.graphics.f("#414040").s().p("Ag/ANQgYgFgDgHIAAgBQAAgIAbgFQAPgEAUgCIAAARIABABQAIADATAAQAWAAAHgEIAAgRQATACAQAEQAbAFAAAIIAAABQgDAHgYAFQgbAGglABQglgBgagGg");
	this.shape_21.setTransform(16,96.4);

	this.shape_22 = new cjs.Shape();
	this.shape_22.graphics.f().s("rgba(102,102,102,0.498)").ss(1,1,1,3,true).p("AAdACQgCADgFACQgJADgNAAQgLAAgJgDQgGgCgCgEAgcAAQACgEAGgCQAJgDALAAQANAAAJADQAFACACAD");
	this.shape_22.setTransform(15.9,119.5);

	this.shape_23 = new cjs.Shape();
	this.shape_23.graphics.lf(["#B1C4CD","rgba(166,192,217,0.6)","rgba(175,200,254,0)","rgba(136,167,204,0.6)","#A3C8DC"],[0,0.102,0.58,0.851,1],-2.9,0,3,0).s().p("AgUAHQgGgCgCgEIAAgBQACgEAGgCQAJgDALAAQANAAAJADQAFACACADIAAADQgCADgFACQgJADgNAAQgLAAgJgDg");
	this.shape_23.setTransform(15.9,119.5);

	this.shape_24 = new cjs.Shape();
	this.shape_24.graphics.lf(["#B1C4CD","rgba(166,192,217,0.6)","rgba(175,200,254,0)","rgba(136,167,204,0.6)","#A3C8DC"],[0,0.102,0.58,0.851,1],-2.9,0,3,0).s().p("AgchXQAdAEAcgEIAACuQgCgDgFgCQgJgDgNAAQgLAAgJADQgGACgCAEg");
	this.shape_24.setTransform(15.9,110.5);

	this.shape_25 = new cjs.Shape();
	this.shape_25.graphics.lf(["#B1C4CD","rgba(166,192,217,0.6)","rgba(175,200,254,0)","rgba(136,167,204,0.6)","#A3C8DC"],[0,0.102,0.58,0.851,1],-2.9,0,3,0).s().p("AgcGvIAAtjQAEAEAGACQAJADALAAQANAAAJgDIAFgCIAANfQgNAFgPAAQgNAAgQgFg");
	this.shape_25.setTransform(15.9,52.9);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_25},{t:this.shape_24},{t:this.shape_23},{t:this.shape_22},{t:this.shape_21},{t:this.shape_20},{t:this.shape_19}]}).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(2.2,-45.2,61.8,166.8);


(lib.tube = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});
	
	this.shape_14 = new cjs.Shape();
	this.shape_14.graphics.f().s("rgba(102,102,102,0.498)").ss(1,1,1,3,true).p("AABAdQAEgCACgGQADgJAAgMQAAgMgDgJQgCgFgDgCAAAAdQgEgCgCgGQgDgJAAgMQAAgMADgJQACgFADgC");
	this.shape_14.setTransform(26.4,28.4);

	this.shape_15 = new cjs.Shape();
	this.shape_15.graphics.f().s("rgba(102,102,102,0.498)").ss(1,1,1,3,true).p("AgBgcIADAAAABAdIgBAA");
	this.shape_15.setTransform(26.4,28.4);

	this.shape_16 = new cjs.Shape();
	this.shape_16.graphics.lf(["#B1C4CD","rgba(166,192,217,0.6)","rgba(175,200,254,0)","rgba(136,167,204,0.6)","#A3C8DC"],[0,0.102,0.58,0.851,1],0,-2.8,0,2.8).s().p("AAAAdQgEgCgCgGQgDgJAAgMQAAgMADgJQACgFADgCIADAAQADACACAFQADAJAAAMQAAAMgDAJQgCAGgEACg");
	this.shape_16.setTransform(26.4,28.4);

	this.shape_17 = new cjs.Shape();
	this.shape_17.graphics.lf(["#B1C4CD","rgba(166,192,217,0.6)","rgba(175,200,254,0)","rgba(136,167,204,0.6)","#A3C8DC"],[0,0.102,0.58,0.851,1],39,-3.3,39,3.2).s().p("AizAdQADgCACgGQADgJAAgMQAAgMgDgJQgBgFgDgCIFlAAQgDACgBAFQgDAJAAAMQAAAMADAJQACAGADACg");
	this.shape_17.setTransform(44.7,28.4);

	this.shape_18 = new cjs.Shape();
	this.shape_18.graphics.lf(["#B1C4CD","rgba(166,192,217,0.6)","rgba(175,200,254,0)","rgba(136,167,204,0.6)","#A3C8DC"],[0,0.102,0.58,0.851,1],-16.8,0.4,0.5,0.4).s().p("AAAAdQgEgCgCgGQgDgJAAgMQAAgMADgJQACgFACgCIAEAAQADACACAFQADAJAAAMQAAAMgDAJQgCAGgEACg");
	this.shape_18.setTransform(62.9,28.4);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_18},{t:this.shape_17},{t:this.shape_16},{t:this.shape_15},{t:this.shape_14}]}).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(2.2,-45.2,61.8,166.8);



(lib.кир = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	if (lib.properties.part == 'cap') {
		this.instance_1 = new lib.cap();
		this.instance_1.parent = this;
		this.instance_1.setTransform(0,164,1.536,1.536,0,0,0,22,67.3);
		this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1}]}).wait(1));
	} else if (lib.properties.part == 'tube') {
		this.instance_1 = new lib.tube();
		this.instance_1.parent = this;
		this.instance_1.setTransform(0,60,1.536,1.536,0,0,0,40,67.3);
		this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1}]}).wait(1));
	}

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,98.8,285.9);


// stage content:
(lib.test_tube_gas = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.instance = new lib.кир();
	this.instance.parent = this;
	this.instance.setTransform(76.6,152,1,1,0,0,0,49.4,143);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(102.2,159,98.7,285.9);

})(lib = lib||{}, images = images||{}, createjs = createjs||{}, ss = ss||{});
var lib, images, ss;


if (window.modelNS) {
	modelNS.IReact.libs.test_tube_gas = lib;
	lib = null;
}
