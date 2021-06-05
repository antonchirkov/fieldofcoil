(function (lib, img, cjs, ss) {

var p; // shortcut to reference prototypes

// library properties:
lib.properties = {
	width: 180,
	height: 225,
	fps: 12,
	color: "#FFFFFF",
	opacity: 1.00,
	// scale: 0.36,
	size:Infinity,
	manifest: []
};



lib.ssMetadata = [];


// symbols:



(lib.волокна = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});
	
	var color = lib.properties.color || lib.properties.defColor,
		rgba = colorToArray(color);

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s(color).ss(1,1,1).p("AJXE5QAFgBAFgBQBBgOAugcQA2giAcg3QAeg8gRg3QgSg3g8gkQgrgbhLgYQjhhFjkgbQgKgIgMgHQgMgHgOgHQhlgthugCQhvgDhnAoQAIAPAOALQASAPAbAHQAMAEAOACQAbAEAlgBQBjgEBhgNQgmgGgmgBQhfgDhZAYQgfAIgdALQgrAQgbAeQgFAGgEAGQgRADgRAEQhRASgyAiQgnAZgPAiQgZANgWAPQg4AmAAApQgBAXAPAUQAWAbAzAVQDlBgEsARQDbALFJgfQBFgHApgIQBCgVAvgqQA0gvAAg7QgBhJhLgzQg9gnhcgQQhDgMhNgHQgwgFg1gCQgYgBgYgBQgEAAgEAAQgDgBgDgBQhJgchOgNQhigShmAHQgBAAgBAAQgEABgEAAIgHABQg4AHgpAYQgcARgOAVQgNAVgBAZQAAAEABAGQABAJADAJQACABADAAQBiAiBqAAQBugBBngmQAfgLAVgNQAKgHAIgIQALgMAGgNQAFgLABgMQhigCi1AFQiIAEhbAKQgnAFgfAFQgIABgHACQABAEABAFQAKAXAfAOQhjARgOA8QgGAdARAdQAPAcAdAPQAYANAhAGQAXAEAnACQEgAOEpgqQA5gKAhgPQAvgWAOgmQhBgrhHgfQABgKgEgKQgEgJgKgLQgIgJgKgIQgOgKgSgJQgTgIgUgIQgDAAgEAAQAAgBABgBQABgUgIgTQgDgJgGgJQgDgHgFgGQgQgVgWgRQghgEghgDQgwgEgvgDQiSgIiQAJQinAMiiAjQhdASgwAkQghAXgSAiQgTAjAGAkQAKBLB4A4QAOAGAOAHQDsBkExAEQAMAAAMAAQDwAAFFg9QAxgJAcgOQApgVALghQAEgPgBgPQgCgZgRgZQgXgigrgdQg6gkhDgcQhBgbhJgRQgSgNgXgLQgBgBgCgBQhOgjhVgNQAbgEAbgEQAWgEAWgEQApgHApgJQAsgKAZgMQAkgRAOgdQALgeAFgPQAKgaASgHAkSAJQgDAAgDAAQgGAAgGABQgPABgOACQAMAHAPAFQADACADABQACAGADAFQABATAVARQAUARAfAJQAcANAjAGQBcARBbgJQAdgDAcgFQBegKBbgdQAygQAKgaQABgFABgFQgTgIgTgIQABgDABgEQgPgBgPgCQgrgDgtAAQg6gCg/AAQhxAAjiALQgFAGgDAIQgBADAAADQgBAFABAFQALAXAaATQAQAMAUAIQAFACAFABQB3AZB4gFQAbgBAbgDQA+gMA7gYQBHgbARgsQgOgFgOgFQgjgJgjgJQgfgIghgGQi1ggixAqQgoALgQARgAiMhzQhmAKhvAYQgQAYAFAYQh4AXhYAvQgKAVAAAXQAABBBGArQA1AiBWARQChAhB0ASQBWAOA8AGQDtAXC7goQBrgXAZg6QAQgkgPgpQgDgHgDgGQgPgfgbgVQgdgWgqgNQgcgJgygIQgjgGgmgEQgQgBgRgCQABgDAAgDQADgNgDgPQgEgQgLgRQgEgGgGgGQgLgNgQgMQgQgDgQgDQicgei8AR");
	this.shape.setTransform(82.2,91.5);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s(color).ss(1,1,1).p("AjrmhQgNBdA0BhQAsBTBUBKQAiAeB7BcQBkBLAzA4QBIBSgWA/QgWA9hpAUQhmAShngTQhqgThag1QgUgNgLgKQgPgOgGgQQgIgVAJgZQAIgXASgRQAigbA4gCQA8gFA6ASQA4ASAuAmQAtAkADAmQABAYgSASQgSATgWgI");
	this.shape_1.setTransform(85.8,53.8,1.429,1.429,-8.9);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f().s(color).ss(1,1,1).p("ABuD5QAVAEAMACQAwAIAngCQAvgCAngQQArgSAbggQASgVAHgYQAGgbgJgWQgJgTgWgPQgPgKgdgMQjphci3gQQh3gMhCAqQgrAcgEAjQgFAqA0AwQARAPATANQBFAwBjAaQBAAQBuANQAcADAeADQArAEAdgJQAngLAHgeQAFgXgPgYQgMgUgYgRQhJg6hcgaQhagaheAKQgeADgWARQgZASAIAXQAGAUAgANQCMA/ChAGQAUABAPgGQASgHABgQQABgQgXgTQhDgyhSgVQhRgVhSANQgaAEgEAOQgEAKAKALQAHAJANAGQAsAVAxAFQAvAGAwgLQATgFACgKQABgHgGgGQgEgGgIgDQgugXgygHQg0gHgyALQAFANAQADQAMACAIgGQADgCACgDAFUj6Qh4gJg/gBQhmgChQAKQhgAMhSAiQhaAkhCA8Qg8A3AHAyQAGAfArAlQA3AvBMAkQAgAPAkANQBIAbCUAlQAgAHAWAEAhYBGQgCAFAFAJQAIAMAJgH");
	this.shape_2.setTransform(83.6,82.8,1.429,1.429,-8.9);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f().s(color).ss(1,1,1).p("AjZEdQBOAfBYgDQBUgDBMgkQBcgsAPhFQANg9g3hKQgsg7hPg9QgTgPh6hWQgXgSgIgIQgPgPgFgRQgGgTAKgUQALgUATAA");
	this.shape_3.setTransform(106,59.8,1.429,1.429,-8.9);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f().s(color).ss(1,1,1).p("AkPBUQBGA3BTAjQBUAjBXAMQBsAOA/gjQATgKANgPQAOgQACgTQABgegcggQgbgfg0gkQhNg0gHgGQgtgkgYgrQgZgzALgv");
	this.shape_4.setTransform(96.3,77.6,1.429,1.429,-8.9);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f().s(color).ss(1,1,1).p("AAYCCQgNgNgVgPQgggVgFgEQgvgjgGglQgDgSAHgVQAIgUAOgQQAeggAzgQQAggIA/gD");
	this.shape_5.setTransform(49.1,80.1,1.429,1.429,-8.9);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f().s(color).ss(1,1,1).p("ADaDgQhdAIhfgSQhbgShVgpQgigRgUgPQgcgVgNgZQgdgxAUg+QARg5AugtQBOhLBygMQBygNBeA3QAeASAKATQAHALgBAOQAAAPgIAK");
	this.shape_6.setTransform(50.3,80.7,1.429,1.429,-8.9);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f().s(color).ss(1,1,1).p("Ak2AEQAJA4BEA2QBgBMB7AYQB6AYB1giQAkgKAWgSQAcgWAAgdQACgfgjgjQg8g7iBgmQiog1gmgUQg0gcAFgiQABgUAWgNQASgLAZgEQBFgIA7AZ");
	this.shape_7.setTransform(83.6,89.6,1.429,1.429,-8.9);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f().s(color).ss(1,1,1).p("AgainQibgriFANQhTAKguAfQgeAVgPAfQgRAgAGAhQAHAzBHAxQA+AqBSAdQBCAXBZATQFFBADehbQA7gZANgjQAMgfgWgkQgSgcgjgaQiShoj7gZQgjgDgcgBQgYAAgUABQg8ADgwAQQgfALgTARQgXAVAAAaQAAAxBVAcQCHAtCPAHQAQAAAHgBQAMgCAHgHQALgMgHgUQgGgQgQgNQgwgqhQgQQgygKhegBQgjAAgDATQgCAQAXAMQA/AmBNAKQBKALBKgTQgfgegugIQgvgJgmAUQALARATAGQATAHATgFQgFgJgMgFQgMgGgMACAEzgfQi3hZh5gmQgNgEgQgF");
	this.shape_8.setTransform(87.3,100.5,1.429,1.429,-8.9);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f().s(color).ss(1,1,1).p("AA2lFQCnBmCLB0QB8BngYBVQgLArgsAdQgkAYg2AMQiOAijEgdQhCgKhpgWQiKgeghgGQghgFgWADQgdAEgOAUQDeBxDtBB");
	this.shape_9.setTransform(78.3,84.4,1.429,1.429,-8.9);

	this.shape_10 = new cjs.Shape();
	this.shape_10.graphics.f().s(color).ss(1,1,1).p("AhImEQgMAUAEAcQADAaAQAWQAOASAXASQANAJAcATQBOAsCpBlQA5AjAVAPQArAeAaAdQAhAkAOAsQAPAwgLArQgLAtgnAmQgiAggxAXQijBNjlggQjTgeiPhpQg0goADgjQACgjAugdQBFguBWgGQBWgHBLAjQAmASAWAdQAaAigLAh");
	this.shape_10.setTransform(90.4,69.2,1.429,1.429,-8.9);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_10},{t:this.shape_9},{t:this.shape_8},{t:this.shape_7},{t:this.shape_6},{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1,-1,166.4,132.7);


(lib.glassvol = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});
	
	// волокно
	this.instance_1 = new lib.волокна();
	this.instance_1.parent = this;
	this.instance_1.setTransform(85.5,105.3,1,1,0,0,0,82.2,65.3);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,-44.6,180.3,234.5);



(lib.волокно = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});
	
	var color = lib.properties.color || lib.properties.defColor;

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s(color).ss(1,1,1).p("ABYCKQACgCABgEQAGgMAAgNQAAgOgIgJQgOgQgjgDQgQAAgQADQgXAEgWAMQgTAJgMAPQgBABgBABQAQgLAYgLQAYgLAOgJQAOgJAIgHQAFgEACgFQADgGgDgFQgCgDgFgBQgHgBgDgBQgZgCgUgVQgEgDgDgDQgNgRgDgWABUi7QgMAughAwQgXAjgoAvQgEAEgEAEQgdAdgNAXQgWAoALAhQAGgGAJgGQgJAMgBAMQADAFADAEQAMARAXAJQAfANAhgGQAsgIATgeAhPCQQgOACgDgJQAAgFAFgFQADgCADgDQABACABACQABAFACADQAAAEABAEQAAABAAABQADASAUAMQARAKAZACQAdAEAggIQASgEALgJQANgKAAgOQAAgDgBgEQgCgGgGgGQgIgIgLgCQgRgDgbAHQg7AQggAHQgBABgBAAQgBAAgCAAg");
	this.shape.setTransform(9.7,18.8);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1,-1,21.5,39.6);



(lib.probirka_vol = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// волокно
	this.instance_1 = new lib.волокно();
	this.instance_1.parent = this;
	this.instance_1.setTransform(15.6,90.6,1,1,0,0,0,9.7,18.8);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0.1,0,32.2,134.6);


// stage content:
(lib.fiber = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});
	
	// множество
	if (lib.properties.size == Infinity) {
		this.instance = new lib.glassvol();
		this.instance.parent = this;
		this.instance.setTransform(92.5,132.7,0.905,1,0,0,0,92.9,80.2);

		this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));
	} else {
		// один
		this.instance = new lib.probirka_vol();
		this.instance.parent = this;
		this.instance.setTransform(50,45,1.609,1.609,0,0,0,0,0);

		this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));
	}
	

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(98.4,132.8,163.2,234.5);

})(lib = lib||{}, images = images||{}, createjs = createjs||{}, ss = ss||{});
var lib, images, ss;


if (window.modelNS) {
	modelNS.IReact.libs.fiber = lib;
	lib = null;
}
