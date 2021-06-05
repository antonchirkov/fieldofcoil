(function (lib, img, cjs, ss) {

var p; // shortcut to reference prototypes

// library properties:
lib.properties = {
	width: 250,
	height: 250,
	fps: 12,
	scale:0.35,
	color: "#FFFFFF",
	opacity: 1.00,
	manifest: []
};



lib.ssMetadata = [];


// symbols:



(lib.искра_1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.rf(["rgba(255,255,255,0.498)","rgba(255,255,51,0.298)","rgba(255,4,4,0.4)"],[0.004,0.6,1],-1.4,-2.1,0,-1.4,-2.1,72.4).s().p("AgGBHIiGJ+IB5qBIkAJYIDzpdIlwIaIFkoiInSHIIHInSIoiFkIIalwIpdDzIJYkAIqBB5IJ+iGIqMgHIKMgGIp+iGIKBB5IpYkAIJdDzIoalwIIiFkInInSIHSHIIlkoiIFwIaIjzpdIEAJYIh5qBICGJ+IAGqMIAHKMICGp+Ih5KBIEApYIjzJdIFwoaIlkIiIHSnIInIHSIIilkIoaFwIJdjzIpYEAIKBh5Ip+CGIKMAGIqMAHIJ+CGIqBh5IJYEAIpdjzIIaFwIoilkIHIHSInSnIIFkIiIlwoaIDzJdIkApYIB5KBIiGp+IgHKMg");
	this.shape.setTransform(83.6,192.5,1.224,1.168,16.9);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.rf(["rgba(255,255,255,0.498)","rgba(255,255,51,0.298)","rgba(255,4,4,0.4)"],[0.004,0.6,1],-1.4,-2.1,0,-1.4,-2.1,72.4).s().p("AgGBHIiGJ+IB5qBIkAJYIDzpdIlwIaIFkoiInSHIIHInSIoiFkIIalwIpdDzIJYkAIqBB5IJ+iGIqMgHIKMgGIp+iGIKBB5IpYkAIJdDzIoalwIIiFkInInSIHSHIIlkoiIFwIaIjzpdIEAJYIh5qBICGJ+IAGqMIAHKMICGp+Ih5KBIEApYIjzJdIFwoaIlkIiIHSnIInIHSIIilkIoaFwIJdjzIpYEAIKBh5Ip+CGIKMAGIqMAHIJ+CGIqBh5IJYEAIpdjzIIaFwIoilkIHIHSInSnIIFkIiIlwoaIDzJdIkApYIB5KBIiGp+IgHKMg");
	this.shape_1.setTransform(83.5,192.6,1.05,1.087,25.2);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.rf(["rgba(255,255,255,0.498)","rgba(255,255,51,0.298)","rgba(255,4,4,0.4)"],[0.004,0.6,1],-1.4,-2.1,0,-1.4,-2.1,72.4).s().p("AgGBHIiGJ+IB5qBIkAJYIDzpdIlwIaIFkoiInSHIIHInSIoiFkIIalwIpdDzIJYkAIqBB5IJ+iGIqMgHIKMgGIp+iGIKBB5IpYkAIJdDzIoalwIIiFkInInSIHSHIIlkoiIFwIaIjzpdIEAJYIh5qBICGJ+IAGqMIAHKMICGp+Ih5KBIEApYIjzJdIFwoaIlkIiIHSnIInIHSIIilkIoaFwIJdjzIpYEAIKBh5Ip+CGIKMAGIqMAHIJ+CGIqBh5IJYEAIpdjzIIaFwIoilkIHIHSInSnIIFkIiIlwoaIDzJdIkApYIB5KBIiGp+IgHKMg");
	this.shape_2.setTransform(83.6,192.6,1.434,1.434,20.7);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.rf(["rgba(255,255,255,0.498)","rgba(255,255,51,0.298)","rgba(255,4,4,0.4)"],[0.004,0.6,1],-1.4,-2.1,0,-1.4,-2.1,72.4).s().p("AgGBHIiGJ+IB5qBIkAJYIDzpdIlwIaIFkoiInSHIIHInSIoiFkIIalwIpdDzIJYkAIqBB5IJ+iGIqMgHIKMgGIp+iGIKBB5IpYkAIJdDzIoalwIIiFkInInSIHSHIIlkoiIFwIaIjzpdIEAJYIh5qBICGJ+IAGqMIAHKMICGp+Ih5KBIEApYIjzJdIFwoaIlkIiIHSnIInIHSIIilkIoaFwIJdjzIpYEAIKBh5Ip+CGIKMAGIqMAHIJ+CGIqBh5IJYEAIpdjzIIaFwIoilkIHIHSInSnIIFkIiIlwoaIDzJdIkApYIB5KBIiGp+IgHKMg");
	this.shape_3.setTransform(83.6,192.4,0.856,0.856,14.7);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.rf(["rgba(255,255,255,0.498)","rgba(255,255,51,0.298)","rgba(255,4,4,0.4)"],[0.004,0.6,1],-1.4,-2.1,0,-1.4,-2.1,72.4).s().p("AgGBHIiGJ+IB5qBIkAJYIDzpdIlwIaIFkoiInSHIIHInSIoiFkIIalwIpdDzIJYkAIqBB5IJ+iGIqMgHIKMgGIp+iGIKBB5IpYkAIJdDzIoalwIIiFkInInSIHSHIIlkoiIFwIaIjzpdIEAJYIh5qBICGJ+IAGqMIAHKMICGp+Ih5KBIEApYIjzJdIFwoaIlkIiIHSnIInIHSIIilkIoaFwIJdjzIpYEAIKBh5Ip+CGIKMAGIqMAHIJ+CGIqBh5IJYEAIpdjzIIaFwIoilkIHIHSInSnIIFkIiIlwoaIDzJdIkApYIB5KBIiGp+IgHKMg");
	this.shape_4.setTransform(83.6,192.5,1.122,1.122,7.2);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.rf(["rgba(255,255,255,0.498)","rgba(255,255,51,0.298)","rgba(255,4,4,0.4)"],[0.004,0.6,1],-1.4,-2.1,0,-1.4,-2.1,72.4).s().p("AgGBHIiGJ+IB5qBIkAJYIDzpdIlwIaIFkoiInSHIIHInSIoiFkIIalwIpdDzIJYkAIqBB5IJ+iGIqMgHIKMgGIp+iGIKBB5IpYkAIJdDzIoalwIIiFkInInSIHSHIIlkoiIFwIaIjzpdIEAJYIh5qBICGJ+IAGqMIAHKMICGp+Ih5KBIEApYIjzJdIFwoaIlkIiIHSnIInIHSIIilkIoaFwIJdjzIpYEAIKBh5Ip+CGIKMAGIqMAHIJ+CGIqBh5IJYEAIpdjzIIaFwIoilkIHIHSInSnIIFkIiIlwoaIDzJdIkApYIB5KBIiGp+IgHKMg");
	this.shape_5.setTransform(83.6,192.4);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-20,88.9,207.4,207.4);


// stage content:
(lib.spark = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.instance = new lib.искра_1();
	this.instance.parent = this;
	this.instance.setTransform(125.1,125.1,0.01,0.01,0,0,0,85.2,195.4);

	this.timeline.addTween(cjs.Tween.get(this.instance).to({regX:84.3,regY:192.3,scaleX:1.2,scaleY:1.2,x:125.8,y:124.7},1).to({regX:85.2,regY:195.4,scaleX:0.01,scaleY:0.01,x:125.1,y:125.1},2).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(249,249,2,2);

})(lib = lib||{}, images = images||{}, createjs = createjs||{}, ss = ss||{});
var lib, images, ss;

if (window.modelNS) {
	modelNS.IReact.libs.spark = lib;
	lib = null;
}