(function (lib, img, cjs, ss) {

var p; // shortcut to reference prototypes

// library properties:
lib.properties = {
	width: 164,
	height: 32,
	scale: 0.4,
	fps: 24,
	color: "#FFFFFF",
	opacity: 1.00,
	soot: false,
	manifest: []
};



lib.ssMetadata = [];


// symbols:



(lib.стекло = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("rgba(164,195,205,0.298)").ss(0.1,1,1).p("AspAyQgCgHAAgHQAAgBABgBQACgQAQgTIBHhkQAiguBZgCIQtACIBrAAQBnABAkAvIBMBbQAOATAEARQABAHgCAGIAAA4QADAJgDAHIAAAEQgNAghaAAIjsABIyoAAQhUAAgFgiQgBgHACgHgAMqApQgDAOgNAIQgbAPg8AAIjsAAIyoAAQgxAAgWgLQgOgHgDgK");
	this.shape.setTransform(81.2,15);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.lf(["rgba(187,205,213,0.514)","rgba(136,164,170,0.2)","rgba(90,160,190,0.212)","rgba(210,226,232,0.49)","rgba(211,229,237,0.259)","rgba(157,200,217,0.2)","rgba(243,247,249,0.322)","rgba(220,229,232,0.18)"],[0,0.11,0.302,0.502,0.643,0.761,0.867,1],-46.8,-64.5,48.7,66.3).s().p("ArRByQgxAAgWgLQgOgIgDgKQgCgGAAgIIABgCQACgPAQgVIBHhiQAigvBZgBIQtACIBrAAQBnABAkAuIBMBZQAOAVAEARQABAIgCAGQgDAOgNAHQgbAPg8ABIjsAAg");
	this.shape_1.setTransform(81.2,11.5);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.lf(["rgba(187,205,213,0.514)","rgba(136,164,170,0.6)","rgba(90,160,190,0.212)","rgba(210,226,232,0.49)","rgba(211,229,237,0.259)","rgba(157,200,217,0.2)","rgba(243,247,249,0.322)","rgba(220,229,232,0.18)"],[0,0.11,0.302,0.502,0.643,0.761,0.867,1],88.1,-2.2,-109.7,-2.2).s().p("ArRA1QhUAAgFghQgBgHACgIIAAgyQADALAOAHQAWAMAxgBISoAAIDsAAQA8AAAbgPQANgIADgOIAAA2QADAJgDAHIAAAEQgNAghaAAIjsAAg");
	this.shape_2.setTransform(81.2,24.6);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1,-1,164.4,32);


(lib.сажа = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#000000").s().p("Ah1BWQgTgEgEgKQgBgJgDgDQgEgEgKAAIh8gCQgaAAgLgJQgEgDgDgEIAuABQAAADAGAAQAcABALgDQALgEgDgHQgCgEgIAAIhOAAQArgGAXgBQAIAAACgFQACgFgGgDIgDAAIAdgLQAFgCABgDQAAgEgHgEIgCAAQAHAAACACQADADACAFQACAJgHAGQgGAHgKADIgSAEQgMACgGACQBLAAAmADQAPABAHAFQAFAEABAGQACAGgDAFQAUAGAXACQABgYAJgIQAGgGANgDIAWgGQgNgEggACQgdACgsgCQgOgBgFgEQgFgGACgOQgIgGgBgLQgBgHADgNQhIgHhJgEQAFgDgFgHQgDgDgHgBQgXgEgfgCIgMgBIgSgHIgNgFQCIAACFAQQBMAJAcABQBIAEBJgQQAPgCAFACQAFADACAFQACAFgDAEIBGABQAAgGAKgBQAWgEApAHQAqAHAUgCQgDgFACgFQACgGAFgCQAGgEAOAAIAUABIAsADQAKABADACQAIAFgEAHIBdADQAOAAAIADQAMAGgBALQgBANgXAGIhBARQAEAEgCAFQgCAGgFAEQgHAEgQAAIhOABIBBAPQAMADADAGQAEAFgEAHQgDAGgGADQgJADgRgEIglgGQg1gIgygFQgEADADAHIAFAMQACAGgEAGQgEAFgHACQgGADgTgCQgzgGh8AKQgtADgjAAQg3AAglgIgABIAeQgYAFgwAGQA8ADA5gLQgIgGgNAAIgYADgAF0giIgkAEIg1ACQggABgUAGIAAAIQAZABAaAGQAJACADAEQAFADAAAOQAIAEADgEQABgCAAgFQAAgKAIgEQADgCALgBIBsgEQAAgLAEgDQACgCAFgBIAHgDQgPABgdgCIglgCIgGAAgAlZANIAzgHIAGACIg1AFgAnEgBIAhgJIAggGQAJgCAUABIANABIglAGIhFAKIAAAAIgBgBgAk+gJIABABIgPACgAkugMIAggHIAoAAIAAAAIgFAGIgCABIg9ADIgEgDgAm3gaQAHgEANAAIgUAEgAmfgfIhlgPQgQgCgJgFIgDgCQgHgFgCgIQgCgIAEgGQADgFAHgCQAGgCAJAAIA3gCQATAEASAGIgGAAQgngCgvgFIgIAAQgEABAAAEQgBAEAEACQADABAEAAIBkAIIAdACIALAFIgjgBIAtAHQAMAIAMAJIgGAAIgDgBIgGABIAAAAQgPABgeAIgAk/gnIgPgBIgQgNIASADQAJABAEAEQADACABAEIgEAAgAlrg+IgGgEQAVADANACIgcgBg");
	this.shape.setTransform(55.5,9.5);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,111,19);


(lib.стеклосажа_1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	if (lib.properties.soot) {
		this.instance = new lib.сажа();
		this.instance.parent = this;
		this.instance.setTransform(74.5,12.3,1,0.71,0,0,0,55.5,9.5);
		this.instance.alpha = 0.59;
		this.instance.filters = [new cjs.BlurFilter(10, 10, 1)];
		this.instance.cache(-2,-2,115,23);
		this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).wait(1));
	}

	this.instance_1 = new lib.стекло();
	this.instance_1.parent = this;
	this.instance_1.setTransform(40.5,10.7,1,1,0,0,0,40.5,10.7);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1}]}).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,162.5,30.1);


// stage content:
(lib.slideglass = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.instance = new lib.стеклосажа_1();
	this.instance.parent = this;
	this.instance.setTransform(82,16,1,1,0,0,0,81.2,15);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(88.8,35,162.5,30.1);

})(lib = lib||{}, images = images||{}, createjs = createjs||{}, ss = ss||{});
var lib, images, ss;



if (window.modelNS) {
	modelNS.IReact.libs.slideglass = lib;
	lib = null;
}


