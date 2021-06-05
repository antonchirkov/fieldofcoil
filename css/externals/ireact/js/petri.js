(function (lib, img, cjs, ss) {

var p; // shortcut to reference prototypes

// library properties:
lib.properties = {
	width: 180,
	height: 70,
	scale: 0.4,
	fps: 24,
	color: "",
	oil_film: "",
	opacity: 1.00,
	manifest: []
};



lib.ssMetadata = [];


// symbols:



(lib.cupPoetry = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// topGrans
	this.shape = new cjs.Shape();
	this.shape.graphics.lf(["rgba(80,111,96,0.8)","rgba(156,174,165,0.322)","rgba(175,190,183,0.2)","rgba(255,255,255,0.714)","rgba(103,129,114,0.208)","rgba(98,125,110,0.345)","rgba(80,111,96,0.8)"],[0.004,0.29,0.412,0.502,0.635,0.808,1],-59.2,-48.7,59.1,48.7).s().p("Ao9EmQjuh6AAisQAAirDuh7QDuh5FPAAQFQAADuB5QDuB7AACrQAACsjuB6QjuB6lQAAQlPAAjuh6gAojkGQjhBuAACaQAACbDhBuQDiBuFAAAQE9AADihuQDihuAAibQAAiajihuQjihuk9AAIAAAAQlAAAjiBug");
	this.shape.setTransform(1.5,-11.6);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	// frontGlass
	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.lf(["rgba(80,111,96,0.2)","rgba(80,111,96,0.2)","rgba(255,255,255,0.6)","rgba(80,111,96,0.2)","rgba(80,111,96,0.2)"],[0,0.412,0.51,0.596,1],-114.4,-4.7,48,-4.7).s().p("Ao9C4Qjuh6AAiqIAAjFQACAyAVAtQAKAWAPAVQA7BTCDBDQDuB4FPAAQFQAADuh4QB/hBA7hQQASgXALgZQAVgtACgxIgBDPIAAACQgJCijkB1QjuB6lQAAQlPAAjuh6g");
	this.shape_1.setTransform(2.2,19.7);

	this.timeline.addTween(cjs.Tween.get(this.shape_1).wait(1));

	// rearGlass
	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.lf(["rgba(80,111,96,0.2)","rgba(80,111,96,0.2)","rgba(255,255,255,0.6)","rgba(80,111,96,0.2)","rgba(80,111,96,0.2)"],[0,0.412,0.51,0.596,1],111.5,-4.1,-50.9,-4.1).s().p("AMVDTQgKgWgPgVQg7hTiDhDQjuh4lQAAQlPAAjuB4Qh/BBg7BQQgSAXgLAZQgVAtgCAxIABjOIAAgEQAJihDkh1QDuh6FPAAQFQAADuB6QDuB6AACrIAADEQgCgygVgtg");
	this.shape_2.setTransform(1.5,-22.4);

	this.timeline.addTween(cjs.Tween.get(this.shape_2).wait(1));

	// downGrans
	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.rf(["rgba(80,111,96,0.8)","rgba(209,215,202,0.302)"],[0.541,0.753],1.1,9.2,0,1.1,9.2,81).s().p("Ao9EmQjuh6AAisQAAirDuh7QDuh5FPAAQFQAADuB5QDuB7AACrQAACsjuB6QjuB6lQAAQlPAAjuh6gAojkGQjhBuAACaQAACbDhBuQDiBuFAAAQE9AADihuQDihuAAibQAAiajihuQjihuk9AAIAAAAQlAAAjiBug");
	this.shape_3.setTransform(1.5,8.7);

	this.timeline.addTween(cjs.Tween.get(this.shape_3).wait(1));

	
	// OIL 
	if (lib.properties.oil_film) {
		this.shape_7 = new cjs.Shape();
		this.shape_7.graphics.lf([lib.properties.oil_film,lib.properties.oil_film,lib.properties.oil_film,lib.properties.oil_film],[0,0.286,0.816,1],-78.4,-31.1,73.6,20).s().p("AogEJQjihuAAibQAAgvAWgsQAwhhCchNQCihODTgYICSgHICqAHQDjATCsBTQCxBXAnBxQAHAWADAXIABAUQAACbjjBuQjhBuk/AAQk+AAjihug");
		this.shape_7.setTransform(1.8,-4);
		this.timeline.addTween(cjs.Tween.get(this.shape_7).wait(1));	
	}

	// rgba(242,203,47,0.353);
	var color = lib.properties.color || lib.properties.defColor || 'rgba(242,203,47,0.353)',
	rgba = colorToArray(color);
	
	function prepareColor(diff)
	{
		var diffColor = [];
		for (var i=0; i<3; i++) {
			var c = rgba[i] - diff[i];
			if (c<0) c=0;
			if (c>255) c=255;
			diffColor.push(c);
		}
		var alfa = rgba[3] ? rgba[3] : 1;
		if (diff[3]) alfa -= diff[3];
		return 'rgba(' + diffColor.join(',') + ','+alfa+')';
	}

	// брать в качестве основного - с наибольшей alfa
	var colors = {
		'rgba(253,233,155,0.522)': prepareColor([0, 0, 0, 0]),
		'rgba(242,203,47,0.353)': prepareColor([11, 30, 108, 0.169]),
		'rgba(135,81,1,0.302)': prepareColor([118, 152, 154, 0.22]),
		'rgba(254,183,78,0.373)': prepareColor([-1, 50, 77, 0.149]),
	};
	
	/*
	function _tempDiff (color1, color2)
	{
		var diffColor = [];
		color1 = colorToArray(color1);
		color2 = colorToArray(color2);
		for (var i=0; i<3; i++) diffColor.push(color1[i]-color2[i]);
		console.log(color1[3], color2[3])
		diffColor.push((color1[3]||1) - (color2[3]||1));
		return diffColor;
	}
	_tempDiff('rgba(242,203,47,0.353)', 'rgba(253,233,155,0.522)');
	*/
	
	if (lib.properties.color) {
		this.shape_5 = new cjs.Shape();
		this.shape_5.graphics.lf([colors["rgba(253,233,155,0.522)"],colors["rgba(242,203,47,0.353)"],colors["rgba(135,81,1,0.302)"],colors["rgba(254,183,78,0.373)"]],[0,0.286,0.816,1],-78.4,-14.7,73.6,36.4).s().p("AImALQishSjjgSIiqgIIiSAIQjjASitBSQibBMgxBiIgBgVQAAicDihsQDihuE+AAQE/AADhBuQDjBsAACcQAAAYgGAXQgnhyiwhWg");
		this.shape_5.setTransform(1.3,-20);

		this.shape_6 = new cjs.Shape();
		this.shape_6.graphics.lf([colors["rgba(253,233,155,0.522)"],colors["rgba(242,203,47,0.353)"],colors["rgba(135,81,1,0.302)"],colors["rgba(254,183,78,0.373)"]],[0,0.286,0.816,1],-78.4,-31.1,73.6,20).s().p("AogEJQjihuAAibQAAgvAWgsQAwhhCchNQCihODTgYICSgHICqAHQDjATCsBTQCxBXAnBxQAHAWADAXIABAUQAACbjjBuQjhBuk/AAQk+AAjihug");
		this.shape_6.setTransform(1.8,7.7);

		this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_6},{t:this.shape_5}]}).wait(1));
	}

	// downGlass
	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.lf(["rgba(172,193,182,0.102)","rgba(101,130,116,0.353)","rgba(90,120,106,0.302)","rgba(80,111,96,0.102)"],[0,0.286,0.816,1],-78.4,-31,73.6,20.1).s().p("AogEJQjihuAAibQAAiaDihvQDihtE+AAQE/AADhBtQDjBvAACaQAACbjjBuQjhBuk/AAQk+AAjihug");
	this.shape_7.setTransform(1.3,8.9);

	this.timeline.addTween(cjs.Tween.get(this.shape_7).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-79.7,-53.2,163.1,103.6);


(lib.cupEmpty = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// topGrans
	this.shape = new cjs.Shape();
	this.shape.graphics.lf(["rgba(80,111,96,0.8)","rgba(156,174,165,0.322)","rgba(175,190,183,0.2)","rgba(255,255,255,0.714)","rgba(103,129,114,0.208)","rgba(98,125,110,0.345)","rgba(80,111,96,0.8)"],[0.004,0.29,0.412,0.502,0.635,0.808,1],-59.2,-48.7,59.1,48.7).s().p("Ao9EmQjuh6AAisQAAirDuh7QDuh5FPAAQFQAADuB5QDuB7AACrQAACsjuB6QjuB6lQAAQlPAAjuh6gAojkGQjhBuAACaQAACbDhBuQDiBuFAAAQE9AADihuQDihuAAibQAAiajihuQjihuk9AAIAAAAQlAAAjiBug");
	this.shape.setTransform(1.5,-11.6);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	// frontGlass
	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.lf(["rgba(80,111,96,0.2)","rgba(80,111,96,0.2)","rgba(255,255,255,0.6)","rgba(80,111,96,0.2)","rgba(80,111,96,0.2)"],[0,0.412,0.51,0.596,1],-114.4,-4.7,48,-4.7).s().p("Ao9C4Qjuh6AAiqIAAjFQACAyAVAtQAKAWAPAVQA7BTCDBDQDuB4FPAAQFQAADuh4QB/hBA7hQQASgXALgZQAVgtACgxIgBDPIAAACQgJCijkB1QjuB6lQAAQlPAAjuh6g");
	this.shape_1.setTransform(2.2,19.7);

	this.timeline.addTween(cjs.Tween.get(this.shape_1).wait(1));

	// rearGlass
	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.lf(["rgba(80,111,96,0.2)","rgba(80,111,96,0.2)","rgba(255,255,255,0.6)","rgba(80,111,96,0.2)","rgba(80,111,96,0.2)"],[0,0.412,0.51,0.596,1],111.5,-4.1,-50.9,-4.1).s().p("AMVDTQgKgWgPgVQg7hTiDhDQjuh4lQAAQlPAAjuB4Qh/BBg7BQQgSAXgLAZQgVAtgCAxIABjOIAAgEQAJihDkh1QDuh6FPAAQFQAADuB6QDuB6AACrIAADEQgCgygVgtg");
	this.shape_2.setTransform(1.5,-22.4);

	this.timeline.addTween(cjs.Tween.get(this.shape_2).wait(1));

	// downGrans
	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.rf(["rgba(80,111,96,0.8)","rgba(209,215,202,0.302)"],[0.541,0.753],1.1,9.2,0,1.1,9.2,81).s().p("Ao9EmQjuh6AAisQAAirDuh7QDuh5FPAAQFQAADuB5QDuB7AACrQAACsjuB6QjuB6lQAAQlPAAjuh6gAojkGQjhBuAACaQAACbDhBuQDiBuFAAAQE9AADihuQDihuAAibQAAiajihuQjihuk9AAIAAAAQlAAAjiBug");
	this.shape_3.setTransform(1.5,8.7);

	this.timeline.addTween(cjs.Tween.get(this.shape_3).wait(1));

	// downGlass
	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.lf(["rgba(172,193,182,0.102)","rgba(101,130,116,0.353)","rgba(90,120,106,0.302)","rgba(80,111,96,0.102)"],[0,0.286,0.816,1],-78.4,-31,73.6,20.1).s().p("AogEJQjihuAAibQAAiaDihvQDihtE+AAQE/AADhBtQDjBvAACaQAACbjjBuQjhBuk/AAQk+AAjihug");
	this.shape_4.setTransform(1.3,8.9);

	this.timeline.addTween(cjs.Tween.get(this.shape_4).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-79.7,-53.2,163.1,103.6);


// stage content:
(lib.petri = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.instance = new lib.cupPoetry();
	this.instance.parent = this;
	this.instance.setTransform(90.1,35.1,1.043,0.6,0,0,0,1.9,-1.4);

	this.instance_1 = new lib.cupEmpty();
	this.instance_1.parent = this;
	this.instance_1.setTransform(-132.6,41,1.009,0.6,0,0,0,1.9,-1.4);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.instance}]}).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-124.9,39,390,68.1);

})(lib = lib||{}, images = images||{}, createjs = createjs||{}, ss = ss||{});
var lib, images, ss;

if (window.modelNS) {
	modelNS.IReact.libs.petri = lib;
	lib = null;
}
