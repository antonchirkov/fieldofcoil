(function (lib, img, cjs, ss) {

var p; // shortcut to reference prototypes

// library properties:
lib.properties = {
	width: 490,
	height: 120,
	fps: 24,
	scale: 0.4,
	color: "#FFFFFF",
	opacity: 1.00,
	part: 'front', // front, back
	manifest: []
};



lib.ssMetadata = [];


// symbols:



(lib.lotok1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#CCCCCC").s().p("EghCAD/Qj6AAgShnIgvmLQALAgAqAUQA0AcBnAFQAbABAfABMA38AAAILCgCQAqAAAmgDQB4gHA+gjQAhgUALgfIgvGbQgnBgkOAAIqQACg");
	this.shape.setTransform(243.6,31.5);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#F5ECEC").s().p("Egh1ABOQgeAAgbgCQhngFg1gcQgpgUgLgdIAAgBQgGgUABgWQAAgBABgBQAAAAAAgBQAAAAAAgBQABAAAAgBQACgLAEgMIAxAAIgBAHQAAAAgBAAQAAABAAAAQAAABAAAAQgBABAAABQgBATAGARIAAABQALAbAoAQQAsAUBOAHQAoADAwAAMA3BAAAIK3gCQAsAAAlgCQAkgDAegEQA4gKArgUQAfgPAMgbIAEgMQADgNAAgNIAlAAIABAFQACAVgFAUIgEAOQgMAdggATQg/Ajh4AIQglACgqAAIrDACg");
	this.shape_1.setTransform(243.7,7.8);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#CCCCCC").s().p("EghDAEcQj6AAgShmIgvmLIAAgBQgGgTABgXQAAAAABgBQAAgBAAAAQAAgBAAAAQABgBAAAAQACgLAEgMIAxAAIgBAGQAAAAgBABQAAAAAAABQAAAAAAABQgBABAAAAQgBAUAGARIAAAAQALAbAoASQAsAUBOAHQAoADAwAAMAjtAAAIGLAAINJAAIK3gBQAsAAAlgDQAkgCAegFQA4gJArgUQAfgRAMgbIAEgMQADgNAAgNIAlAAIABAFQACAVgFATIgEAOIgvGbQgnBgkOAAIqRABg");
	this.shape_2.setTransform(243.7,28.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,487.3,57);


(lib.lotok2 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#B8B7B7").s().p("Egg4ACmQgxAAgngDIBBh1IAnhEQAyhHBPgjQBUgkCAgBMAxIAAFIE6AAQCTABBbAkQBVAiA2BJIAlA+IBDB0QgkACgtABIq2ABg");
	this.shape.setTransform(241.9,48.7);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#999999").s().p("EgkcAEXQgpgSgKgbIgBgBQgGgRACgTQAAgBAAgBQAAAAAAgBQAAAAAAgBQABAAAAAAIABgFQAJgkAmgxIDHkcQBjh4EIgEMAxTAAEIE7AAQEuADBrB6IDTDsQBBBKALArIABALQAAAMgEAMIgEAMQgMAbgfARQgqAUg5AKQgdAEglADIhDh1IgmhAQg1hIhVgiQhbgjiUgBIk6AAMgxHgAEQiAABhUAiQhQAjgyBGIgmBGIhBB2QhPgHgrgUg");
	this.shape_1.setTransform(243.7,34.4);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#F5ECEC").s().p("EAlbAEKIgBgMQgLgqhBhLIjTjrQhrh7kugDIk8AAMgxSgADQkJADhiB4IjIEdQgmAwgIAlIgyAAQANgoAkgyIDXkqQBkiKENgFMAyLAAFIFAAAQE0ADBsCNIDkEPQArA7AMA0g");
	this.shape_2.setTransform(243.3,26.6);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#999999").s().p("EghGAFGQgwAAgngDQhPgHgsgUQgogSgLgbIAAAAQgGgSACgTQAAgBAAAAQAAgBAAAAQAAgBAAAAQABgBAAAAIABgEIgyAAQANgoAkgyIDXkrQBkiKENgEMAyLAAEIFAAAQE0AEBsCMIDkEPQArA8AMA0IglAAQgBALgDAMIgEANQgMAagfASQgqAUg5AJQgdAFglACQglACgsABIq2ABg");
	this.shape_3.setTransform(243.3,32.7);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,486.5,65.3);


// stage content:
(lib.used_tools = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	if (lib.properties.part == 'front') {
		this.instance = new lib.lotok1();
		this.instance.parent = this;
		this.instance.setTransform(245.1,85.5,1,1,0,0,0,243.7,28.4);

		this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));	
	} else if (lib.properties.part == 'back') {
		// Layer 1
		this.instance = new lib.lotok2();
		this.instance.parent = this;
		this.instance.setTransform(245.4,36.6,1,1,0,0,0,243.3,32.6);

		this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));	
	}
	

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(246.4,117.1,487.3,57);

})(lib = lib||{}, images = images||{}, createjs = createjs||{}, ss = ss||{});
var lib, images, ss;



if (window.modelNS) {
	modelNS.IReact.libs.used_tools = lib;
	lib = null;
}

