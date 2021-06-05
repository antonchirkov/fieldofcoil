(function (lib, img, cjs, ss) {

var p; // shortcut to reference prototypes

// library properties:
lib.properties = {
	width: 125,
	height: 55,
	fps: 24,
	color: "#FFFFFF",
	opacity: 1.00,
	manifest: []
};



lib.ssMetadata = [];


// symbols:



(lib.трубкасхема = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#A9D9E5").s().p("AjUgeIACgNIGnBKIgCANg");
	this.shape.setTransform(21.7,14.7);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#BDF2FF").s().p("AjVgdIADgPIGoBJIgEARg");
	this.shape_1.setTransform(22,13.3);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#E9FFFD").s().p("AjUgfIACgLIGnBKIgBALg");
	this.shape_2.setTransform(22.2,12);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#838383").s().p("AhtDUQg/gPgdgeQgdgfgVhBQgUhCgPhNIAAgGIgLgyQgHgggegSQgfgTgDAEIgRgCIADgSIAVAEIAEABQA2APAYBKIAAAAIACAKIAdBxQAYBiAEAHQAiBEBMATQA8AKA+hXIABgBQAKgNAwhJQAlg1AXgUQA5g0BsAMQAzAFAnAPIgGAQQgegQhNgGQhMgFgpAiQgoAigsA+QgsBAgKANIgBABQg5BOg4AAIgNgCg");
	this.shape_3.setTransform(81.8,35.9);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#666666").s().p("Ah8DXIABAAQhlglgbg7QgWgugFggQgGghgNg5QgOg6gCgXQgDgXgNgQQgLgRgYgKIgUgDIAEgTIAQACQAEgEAfATQAeASAHAgIAKAyIABAGQAOBPAVA/QAUBCAeAfQAdAeA+APQA/ALBAhXIAAgBQALgNAshAQArg+ApgiQApgiBMAFQBMAGAfAQIgHASQgkgNgqgEQhNgJgqAjIAAAAQgTAOgbAkQgcAngTAfQgTAfg9A+QgtAvg1AAQgRAAgRgEg");
	this.shape_4.setTransform(81.4,38.2);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#4F4F4F").s().p("AhyDVIAAAAQhngagvhcQgKgVgJgcQgHgVgPhGIgThXIgDgKQgMgngagLIgSgDIAFgWIAUADQAXAKAMARQAMAQADAXQADAXANA7QANA7AGAeQAGAgAVAuQAcA7BlAlIgCAAQBJATA7g+QA9g+ATgfQATgfAcglQAcgmATgOIAAAAQAqgjBNAJQAqAEAjANIgIAWQghgMgqgFQhOgIgpAjIAAgBQgTARgfAsQgxBLgLAPIAAAAQhLBohNAAQgRAAgQgFg");
	this.shape_5.setTransform(80.8,40);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("#A9D9E5").s().p("AjXgRIAHgnIGnBKIgGAng");
	this.shape_6.setTransform(21.9,13.4);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#666666").s().p("Ah5DoIAAgBQhmgZgvhcQgLgVgIgdQgHgUgQhHIgShXIgDgKQgMgmgagLIgSgDIAFgXIADgTIADgRIAVADIAEABQA2AQAYBJIAAABIACAJIAdB0QAYBgAEAHQAiBEBMASQA8ALA+hXIABgBQAKgNAwhKQAlg1AXgTQA5g1BsAMQAzAFAnAPIgVA4QghgMgqgEQhOgJgqAjIAAAAQgSAQgfAsQgxBLgLAPIgBABQhLBnhNAAQgQAAgRgEg");
	this.shape_7.setTransform(81.4,38.2);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_7},{t:this.shape_6},{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0.3,7.7,120.2,54.3);


// stage content:
(lib.hose_in = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 2
	this.instance = new lib.трубкасхема();
	this.instance.parent = this;
	this.instance.setTransform(62.4,23.7,1,1,0,0,0,60.2,30.9);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(65,27.9,120.2,54.3);

})(lib = lib||{}, images = images||{}, createjs = createjs||{}, ss = ss||{});
var lib, images, ss;

if (window.modelNS) {
	modelNS.IReact.libs.hose_in = lib;
	lib = null;
}