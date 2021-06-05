(function (lib, img, cjs, ss) {

var p; // shortcut to reference prototypes

// library properties:
lib.properties = {
	width: 250,
	height: 50,
	scale: 0.5,
	fps: 24,
	rotation: 10,
	y:-20,
	// height:60,
	color: "#FFFFFF",
	opacity: 1.00,
	manifest: []
};



lib.ssMetadata = [];


// symbols:



(lib.Tween1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#B5C1CF").s().p("EgBEAh6IgUhEIAElPIAfvAIA/1cIAnzFIjVnCIFJG9MgAKArpQACgDgUITIgXIUIACAaQAAAggHAbQgVBXhOADIgDAAQgvAAgchDg");
	this.shape.setTransform(365.3,-86.6,1.805,1.805,-101.7,0,0,1.9,208.9);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-392.3,-104.8,784.6,209.7);


(lib.pinzet_1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.lf(["#DDE3E3","#B5C1CF","#D3DBDE","#C5CFD7","#DDE3E3","#B8C4D0","#DDE3E3","#BCC7D2","#DDE3E3","#C4CED6","#DDE3E3","#C9D2D8","#DDE3E3","#CDD5DA","#DDE3E3"],[0,0.078,0.173,0.239,0.314,0.384,0.447,0.51,0.584,0.639,0.729,0.784,0.851,0.922,1],-12,2.8,10.2,-3.1).s().p("AiMgOIEBgvIAYBXIkFAkg");
	this.shape.setTransform(109.7,47.9);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("rgba(181,193,207,0.502)").ss(0.1,0,1).p("AdOnwQgZgBgdAGIgXAFQjuAkjtAkQnaBIADACMgmsAHVIlSFwIFrkLIRAivITKivINYiKIEqg1IA5geQA4glgLgtQgQhEhQgFg");
	this.shape_1.setTransform(125.1,51.5,0.593,0.593);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#DDE3E3").s().p("A5dCBMAmsgHVQgDgCHahIIHbhIIAXgFQAdgGAZABQBQAFAQBEQALAtg4AlIg5AeIkqA1ItYCKIzKCvIxACvIlrELg");
	this.shape_2.setTransform(125.1,51.5,0.593,0.593);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(15));

	// Layer 2
	this.instance = new lib.Tween1("synched",0);
	this.instance.parent = this;
	this.instance.setTransform(235.8,26.8,0.297,0.297,-1.7,0,0,373.1,-88.9);

	this.timeline.addTween(cjs.Tween.get(this.instance).to({regY:-88.8,rotation:0},7).to({regY:-88.9,rotation:-1.7},7).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(7.5,21.1,235.3,70.1);


// stage content:



(lib.tweezers = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.instance = new lib.pinzet_1();
	this.instance.parent = this;
	this.instance.setTransform(19.7,8.1,1,1,0,0,0,20.5,14.5);
	
	this.clip = this.instance;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(132.6,65.4,234.8,69.2);

})(lib = lib||{}, images = images||{}, createjs = createjs||{}, ss = ss||{});
var lib, images, ss;

if (window.modelNS) {
	modelNS.IReact.libs.tweezers = lib;
	lib = null;
}