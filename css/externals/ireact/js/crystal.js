(function (lib, img, cjs, ss) {

var p; // shortcut to reference prototypes

// library properties:
lib.properties = {
	width: 160,
	height: 100,
	fps: 12,
	color: '#cc0000', // '#ABDEF5',	// #ABDEF5 - лед
	opacity: 1.00,
	size:1,
	manifest: [],
	type: "glass"
};



lib.ssMetadata = [];


// symbols:



(lib.icrystal = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});
	
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
		'#ABDEF5': prepareColor([0, 0, 0, 0]),
		'#B8DBEC': prepareColor([-13, 3, 9, 0]),
		'#B9DFF0': prepareColor([-14, -1, 5, 0]),
		'#A2D6EE': prepareColor([9, 8, 7, 0]),
		'#C4E4F3': prepareColor([-25, -6, 2, 0]),
		'#A1CADE': prepareColor([10, 20, 23, 0]),
		'#B3DAEC': prepareColor([-8, 4, 9, 0]),
		'#A2C4D4': prepareColor([9, 26, 33, 0]),
		'#A5D3E7': prepareColor([6, 11, 14, 0]),
		'#B0D5E5': prepareColor([-5, 9, 16, 0]),
		'#CBE6F3': prepareColor([-32, -8, 2, 0]),
		'#BADDEE': prepareColor([-15, 1, 7, 0]),
		'#CDE2EC': prepareColor([-34, -4, 9, 0]),
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
	_tempDiff('#ABDEF5', '#A2D6EE');
	*/

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f(colors['#B8DBEC']).s().p("AgVAIIAAAAIAAgBIgBgBIgBgGIAAAAIADAFQARgdAIgOIARgYIACABQgCAEgBAHIgFAWIgIASIgDAIIgCAJIADgGIABgBIgHAcQgCAQgBASIAAABIgBAAQgMgkgFgTgAgXAAIAAAAIAAAAg");
	this.shape.setTransform(29.3,33.8);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f(colors["#B9DFF0"]).s().p("AgrAQQAPgZADgBIAZgPQAagQAMAAIAWgCIAAABQgDABgHAFIgGAGIgSAMIgTANQgNAFgbAWIgaAWIAQgcg");
	this.shape_1.setTransform(31.8,23.4);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f(colors['#A2D6EE']).s().p("Ag2AeIAIgcIgBABIgDAFIADgIIADgIIAHgTIAFgVQABgHACgEIgBgCIgRAYQgLAOgQAeIgDgFIgFgVIgGglIAlgHIAIAAIAOABQAMADAAADQAAADA7gEIACAAIACgBIArgDIgIACQgFABgSAKIgUALQgGACgMAIIgNAIIgHAGIgBAAIgMAQIgCABIgCAEIAAABIgGAHIgJAMQAAAAAAABQAAAAAAAAQAAAAAAAAQAAABAAAAQgRAVgIANQABgTACgPg");
	this.shape_2.setTransform(34.7,33.6);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f(colors['#C4E4F3']).s().p("AgsA/IgDgHQgDgEAAgCQgBgHgSghIAAAAIAAgBIgBAAIgCgFIACABQAKADAJAAQATggAIAeIAJgBIAAgBQADgBADAAQAJgCAaA6QAOg7APgDIAEgBIAAgEIABgCIAGAtIAEAJIACADIABADIAAABIgpAJQgKADgdABIglABgAA4gBIAFgBIAAgBIgFACgAAkgtQgRgHgDgGIAEABIAegHIAFAhQgEgEgPgKg");
	this.shape_3.setTransform(43,33.2);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f(colors['#A1CADE']).s().p("AgLAIIgIgIIgBADIAAgBIgCgEIgCgOIACgCIAAABQAWAJAXAQIACABIgBAAIgBAAIgCAAQgMAKgJAAQgHAAgEgLg");
	this.shape_4.setTransform(51.1,31.9);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f(colors['#B3DAEC']).s().p("AAOAYIABgBIgBAAQgWgSgYgIIABAAIAAgBIABAAIAIgGQAIgFADgBIAGgDIAFgDIAFgDIAMgIIABAAIgCAVIgCAdIAAADIABACIAAABIABABIgIAKIAGgKgAAYAIQAAAAAAgBQABAAAAgBQAAAAABAAQABgBAAAAQADAAACAGIAAABIABACIgDABIgFAAIgCACIgHAEIAIgNg");
	this.shape_5.setTransform(52.1,30.5);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f(colors['#A2C4D4']).s().p("AgQBBIgBgDIgCgDIgDgJIgHgvIAIAIQAIAVAYgUIACAAIABAAIgGAKIAIgKIgBgBIAAgBIgBgCIAAgDIACgcIACgWIAAgBIAAAAIgBABIgMAIIgFAEIgFACIgGADQgEABgHAFIgIAGIgBABIgBAAIgCAAQgBgHAGgSQAHgXAAgDIABAAQAFACAFgBQAIACAVALIABADIgBADIABgBQAEASAHAVIACAIIADgCIgDACQAAAAAAAAQAAAAAAABQAAAAAAAAQAAABABAAIgCgCIAAAAQgBgEgDgBQgBABAAAAQgBAAAAAAQgBABAAAAQAAABAAAAIgIAMIAHgFIACgCIAFAAIgVAaQAAAAAAABQAAAAAAABQgBAAAAABQgBAAAAAAQgFAAgCAMQgFALgDABQgDABgCAFIgCAFIgBgCg");
	this.shape_6.setTransform(52.1,31.7);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f(colors['#ABDEF5']).s().p("AhlBXQgFgKgEAAIAAAAQAIgOARgVQAAAAAAAAQAAAAAAAAQAAgBAAAAQAAAAAAAAIAJgNIAGgHIAAAAIACgEIACgCIAMgPIADACIAIALIADAFIAAAAIAAAAIABAAQASAiABAGQAAACADAEIACAIIABABQgDAAgXAMQgXALgFAAIgGABQgTAAgIgKgAATALQgDAAgDABQAEgKAFgIQAHgUAHgMIAHgLIgHABIgpADIAAgBIABgBIAAAAIAXgPIAqgUQAKgEAigJQADgBADAAIgGAPQgFAHgDABIAAAAIgBAAQgCABgFAHQgFAJgDAAIgBAAIgeAHIgEgBQADAGAQAIQAQAJADAEIABABIAAABIAAABIACAOIABAGIABAAIAAACIgEABQgQAFgNA7Qgag6gLACgABaADIAAACIgEAAIAEgCg");
	this.shape_7.setTransform(40,32.3);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f(colors['#A5D3E7']).s().p("AgXA5IgFghIABAAQAEAAAFgJQAFgHACgBQAAADgHAXQgGASABAHgAAAAIQgFABgFgCQACgBAFgGIAFgOIABAAIgBAAIAAAAIABgDQAHgSAEgVIABAAQAGAqADAMIABAEIAEATQgXgLgGgCg");
	this.shape_8.setTransform(51,24.2);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f(colors['#B0D5E5']).s().p("AgRAQIgHggQgBgKAAgPIAAgBQAEgBAvAPIgRAdIgSAoIgBABIgBABQAAgGgGgVg");
	this.shape_9.setTransform(40.5,23.3);

	this.shape_10 = new cjs.Shape();
	this.shape_10.graphics.f(colors['#CBE6F3']).s().p("AhOBcIgIgLIgDgFIABAAIAJgGIANgIQAMgIAGgCIAUgLQASgKAFgBIAGgCIAHgBIgHAMQgFALgHAUQgFAKgEALIgBABIgIABQgIgggUAiQgIAAgKgDIgCgBIACAFIgDgEgAARgiIgUgGQgxgOgDABIAAgBQAOgBAugUIA0gUQADAAALALQAMAMAGAJQABABAAAAQAAAAAAAAQgBAAAAABQAAAAAAAAIgHADIgGADIgHACIgQAHQgOAGgCgBIgGACIgIADIgFADg");
	this.shape_10.setTransform(43.5,24.5);

	this.shape_11 = new cjs.Shape();
	this.shape_11.graphics.f(colors['#BADDEE']).s().p("AgzgDIARgfIAWAGIAAAAIAKAEIAvAMIAAAAQgEAAgDABQgiAJgIACIgqAUIgYAPIgBAAIAUgmgABHAeIABAAIAAAAg");
	this.shape_11.setTransform(46.7,23.9);

	this.shape_12 = new cjs.Shape();
	this.shape_12.graphics.f(colors['#CDE2EC']).s().p("Ag9AvQAAgDgMgDIgOgBIgIAAIglAHIAagXQAbgWAPgEIATgNIASgMIAGgGQAHgFADgBIAAAAQgBAQACAKIAHAfQADAWAAAGIAAAAIg0ACQgJAAAAgBgABIgQIgKgDIAFgDIAIgDIAGgCQACABAOgGIAQgHIAHgCIAGgDIAHgDIgBABQgDAWgIASIgBACg");
	this.shape_12.setTransform(39.1,23.1);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_12},{t:this.shape_11},{t:this.shape_10},{t:this.shape_9},{t:this.shape_8},{t:this.shape_7},{t:this.shape_6},{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(25.8,14.8,29.8,27.2);



(lib.glassнаполовинуполный2 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// лед
	this.instance_1 = new lib.icrystal();
	this.instance_1.parent = this;
	this.instance_1.setTransform(30.2,96,0.731,0.731,-56.2,0,0,40.6,28.8);

	this.instance_2 = new lib.icrystal();
	this.instance_2.parent = this;
	this.instance_2.setTransform(162.7,125,1,1,0,0,0,40.6,28.9);

	this.instance_3 = new lib.icrystal();
	this.instance_3.parent = this;
	this.instance_3.setTransform(124.3,108,0.78,0.78,130.3,0,0,40.6,28.8);

	this.instance_4 = new lib.icrystal();
	this.instance_4.parent = this;
	this.instance_4.setTransform(127.3,120,1,1,0,0,0,40.6,28.9);

	this.instance_5 = new lib.icrystal();
	this.instance_5.parent = this;
	this.instance_5.setTransform(105.8,130.5,1,1,0,0,0,40.6,28.9);

	this.instance_6 = new lib.icrystal();
	this.instance_6.parent = this;
	this.instance_6.setTransform(89.8,118.7,1,1,0,0,0,40.6,28.9);

	this.instance_7 = new lib.icrystal();
	this.instance_7.parent = this;
	this.instance_7.setTransform(49,108,1,1,0,0,0,40.6,28.9);

	this.instance_8 = new lib.icrystal();
	this.instance_8.parent = this;
	this.instance_8.setTransform(51.7,125.7,1,1,0,0,0,40.6,28.9);

	this.instance_9 = new lib.icrystal();
	this.instance_9.parent = this;
	this.instance_9.setTransform(65.8,116.5,0.77,0.77,0,0,0,40.6,28.9);

	this.instance_10 = new lib.icrystal();
	this.instance_10.parent = this;
	this.instance_10.setTransform(20.6,115,1,1,58.5,0,0,40.6,28.9);

	this.instance_11 = new lib.icrystal();
	this.instance_11.parent = this;
	this.instance_11.setTransform(16.9,131.2,1,1,0,0,0,40.6,28.9);

	this.instance_12 = new lib.icrystal();
	this.instance_12.parent = this;
	this.instance_12.setTransform(30.7,123.2,1,1,0,0,0,40.6,28.9);

	this.instance_13 = new lib.icrystal();
	this.instance_13.parent = this;
	this.instance_13.setTransform(50.3,132.2,1,1,0,0,0,40.6,28.9);

	this.instance_14 = new lib.icrystal();
	this.instance_14.parent = this;
	this.instance_14.setTransform(73.4,133,1,1,57.5,0,0,40.6,28.9);

	this.instance_15 = new lib.icrystal();
	this.instance_15.parent = this;
	this.instance_15.setTransform(102.4,137.2,1,1,-35.7,0,0,40.6,28.9);

	this.instance_16 = new lib.icrystal();
	this.instance_16.parent = this;
	this.instance_16.setTransform(139.5,133.2,1,1,175,0,0,40.6,29.2);

	this.instance_17 = new lib.icrystal();
	this.instance_17.parent = this;
	this.instance_17.setTransform(155.3,150.2,1,1,0,0,0,40.6,28.9);

	this.instance_18 = new lib.icrystal();
	this.instance_18.parent = this;
	this.instance_18.setTransform(144.2,140,1,1,0,0,0,40.6,28.9);

	this.instance_19 = new lib.icrystal();
	this.instance_19.parent = this;
	this.instance_19.setTransform(121.3,154.8,1,1,-140.3,0,0,40.6,28.9);

	this.instance_20 = new lib.icrystal();
	this.instance_20.parent = this;
	this.instance_20.setTransform(118.5,140.2,1,1,0,0,0,40.6,28.9);

	this.instance_21 = new lib.icrystal();
	this.instance_21.parent = this;
	this.instance_21.setTransform(69.1,138.5,1,1,0,0,0,40.6,28.9);

	this.instance_22 = new lib.icrystal();
	this.instance_22.parent = this;
	this.instance_22.setTransform(90,140.7,1,1,0,0,0,40.6,28.9);

	this.instance_23 = new lib.icrystal();
	this.instance_23.parent = this;
	this.instance_23.setTransform(93.6,156.8,1,1,0,0,0,40.6,28.9);

	this.instance_24 = new lib.icrystal();
	this.instance_24.parent = this;
	this.instance_24.setTransform(68.8,155.7,1,1,20.5,0,0,40.6,28.9);

	this.instance_25 = new lib.icrystal();
	this.instance_25.parent = this;
	this.instance_25.setTransform(40.8,151.1,1,1,-169.3,0,0,40.6,28.9);

	this.instance_26 = new lib.icrystal();
	this.instance_26.parent = this;
	this.instance_26.setTransform(29.8,142.2,1,1,0,0,0,40.6,28.9);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_26},{t:this.instance_25},{t:this.instance_24},{t:this.instance_23},{t:this.instance_22},{t:this.instance_21},{t:this.instance_20},{t:this.instance_19},{t:this.instance_18},{t:this.instance_17},{t:this.instance_16},{t:this.instance_15},{t:this.instance_14},{t:this.instance_13},{t:this.instance_12},{t:this.instance_11},{t:this.instance_10},{t:this.instance_9},{t:this.instance_8},{t:this.instance_7},{t:this.instance_6},{t:this.instance_5},{t:this.instance_4},{t:this.instance_3},{t:this.instance_2},{t:this.instance_1}]}).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,-44.6,180.3,234.5);



(lib.glasscrystals = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});
	
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
		'#ABDEF5': prepareColor([0, 0, 0, 0]),
		'#B8DBEC': prepareColor([-13, 3, 9, 0]),
		'#B9DFF0': prepareColor([-14, -1, 5, 0]),
		'#A2D6EE': prepareColor([9, 8, 7, 0]),
		'#C4E4F3': prepareColor([-25, -6, 2, 0]),
		'#A1CADE': prepareColor([10, 20, 23, 0]),
		'#B3DAEC': prepareColor([-8, 4, 9, 0]),
		'#A2C4D4': prepareColor([9, 26, 33, 0]),
		'#A5D3E7': prepareColor([6, 11, 14, 0]),
		'#B0D5E5': prepareColor([-5, 9, 16, 0]),
		'#CBE6F3': prepareColor([-32, -8, 2, 0]),
		'#BADDEE': prepareColor([-15, 1, 7, 0]),
		'#CDE2EC': prepareColor([-34, -4, 9, 0]),
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
	_tempDiff('#ABDEF5', '#A2D6EE');
	*/

	// лед
	this.shape = new cjs.Shape();
	this.shape.graphics.f(colors['#B8DBEC']).s().p("AgRCXIgDgGIAAgDQgBgBAAAAQAAAAAAgBQgBAAAAAAQAAgBAAAAQgGgLgBgHQgBgIgGgLQgDgHgThJQAAAAAAAAQgBAAAAAAQAAAAgBAAQAAAAAAAAIAAAAIAAgCIAAgCIgBgDIgEgPIACADQADAGAEAFQAthOAbgkQAbgiAUgcIADAEQgFAKgEAUQgEAagJAbQgEARgQAeIgHAWIgIAYIAIgNIADgEIgUBKQgHAmgDAwIAAABIgDABQgBgGgDgGg");
	this.shape.setTransform(43,30.2);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f(colors['#A2D6EE']).s().p("AiVBPIAVhKIgCAEIgIANIAIgYIAGgVQARgfAEgQQAIgbAFgbQADgUAGgKIgDgEQgUAcgbAjQgdAjgtBPQgEgGgDgGQgDgJgFgKIgJgdQgBgWgLhTIBigSQALgBAMABQAWABAQADQAgAGACAJQAAAHCigLQAEgBACABIACAAIAEgBIBzgHIgTAEQgPADgxAbQgyAbgEABQgQACgiAXQgUALgOAKIgXANIgBABQgSAXgRAUIgFAEIgFAKIAAAAIAAAAIgPATQgTAWgGALQgDABABADQgtA1gXAiQADgwAHgmgAjSAUIABACIAAACIgBgEg");
	this.shape_1.setTransform(57.9,29.8);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f(colors['#A1CADE']).s().p("AggAVQgMgJgJgMIgEAIIgBgCIgEgPIgFgjIAFgEIAAABQA/AZA/ArQABABAAAAQABABAAAAQABAAAAAAQAAAAAAAAIgBACIgCAAIgFgBQgiAZgXAAQgXAAgLgcg");
	this.shape_2.setTransform(102.3,25.6);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f(colors['#C4E4F3']).s().p("Ah7CnIAAgEIgIgTQgHgLgBgFQgDgQgwhVIgBgBIAAAAIgBgBQgEgGgDgIQAEADADABQAaAGAXACQA2hYAVBSIAXgCIADgFQAHgDAIAAQAdgFBGCWQAliWArgLIALgEQAAgFgCgDIADgJIARB5QADALAFAMIAFAHIAFAGQgBAEACADIhwAVQhGAQgBgKIgjABIgKAAIgRACIhNADgACbgEIAKgDIAAgCIgKAFgABhh0QgsgVgIgOIAKAAIBSgPIANBUQgKgLgrgXg");
	this.shape_3.setTransform(80.4,28.7);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f(colors['#ABDEF5']).s().p("AkvDgIAAgCQAXgiAug1QgCgEAEgBQAGgKATgWIAOgTIAAAAIACgBIAEgJIAEgEQASgWARgXIAIALIAVAdIAIALIABABIAAAAIAAABIABAAQAwBVADAQQABAGAHAKIAIAUIAAADQgdACgjAAQibAJgmAAIgEAAgAA0A1QgIAAgHADQALgaAMgaQAVgwATgeIASgdIgUACIhxAIIgBgDIACgBIACgBIBAgnQAHgBBrgxQAbgLBdgWQAJgDAJAAIgTAlQgNAUgHADIgBgCIgBACQgGACgNATQgNAUgLACIgCAAIhSAQIgKgBQAIAOAsAVQArAXAKALIABADIAAACIAAACIAEAhIAFARIABACQACAEABAEIgMAEQgrANgkCWQhHiWgfAFgAD2AjIAAADIgKACIAKgFg");
	this.shape_4.setTransform(72.3,24.1);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f(colors['#B3DAEC']).s().p("AAoA+IABgBQAAAAgBAAQAAAAAAAAQgBgBAAAAQgBgBgBAAQg9guhBgWIAAgBIACgCQABAAABAAQAAAAABAAQAAgBAAAAQABAAAAgBIAUgPQAWgNAIgBIARgHQAMgIAEAAIAQgJQADgBAegUIACABQgDARgDAmQgFA1ABAWQgCABACAIIACAFIgBACIACAFIgVAZIARgbgABDAWQgBgGAKgCQAGAAAFAPIAAACIADAFIAAAAIgIACIgMABIgHAGIgSAKIAWghg");
	this.shape_5.setTransform(105,21.8);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f(colors['#A2C4D4']).s().p("AgtCmIgFgHIgFgHQgGgMgCgLIgSh7QAKANALAJQAXA2BFgzIAEABIADAAIgRAaIAVgZIgCgEIABgCIgCgFQgCgJACAAQAAgUAEg3QADgmADgRIAAgCIAAgBIgCACQgeAUgDABIgQAJQgDAAgMAHIgRAHQgJACgWANIgUAPQAAAAAAAAQgBABAAAAQgBAAAAAAQgBABgBAAIgBABIgFgBQgDgSAQgtQASg8ABgGIABAAQAQAEANAAQAVADA7AcQABAFADAEQgBADAAADIACAAQALAqATA2IAFAXIAHgGIgHAIQgBADACADIgDgGIAAAAQgFgPgGABQgJACAAAFIgVAgIARgLIAIgGIALgBQg4BCABABQAAAHgGABQgNABgKAeQgOAegHABQgIACgGAOQgDAFgBAHIgDgGg");
	this.shape_6.setTransform(105,24.9);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f(colors['#A5D3E7']).s().p("AhACSIgNhTIACAAQAKgDANgUQAOgTAGgCQgBAGgSA8QgPAtACASgAgCAXQgNABgPgFQAHgDAMgSIARglIACABIAAgCIgCABIADgFQAVgwAJg3IAEACQARBrAHAeIACANQAEAXAFAbQg9gdgTgDg");
	this.shape_7.setTransform(102,5.7);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f(colors['#BADDEE']).s().p("AiOgKQAmhEAIgMIA7AQIACABIAbAIICCAgIAAAAQgIAAgKADQhcAXgZAIQhsAxgGACIhCAmIgCAAQAIgSAthSgADCBOIACAAIAAABg");
	this.shape_8.setTransform(90.4,5.1);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f(colors['#CBE6F3']).s().p("AjMDVIAAgBIAAABgAjWDIIgVgdIgIgLIABgBIAagOQAOgJAUgLQAigXAQgDQAEgBAygbQAxgaAPgDIARgFIAUgCIgSAdQgRAegVAyQgMAagKAaIgDAFIgXACQgWhTg1BZQgXgCgbgGQgDgBgDgCQADAIAEAFIgJgLgAAvh9Ig4gPQiGglgIACIABgBQBbgHAzgIICDgVQARAABoANIgBADIgSAJIgRAIIgSAGQgJACglAOQgmAQgEgBIgQAFQgLACgLAGIgOAFg");
	this.shape_9.setTransform(81.7,10.1);

	this.shape_10 = new cjs.Shape();
	this.shape_10.graphics.f(colors['#B0D5E5']).s().p("AgiBvQABgOgQg4QgQhBgDgTQgEgaADgnIAAgCQAIgCCEAmQgIALgnBCQgqBUgJATIAAAAIgCACQgCAAgCADg");
	this.shape_10.setTransform(73.5,3.5);

	this.shape_11 = new cjs.Shape();
	this.shape_11.graphics.f(colors['#CDE2EC']).s().p("AioB7QgBgKghgGQgQgDgWgBQgLgBgLABIhiATQAMgNA5gtQBJg5ApgPQAEgBAvgfQAtgcAFgCQgBgBARgOQASgOAIgEIABACQgCAnAEAaQADATAQBBQAOA4gCAOQAAgBgEABQhoAHgmAAQgWAAAAgCgADDgrIgbgIIABAAIANgGQAMgGAKgCIARgFQAEABAmgQQAkgOAJgCIASgFIASgJIARgJIgBAFQgJA4gVAvIgDAFg");
	this.shape_11.setTransform(69.9,2.8);

	this.shape_12 = new cjs.Shape();
	this.shape_12.graphics.f("#B9DFF0").s().p("AikBiQAGgEgDgBIgBgBQADABACgJQADgNAIgCQAOgCAGgSQAIgWABABQAHgCgBgFQAAgHAIgBQAMgCAHgRQAIgVAGgBQARgCAdg8IAGgBIgBgMIAPgCIBugEIA6gDIABAAIgBABQgIAEgSANQgRAPAAABQgFABgtAcQgvAfgDACQgoAQhIA4Qg6AsgMANIgDgPg");
	this.shape_12.setTransform(49.9,3.7);

	this.shape_13 = new cjs.Shape();
	this.shape_13.graphics.f(colors['#B3DAEC']).s().p("AghBFIABAAQAAgEgCgDIAAgJIgGgHIgJgQQAbAVADABQAFACACAHQAAAFgNABQAAAAAAABQAAAAgBAAQAAAAAAAAQgBAAAAAAQgBAAAAAAQgBAAgBAAQAAAAgBAAQAAABgBAAIAAAAgAAdAsIhDgQQAAgCgIAAIgEABIgCAAIgEABIgWgWIAWASIACACIACgDQAqgqAUgxQABAAAAAAQAAAAABAAQAAAAAAABQAAAAAAAAIACAEIANASQAMAVABAHIAHAPQAGAJgBADIAIAPIATAfIgBABIgxgNg");
	this.shape_13.setTransform(150.1,76);

	this.shape_14 = new cjs.Shape();
	this.shape_14.graphics.f(colors['#A1CADE']).s().p("AgXAxIAAgDIACgDQgthAAxgJQAIgIAJgGIgGgEIADgBQAFgBAHABIAhABIABAAIAAAAIgBABIgBAAIgBAAIABAAQAAAAAAAAQABAAAAABQAAAAABABQAAABAAAAQgWAwgoAsIgCADIgCgCg");
	this.shape_14.setTransform(146.8,73.6);

	this.shape_15 = new cjs.Shape();
	this.shape_15.graphics.f(colors['#C4E4F3']).s().p("Ah4CZQgDgRgQhNQgNg7AJAAIgBgdIAAgIIAAgOIgDg/IAAgBIADAAIASgEQAIgDAFAAQAPAABNgZIABgBIAMgFIgCAHQgGAUgCASQBNA5hJAFIACASIAFADQACAHAAAGQAEAZiHAiQCGA1AJAmIADAKQAFAAADgBIAIAEIhsgGQgKAAgLADQgCACgDABIgHACQgDgBgCABgAAFCUIADAAIgFgIIACAIgABICUQALgHAVgfQATghALgFIABAJIANBFIhMgCg");
	this.shape_15.setTransform(144.2,53.9);

	this.shape_16 = new cjs.Shape();
	this.shape_16.graphics.f(colors['#A2D6EE']).s().p("ACHC5QgDgMgYgtIgYgwQgCgOgUggIgTgfIgLgVIgBAAQgVgSgRgSIgEgFIgHgFIgBAAQAAAAAAgBQAAAAAAAAQAAAAgBAAQAAAAAAABQgHgGgIgJQgVgUgJgGQAAAAAAgBQgBAAAAgBQgBAAAAAAQgBAAgBAAQgvgugfgYQArAKAjALIBCAfIgEgDIgLgIQAMAEAJAGIATAJQAbARAPAGQAXAMAYAIQASAGAJAHIAAAAIAAgBQABgBABAAQAAAAABAAQAAgBABAAQAAAAAAABQgagWgegbQgggdhFgzIALgEIARgCIAagDQATADBKAEIAQBTIgBATQgBARgDANQgFAagJAAQgGgBAJCFIABAFIgBAAIABAGIAFBfQgDgLAAgGgAgUjEIAFAAIgEABg");
	this.shape_16.setTransform(143.5,38.6);

	this.shape_17 = new cjs.Shape();
	this.shape_17.graphics.f(colors['#B8DBEC']).s().p("ABzA2QgYgIgYgLQgOgHgbgRIgUgJQgIgEgMgEIALAGIADADIhCgcQgigLgrgKIgBgBIgBgDQAGABAFgCIAFgBQAAAAABAAQAAAAABAAQAAAAAAAAQABAAAAAAIADAAQAKgDAGgBQAHAAALgDQAGgBBBgDIAAgDIAAAAIABAAIACACIADgCIAMAAIgBABIgKAEQBFAyAgAcQAeAbAaAVQgBAAAAAAQAAAAgBAAQAAAAgBABQAAAAgBAAIgBABQgIgHgSgGg");
	this.shape_17.setTransform(143.2,25.6);

	this.shape_18 = new cjs.Shape();
	this.shape_18.graphics.f(colors['#A5D3E7']).s().p("AAHBBIgLAAQgVgCgXACQAZguADgRQAAgJAEgLQADAGAQAMIAfAUIAAADIACgBIAAgCIAFAEQApAYAxARIAAADIh8gDgAhKguQgpgUgPAAIAAgBIBMADIAAACQACAJASAOQARAOABAGIg6gbg");
	this.shape_18.setTransform(164.6,75.5);

	this.shape_19 = new cjs.Shape();
	this.shape_19.graphics.f(colors['#A2C4D4']).s().p("AAABEQgDgBgCABQAAAAABAAQAAAAABAAQAAAAABAAQABAAAAAAQABAAAAAAQAAAAAAgBQAAAAAAAAQAAAAAAAAQAMgBABgGQgCgHgFgBQgEgCgZgVIAKARIAFAHIABAJQg6g4gBAAQgGAAgBgGQgCgJgagPQgagPgBgHQgBgGgNgIIgLgFIAGgCIAGgCQAEgBACgCQALgDAJAAIBvAGQgMAGgIAHQgwAKAsBAIgBADIAAACIgXgSIAWAWIAEgBIACABIAEgBQAIgBAAACIBDAQIAyAOIABAAIACABIgCgDIgUgfIgHgOQAAgDgGgKIgHgPQgBgHgMgUIgMgTIgCgDQAAgBgBAAQAAAAAAAAQAAgBgBAAQAAAAAAAAIACgDQAPAAApAUIA7AbIAAABQgEALAAALQgEAPgZAuIgIABIgFgCIAAAAIAAACQgmADgxAHIgUgBIAFAHIgGgIg");
	this.shape_19.setTransform(147.4,76.1);

	this.shape_20 = new cjs.Shape();
	this.shape_20.graphics.f(colors['#ABDEF5']).s().p("AClEHQgSgOgCgGIABgBIgBAAQgCgGgRgOQgSgOgCgIIABgCIgNhFIgBgJQgMAEgTAhQgVAfgLAHIgCAAIAAgBIgBAAIgggBQgGgBgIABIgDABQgCABgFAAIgEgKQgKgmiGg1QCGghgEgcQAAgGgCgGIAvAbQApAaAbAUIAaATIgCgQIgFhgIACABIABABIAAABIAjA9QABAFAqBgQAKAYAUBPQABAIAAAGIgggUgAgiDDIgCgIIAEAIIgCAAgAi9hDIgBg2QgGiGABgbIAAAAQAfAYAvAtQABAAAAABQABAAABAAQAAAAAAABQABAAAAABQAJAGAVATQAIAJAHAGIACACIAHAEIAEAFQATASAVASQgFABgFADIgaAMIgMAGIABABQhNAZgQAAQgEAAgIAEIgTAEg");
	this.shape_20.setTransform(148.3,49.1);

	this.shape_21 = new cjs.Shape();
	this.shape_21.graphics.f(colors['#BADDEE']).s().p("AhIChIABgCIAAACgAAbB2QAAgGgBgIQgUhPgIgYQgqheAAgGIgjg8IABgBQAQAKBIAyQA9ApAKAJIgPAuIgBABIgIAUIgcBmg");
	this.shape_21.setTransform(165.3,65.7);

	this.shape_22 = new cjs.Shape();
	this.shape_22.graphics.f(colors['#CBE6F3']).s().p("ACtDjQgBgGgHgKIgGgQIgFgPQgCgJgNgfQgNgiABgDIgFgNQgBgKgFgKIgFgMIAAgCIAPguQAihlgCgHIABAAQAFBNAHApIASBvQgBAOgMBTIgDgBgAg5gHQgbgVgrgZIgvgcIgEgDIgCgSQBLgFhQg5QACgSAHgUIABgHIgLAFIgBABIAAgBIALgGIAagMQAFgDAFgCIABAAIALAYIATAeQAUAgADAOIAYAxQAXAtADALQABAHADALIABAOIgagRg");
	this.shape_22.setTransform(160.8,59.5);

	this.shape_23 = new cjs.Shape();
	this.shape_23.graphics.f(colors['#B0D5E5']).s().p("AgDAKQhKgxgQgJIgBgBIgBgBIgDgFIAAgBQAMADAygDQA7gDAQABQAXABAjAIIACABQACAGgjBmQgKgJg7gpg");
	this.shape_23.setTransform(166.8,54.5);

	this.shape_24 = new cjs.Shape();
	this.shape_24.graphics.f(colors['#CDE2EC']).s().p("ABpE5QgxgQgqgZIgFgDIAdhmIAIgVIABAAIAEAMQAGAKABAKIAEAOQAAACANAiQANAgACAIIAFAPIAGAQQAGAKACAGIgEgCgAAjgUQgRAAg6ACQgyAEgMgDIgBgFQgJiHAGAAQAJAAAFgZQADgNABgRIABgTIgQhTQAMAMAnA3QAyBDANAmIAdAuQAYApABAEIAOAQQANARADAHIgDABQgjgJgWgBg");
	this.shape_24.setTransform(167.2,50.6);

	this.shape_25 = new cjs.Shape();
	this.shape_25.graphics.f("#B9DFF0").s().p("ABjCXIgBAAIABgBQgCgHgOgRIgOgQQAAgEgZgpIgdguQgPgkgwhDQgng3gMgMIAOABQADAFABgEIABABQAAACAHACQAMAGACAHQABAKARAJQASAKABABQABAFAEABQAGABABAHQACAJAPAKQATAJAAAGQACANA1AiIACAFIAKABQABAAABALIABBbQACAaACAYg");
	this.shape_25.setTransform(166.8,34.3);

	this.shape_26 = new cjs.Shape();
	this.shape_26.graphics.f(colors['#A1CADE']).s().p("AgdAUQgKgIgLgMIgBAKIgCgDQgEgHgBgHIgHgiIAAgBIABABIABACQAAgBAAAAQAAgBAAAAQABAAAAgBQABAAABgBIAAABQA9ATA+AmIACACIAAACQgBgBAAAAQgBAAAAAAQAAABAAAAQgBAAAAAAIgEgBQghAagXAAQgTAAgMgYg");
	this.shape_26.setTransform(139.8,62);

	this.shape_27 = new cjs.Shape();
	this.shape_27.graphics.f(colors['#B3DAEC']).s().p("AAoA7IABgCIgDgBQg8gog/gSIABgCIAEgCIASgPQAVgOAIgCIAPgIQALgHAEAAIANgJQADgBAbgVIACAAIgCA1IAABHQgCABACAHIACAEIABADIABAEIgTAYIAPgZgAA/ATQAAgFAIgDQAGAAAFANIACADIACAEIAAABIgBAAIgHABIgKACIgHAGIgQALIASghg");
	this.shape_27.setTransform(142.2,58);

	this.shape_28 = new cjs.Shape();
	this.shape_28.graphics.f(colors['#B8DBEC']).s().p("AgECRIgCgFIgBgDQgBAAAAgBQAAAAAAgBQgBAAAAAAQAAgBAAAAQgGgKgBgGQgCgIgGgLQgEgGgVhDIgCAAIAAAAIgBgCIABgBIgCgEIgEgOIACADIAHAKQAmhMAYgjQAYghARgdIADAEIAAAAQgFAKgCATQgCAZgIAaQgDAQgNAdIgGAVIgFAWIAHgMIACgDIgRBGQgEAlAAAuIgBAAIgBABQAAgFgEgGg");
	this.shape_28.setTransform(83.7,69.2);

	this.shape_29 = new cjs.Shape();
	this.shape_29.graphics.f(colors['#C4E4F3']).s().p("AhvCiIgJgTQgHgJgBgFQgDgPgzhOIgJgNQAeAGAYAAQAthUAaBLIAVgCIACgGQAHgDAHAAQAdgHBICKQAbiOAogOIALgEIgDgHIACgKIAXBxQACALAHALIAFAGQACACACAEQAAADACADIhoAaQhBASgCgJIggADIgLABIgPACIhIAHIgBAAgACOgNIAJgCIAAgCIgJAEgABRhyQgrgRgIgMIAKgCIBMgTIARBQQgKgLgqgTg");
	this.shape_29.setTransform(119.7,66);

	this.shape_30 = new cjs.Shape();
	this.shape_30.graphics.f(colors['#A2D6EE']).s().p("AiBBRIARhGIgCADIgGAMIAFgYIAGgTQAMgdAEgQQAHgaACgZQADgTAFgKIAAAAIgBAAIgDgEQgRAdgYAhQgZAjgnBMIgHgKQgDgKgFgIIgKgbQgCgUgOhNIBbgXQAKgBALAAQAVAAAPACQAeADADAJQABAGCXgTIAGgBIABABIAFgCIBsgNQgLAFgHABQgOADgtAcQgtAcgFABQgPADgfAXQgkAbgRAKIgBAAQgNAXgQATIgIANIAAABQAAAAAAAAQAAAAAAAAQAAAAAAAAQAAABAAAAIgNARQgQAXgGAJQAAABgBAAQAAABAAAAQgBABAAAAQAAABAAABQgnA1gTAiQAAguADglgAi9AcIACAEIgBABIgBgFgAggARIgDAEIgBAAg");
	this.shape_30.setTransform(97.4,68.3);

	this.shape_31 = new cjs.Shape();
	this.shape_31.graphics.f(colors['#B0D5E5']).s().p("AgWBnQAAgNgRgzQgTg9gEgSQgFgXABgmIAAgBQAHgCB+AbQgHALggBCIgrBiIAAABIgBABIgFAEg");
	this.shape_31.setTransform(111,42.9);

	this.shape_32 = new cjs.Shape();
	this.shape_32.graphics.f("#B9DFF0").s().p("AiUBlQAEgEgDgBIgBgBQADABABgJQADgMAIgCQAMgDAFgSQAGgUABAAQAHgBgBgGQgBgFAIgDQAKgBAHgSQAFgTAGgBQAQgDAYg7IAGgBIgCgLIAOgDIBngJIA4gHIAAABIAAAAIgBAAQgIADgPAPIgQAQQgEABgpAeIgtAgQglARhBA5Qg0AugKANIgDgPg");
	this.shape_32.setTransform(89.3,44.1);

	this.shape_33 = new cjs.Shape();
	this.shape_33.graphics.f(colors['#A2C4D4']).s().p("AghCdQgCgFgDgBIgEgHQgHgLgCgKIgXh0QAKAMALAIQAXAxA/gzIAEABQABAAAAAAQAAAAAAAAQABAAAAAAQAAAAABAAIgPAZIATgYIgCgEIAAgDIgCgEQgCgHABgBIAAhHIADg1IgBgBIABgCIACgBQAOAnAVAzIAFAVIAHgGIgHAJIABAGIgCgFIgBgDQgGgNgFABQgIACAAAGIgSAfIAQgMIAHgFIAKgCQgxBBABACQAAAFgFABQgNADgKAdQgIAcgIACQgHACgFAOQgDAFgBAGIgDgFgAhZgkQgEgRAMgtIAPg/IABAAQAOAEANgBQAUADA6AWIADAIQAAABAAABQgBAAAAABQAAAAAAABQAAAAAAABIAAABIgDADQgaAVgEABIgNAIQgDAAgMAIIgPAIQgIABgUAPIgSAPIgEACIgBABIgEAAg");
	this.shape_33.setTransform(142.2,61.3);

	this.shape_34 = new cjs.Shape();
	this.shape_34.graphics.f(colors['#A5D3E7']).s().p("Ag4CNIgRhPIADgBQAJgCAMgUQALgSAGgDIgPA/QgLAsAEARgAgEAVQgMABgPgEQAHgCAKgSIAOgjIADAAIgBgCIgCABIACgGQASguAGgzIADAAIAeCBIADAMQAFAWAHAYQg8gXgSgCg");
	this.shape_34.setTransform(138.8,43.2);

	this.shape_35 = new cjs.Shape();
	this.shape_35.graphics.f(colors['#ABDEF5']).s().p("AkQDiQATgiAng1QAAgBAAAAQAAgBABgBQAAAAAAgBQABAAAAgBQAGgJAQgXIANgRIABgCIA7gHIASgCIAAAAQAzBPADAPQABAFAHAIIAJATIABADIg9AFQiZARggACgAA0AvQgHABgHADIATgzQARguAQgdIAQgdIgTAEIhqAMIAAgBIACgCIA6gpQAHgBBjg0QAZgMBVgbQAJgCAIAAIgQAjQgKAUgHACIgBgBIAAABQgGADgLASQgMAUgJADIgDAAIhMASIgKACQAIAMArARQAqATAKAMIABADIAHAjQABAHAEAGIABADIADAIIgLADQgoAPgbCQQhJiKgeAGgADqATIAAADIgJACIAJgFg");
	this.shape_35.setTransform(111.4,62.1);

	this.shape_36 = new cjs.Shape();
	this.shape_36.graphics.f(colors['#BADDEE']).s().p("Ai4BXIAthhQAghCAHgLIA4ALIADABIAaAHIB7AWIAAABQgHABgJACQhVAbgXAMQhjAxgHACIg8AogAC2A3IACgBIABACg");
	this.shape_36.setTransform(127.9,44);

	this.shape_37 = new cjs.Shape();
	this.shape_37.graphics.f(colors['#CDE2EC']).s().p("AkPBNQBBg6AngSIAtgfQApgdAEgBIAQgQQAQgPAHgDIACACQgBAlAFAYQAEASATA8QAPA0AAANIgFABQiXATgCgGQgCgKgfgDQgPgCgVABQgKgBgLABIhbAYQAKgOA0gtgAC2gyIgagGIAAgBIAMgGQALgFALgCIAPgGQADAAAjgRQAhgQAJgCIAQgGIAQgIIARgKIgBAFQgGA0gRAuIgDAFg");
	this.shape_37.setTransform(108,42.1);

	this.shape_38 = new cjs.Shape();
	this.shape_38.graphics.f(colors['#CBE6F3']).s().p("Ai0DRIgKgLIgUgaIgJgKIABgBQARgKAkgaQAfgXAPgDQAFgCAtgbQAtgdAOgDQAHgBAJgEIATgEIgQAdQgOAdgRAwIgTAzIgCAFIgVADQgahOgtBXQgYAAgegGIAJAMgAAnh6Ig2gLQiBgcgHACIAAAAIAAgBQBXgLAvgKIB6gbQAQgBBjAHIgBACIgQAKIgQAIIgQAGQgJACgiAQQgjARgDAAIgPAGQgKACgLAFIgMAGg");
	this.shape_38.setTransform(119.5,48.6);

	this.shape_39 = new cjs.Shape();
	this.shape_39.graphics.f(colors['#B8DBEC']).s().p("Ag3CFIgCgGIAAgDQAAAAAAgBQgBAAAAgBQAAAAAAgBQABAAAAAAQgEgLAAgHQAAgIgEgLQgCgHgEhHIgDAAIABAAQAAgBAAAAQAAAAAAAAQAAgBAAAAQAAAAgBAAIACgBIgCgDIAAgPIABAFIAFAKQA3hCAggbQAfgcAXgXIACAFQgHAIgGASQgJAYgNAYQgHAOgTAZIgLATQgEAIgFANIAIgKIACgEIgfBBQgMAjgLAsIgBAAIgDABQABgGgCgGg");
	this.shape_39.setTransform(99.5,20.9);

	this.shape_40 = new cjs.Shape();
	this.shape_40.graphics.f(colors['#A2D6EE']).s().p("AivBJIAhhAIgCADIgKAKQAFgNAGgJIAKgRQAUgaAHgOQAMgYAJgYQAHgSAHgIIgCgFQgYAYgeAbQgiAcg3BBIgFgKQAAgLgDgKIgEgdQADgUAEhOIBfgBIAUAEQAVAFAOAFQAdALgBAJQAAAGCYASQAEAAACABIABAAIAEAAIBtANQgMACgHgBQgOAAgzARQgzAQgEAAQgPAAgkAPIgiAOIgYAIIgBABIgpAhIgEAEIgGAHIAAABIgBAAIgRAOQgVASgHAIQgDABgBADQgyAqgbAcQAKgsANgjgAjeAHIABAEIgBABIAAgFg");
	this.shape_40.setTransform(114.3,20.1);

	this.shape_41 = new cjs.Shape();
	this.shape_41.graphics.f(colors['#C4E4F3']).s().p("AABCLIghgFIgKgCIgPgBIhIgLIgBAAIAAgDIgEgUQgFgKAAgFQABgQgfhWIAAAAQgEgHgBgIIAGAEQAXAKAVAGQBBhKAGBSQAKAAALACIAEgFQAGgBAIABQAcABAnCVQA8iFAqgEIAMgCQAAgDgBgDIAEgIIgFBzQAAALAEAMQACADABAEIADAHQgBADABADIhrABIgaAAQgqAAABgHgACdAIIAKgBIAAgDIgKAEgAB6hpQglgagFgOIAKABIBOAAIgCBRQgIgMgkgeg");
	this.shape_41.setTransform(131.8,26.9);

	this.shape_42 = new cjs.Shape();
	this.shape_42.graphics.f(colors['#A1CADE']).s().p("AgjASQgIgKgHgLIgEAGIgBgDQgCgGABgIIABgjIAAgBIABACIAAABIAEgDIAAABQA2AiAzAzIACADIgBABIgDAAIgDgCQgeANgTAAQgdAAgHghg");
	this.shape_42.setTransform(154.1,25.9);

	this.shape_43 = new cjs.Shape();
	this.shape_43.graphics.f(colors['#ABDEF5']).s().p("AAnAgQgHgBgHABIAegrQAcgqAWgZIAXgYIgTgBIhtgNIAAgCIAEgCIBEgZQAGAABtgaQAbgGBZgFQAKgBAHACIgYAfQgOAQgHABIgBgBIAAABQgIABgPAPQgPARgKAAIgDgBIhOABIgKgCQAFAOAlAbQAkAdAJAMIgBADIAAACIgBAhQgBAHACAJIABADQABADgBAFIgLABQgrAEg8CGQgmiXgfgBgAiHCbQiagUgegGIABgBQAbgcAygqQABgDADgBQAHgJAVgRIARgOIABgBIAAAAIAGgIIAEgDIApgiIAFAMIAPAcIAGAOIABAAQAeBYAAAPQAAAFAEAKIAFAVIAAADIg9gJgADeAwIAAADIgKAAIAKgDg");
	this.shape_43.setTransform(126.3,22.5);

	this.shape_44 = new cjs.Shape();
	this.shape_44.graphics.f(colors['#B3DAEC']).s().p("AAcA7IABgBIgCgDQgxg1g4ggIAAgBIACgBIAEgBIAVgKQAWgJAJAAIARgEQAKgEAEAAIARgFQAEAAAegOIACABQgFAQgKAiIgRBFQgBAAgBAJIABAEIAAACIABAFIgYATIAUgVgAA8AaQABgFAJgBQAFABACAPQABAAAAAAQAAAAAAABQAAAAAAAAQAAAAAAABIABAFIAAAAIgHAAIgLgBIgIAFIgSAGQAXgYACgDg");
	this.shape_44.setTransform(156.9,24);

	this.shape_45 = new cjs.Shape();
	this.shape_45.graphics.f(colors['#A2C4D4']).s().p("AhLCbIgDgHQgBgEgCgDQgEgMAAgLIAFh1QAHANAJAKQALA3BJgkIAEADIACAAIgUAVIAYgTIgBgFIABgCIgBgFQAAgIABAAIAShFQAJgjAGgPIAAgBIABgDIgEADQgeAOgEAAIgRAFQgDgBgLAFIgRAEQgIgBgXAKIgVAKIgEABIgBABIgEgCQAAgRAWgoIAdg6IACAAQANAIAMABQARAHA1AlQAAAFABAEIgCAEIACAAQADAqAJA1IAAAVIAIgFIgJAIQgBADABADIgBgFQAAgBAAAAQAAAAAAgBQAAAAAAAAQAAAAAAAAQgCgQgGAAQgJAAgBAGQgCADgXAYIASgGIAIgFIALABQg/A0AAABQgBAFgGABQgLgBgQAaQgRAZgHAAQgIAAgIAMQgEAFgCAFIgCgGg");
	this.shape_45.setTransform(157,25.3);

	this.shape_46 = new cjs.Shape();
	this.shape_46.graphics.f(colors['#A5D3E7']).s().p("AhKB/IABhRIADAAQAKABAPgRQAPgPAIgBIgeA5QgWApAAAQgAACAXQgKgCgNgHQAHgBAOgOIAWgfIADAAIgBgBIgCAAIAEgEQAcgpARgxIAFACQgDBmABAcIAAAOQgBAWABAZQg0gkgUgHg");
	this.shape_46.setTransform(156.1,7.7);

	this.shape_47 = new cjs.Shape();
	this.shape_47.graphics.f(colors['#BADDEE']).s().p("AC1BnIACAAIAAABgAi3AvIBEhUQAvg5AKgJIA0AYIACACIAWANIBzA0IAAABQgGgCgKAAQhaAGgaAFQhrAYgGABIhFAZg");
	this.shape_47.setTransform(145,5.6);

	this.shape_48 = new cjs.Shape();
	this.shape_48.graphics.f(colors['#B0D5E5']).s().p("Ag+BpQAEgMgFg3QgEg/ABgSQABgYAJgkIAAgCQAIgBB0A6QgKAJgvA3IhBBWIAAAAIgCACQgCAAgDACg");
	this.shape_48.setTransform(132.1,0.1);

	this.shape_49 = new cjs.Shape();
	this.shape_49.graphics.f(colors['#CBE6F3']).s().p("AhyC2QgGhShABKQgVgGgYgKIgGgEQACAIADAGIABABIgBAAIgGgOIgPgdIgFgNIABAAIAagJIAigNQAkgPAQAAQAEAAAzgRQAygQAOAAQAHAAAMgBIARABIgUAYQgXAagcAqIgeAsIgDAEQgLgBgLAAgAA+hlIg0gYQh0g5gHAAIAAAAIAAgBQBXAKAuABICAAEQAPADBeAdIgBADIgSAFIgSAFIgRABQgJABgkAHQgnAIgDgBIgQACQgKgBgMAEIgNACg");
	this.shape_49.setTransform(137.9,7.8);

	this.shape_50 = new cjs.Shape();
	this.shape_50.graphics.f(colors['#CDE2EC']).s().p("AgYBpQiagSAAgFQABgKgdgLQgOgFgVgFIgUgEIhfABQAOgKA9ghQBNgmAqgIIA0gWQAugSAFgBIASgLQATgKAIgCIABACQgJAkgBAZQAAASADA/QAFA2gDANQgCgBgEAAgAC9gJIgYgNIAAAAIAOgCQAMgEAKAAIAQgCQADACAngJQAjgGAKgBIARgCIASgEIASgGQgBABAAAAQAAABAAABQAAAAgBABQAAAAgBABQgRAxgcAnIgEAEg");
	this.shape_50.setTransform(127.8,0.1);

	this.shape_51 = new cjs.Shape();
	this.shape_51.graphics.f("#B9DFF0").s().p("AiqBKQAFgDgDgBIAAgCQACACAEgIQAFgMAIAAQANABAJgRQALgSABABQAHAAAAgGQABgFAIAAQAKAAALgPQAKgSAGAAQAQACAmgzQADgBADABIAAgMIANABIBoAQIA4AHIAAAAIAAABIgCgBQgHACgUAKIgSAMQgEAAgvATIg0AVQgoAHhNAoQg9AggNAKIAAgPg");
	this.shape_51.setTransform(109.3,-4.1);

	this.shape_52 = new cjs.Shape();
	this.shape_52.graphics.f(colors['#A1CADE']).s().p("AArA7IgCgCQhQAIAFg2QgEgLgDgPIgGAHIAAgDIAEgPIANghIABgBIgBABIAAACQAAAAAAgBQABAAAAAAQABAAAAAAQABAAABAAIAAAAQApAyAfBBIACADIgCABIgDgCg");
	this.shape_52.setTransform(64.5,70.1);

	this.shape_53 = new cjs.Shape();
	this.shape_53.graphics.f(colors['#B3DAEC']).s().p("AAAA4IAAgBIAAgDQgghBgqgyIABgBIAEAAIAYgDQAZgBAHACIAPACQAOAAADABIARABQAEABAhgEIACACIgeArQgbApgLATQgCAAgCAHIgBAFIgBACIgBAFIgaAKIAagNgAAyA4IgGgCIgKgEIgIABIgUABQAegQACgCQADgFAIADQAFACgCAOIAAADIgBAFIAAAAg");
	this.shape_53.setTransform(69.3,70.6);

	this.shape_54 = new cjs.Shape();
	this.shape_54.graphics.f(colors['#A2C4D4']).s().p("AhqCMIgBgHIgBgIQAAgNAEgJIAphtQADANAEANQgFA2BQgIIACACIADABIgYAOIAbgKIABgGIABgBIABgFQACgIABABQALgTAcgpIAegrIAAgBIACgCIgEABQgiADgDAAIgRgBQgDgBgOAAIgRgCQgIgCgXABIgXADIgFAAIgBABIgCgEQAFgQAhgfIAsguIABAAQALAMALAFQAPANAnAzQgBAEAAAFIgEADIAAABIACABQgJAogJA0IgHAVIAJgCIgLAEIgCAGIABgFIAAgDQACgOgFgCQgIgDgCAFQgDACgeAQIAUgBIAIgBIAKADQhKAeAAABQgDAFgFgBQgMgFgYATQgXATgIgDQgGgCgNAJIgIAIIAAgHg");
	this.shape_54.setTransform(66.7,69.3);

	this.shape_55 = new cjs.Shape();
	this.shape_55.graphics.f(colors['#C4E4F3']).s().p("AgBB4QhBgSADgKIgfgPIgJgEIgNgHIhBggIgCgBIABgDQACgHABgOQgBgJABgEQAGgPgChdIgBgQQAWAWAVANQBTgygSBPIASAJIAGgEIAMAFQAeALgLCaQBghtAqAJIALADIACgIIAHgGIgqBuQgDAJAAANIAAAIIABAHQgCADAAADIhkghgACHAUIABgDIgKAAIAJADgACAhlQgbgkgBgPIAKAEIBJAZIgbBMQgCgPgagng");
	this.shape_55.setTransform(45.7,68.6);

	this.shape_56 = new cjs.Shape();
	this.shape_56.graphics.f(colors['#B8DBEC']).s().p("AhwB2IgCgBQACgFAAgGIABgGIAAgDIAAgEQABgLACgGQACgIABgMQAAgHAShCIgCgBIAAAAIABgCIABAAIABgFIADgPIAAAEIAAAMQBLgtAlgRQAngPAegQIAAAFIAAABQgJAFgNAQQgOAUgVASQgLALgbASIgOAPIgQAQIAMgHIADgBIgzAzQgXAdgZAmgABkBJIg3gZIABAAIAIgEIgJAEIgBAAIgBgBIAPgGIAygVQgBAHACAGQACARACAQIACAPIgPgIg");
	this.shape_56.setTransform(16.5,49.1);

	this.shape_57 = new cjs.Shape();
	this.shape_57.graphics.f(colors['#BADDEE']).s().p("ACjCHIACABIAAABgACLADQhWgUgcgEQhtgJgGgCIhJADIgBgBQAQgMBLgwQA9gpAMgFIAoAnIADADIASATIBeBUIgBABQgGgEgJgDg");
	this.shape_57.setTransform(60.3,50.4);

	this.shape_58 = new cjs.Shape();
	this.shape_58.graphics.f(colors['#ABDEF5']).s().p("AASgCIgMgFIAqghQAogfAdgQIAcgQIgRgHIhjgvIABgCIADAAIBJgCQAGACBwAJQAbADBXAWQAIADAGAEIgfAWQgTALgHgCIAAgBIgBABQgHgBgTAJQgVALgIgDIgEgBIhJgYIgKgEQABAOAbAlQAaAnACANIgBADIgMAhIgFAQIAAADIgCAIIgLgDQgqgJhiBsQALibgegJgAi5A6QiLhBgbgQIAAAAQAjgSA9gZQACgCADgBQAJgFAagKIAUgIIABgBIA3AZIAPAIIABAAQACBbgGAPQgBAEABALQgBAOgCAHIgBADIg2gbgACyBEIAKABIgBACIgJgDg");
	this.shape_58.setTransform(40.5,63.4);

	this.shape_59 = new cjs.Shape();
	this.shape_59.graphics.f(colors['#A2D6EE']).s().p("AjABQIA0g0IgEADIgMAGIARgRIAQgPQAagQAMgLQAUgTAPgUQAMgPAJgGIABAAIgBAAIAAgGQgeARgmAPQgoARhKArIAAgLIADgUIAGgcQAJgTAchIIBaAcIASAKQASAMALAIQAZAUgDAJQgCAGCKA+IAGADIAAABIAFABIBjAvIgTgFQgNgFg1AAQg1AAgFgCQgOgFgmADQgtADgTAAIAAAAIgxAUIgQAHIABABQAAgBAAABIgUAJQgaAKgJAFQgDABgCACQg9AYgjATQAYgmAXgegAhSBOIAJgEIgIAEgAjXADIgBAEIgBAAIACgEg");
	this.shape_59.setTransform(29.3,46.1);

	this.shape_60 = new cjs.Shape();
	this.shape_60.graphics.f(colors['#B0D5E5']).s().p("AhVBjQAGgLANg1QARg9AHgRQAIgXAUgfIABgCQAHACBcBcQgMAFg+AmQhJAxgQALIAAABIgCAAIgGABg");
	this.shape_60.setTransform(51.6,37.4);

	this.shape_61 = new cjs.Shape();
	this.shape_61.graphics.f("#B9DFF0").s().p("Ai0AsQAGgCgDgBIAAgBQACABAGgGQAJgKAIADQALAFAPgNIAPgNQAHADADgGQACgEAHABQAKADAPgKQAQgNAGABQAOAGAxgkIAGACIAEgLIAOAGIBeAvIAzAVIAAABIgBAAQgJgBgVAEIgWAFQgDgBgzADIg3AEQgpgFhWAOQhFALgPAHIAGgPg");
	this.shape_61.setTransform(31.4,25.4);

	this.shape_62 = new cjs.Shape();
	this.shape_62.graphics.f(colors['#CBE6F3']).s().p("AioCpQAThPhUAyQgUgOgWgVIABAQIgBAAIgBgPQgDgQgCgRQgBgGAAgHIAAAAQAUAAAtgDQAngDAOAFQAFACA1AAQA1AAANAFIATAFIARAHIgdAQQgcAQgoAfIgrAhIgFAEIgTgJgAEHgOIgTgCIgQgDQgJgDglgEIgpgGIgQgDQgKgEgMgBIgNgBIgDgCIgpgnQhdhcgGgCIAAgBQBNAlAuAQIB3ArQAOAIBQA6IgBACIgTgBg");
	this.shape_62.setTransform(55.6,45.1);

	this.shape_63 = new cjs.Shape();
	this.shape_63.graphics.f(colors['#A5D3E7']).s().p("AhvBhIAbhMIAEABQAIADAVgLQATgKAHABIguAuQghAfgGARgAgDAWQgLgFgKgLQAHABARgJIAfgVIADABIABgBIgDgBIAFgEQAngdAhgpIACADQgiBfgJAbIgEAOQgIAVgHAZQgng0gNgNg");
	this.shape_63.setTransform(72.6,53.9);

	this.shape_64 = new cjs.Shape();
	this.shape_64.graphics.f(colors['#CDE2EC']).s().p("AC2AiIgTgTIAAAAIAOABQAMABAKAEIAPADIApAGQAmAEAIADIARADIASACIATABIgDAEQggAogoAeIgEADgAg5BOQiNhBACgGQADgHgYgTQgMgJgRgLIgTgLIhZgcQAPgGBEgMQBWgOArAFIA3gEQAzgDADABIAXgFQASgEAJABIAAADQgSAfgIAXQgHARgRA9QgNA1gGALIgFgCg");
	this.shape_64.setTransform(48.3,39.3);

	this.shape_65 = new cjs.Shape();
	this.shape_65.graphics.f(colors['#A2C4D4']).s().p("Ag4BzIgCgEIgCgGQgDgJAAgIIAEhXQAFAJAGAIQAJAoA2gaIADACIACAAIgQAQIASgOIgBgEIABgBIgBgEQABgGAAAAQADgQALgjIALglIAAgBIAAgCIgCACIgZAKIgOAEQgCAAgIADIgMADQgGAAgRAGIgQAIIgDABIgBABIgDgCQAAgNAQgdIAXgsIABAAQAJAFAJACQANAFAnAbQAAAEABADIgBAEIABAAQACAfAHAnIAAAPIAGgDIgGAGQgBAAAAABQAAAAAAABQAAAAAAABQAAABABAAIgBgEIAAgCQgCgKgFgBQgGABgBADQgBADgSASIAOgFIAGgEIAIABQgvAnAAABQgBAEgEAAQgIAAgMASQgNATgFAAQgGAAgFAJQgDAEgCAFIgCgGg");
	this.shape_65.setTransform(55.4,99.1);

	this.shape_66 = new cjs.Shape();
	this.shape_66.graphics.f(colors['#A1CADE']).s().p("AgZANQgHgHgFgIIgDAEIgBgCIgBgKIACgZIADgCIAAAAQAoAaAmAlIACACIgBABIgCAAIgDgBQgWAKgOAAQgVAAgFgZg");
	this.shape_66.setTransform(53.2,99.5);

	this.shape_67 = new cjs.Shape();
	this.shape_67.graphics.f(colors['#B3DAEC']).s().p("AAVAsIABgBIgCgCQgkgogqgXIAAgBIABgBIAEAAIAQgIQAQgHAGABIANgDQAIgEACABIANgEIAZgLIACABIgLAmQgKAjgDAQQgBAAAAAGIABADIgBACIABADIgSAPIAPgQgAAtATQABgEAGAAQAFAAABALIAAACIABAEIAAAAIgFAAIgJgBIgGAEIgNAFQASgSABgDg");
	this.shape_67.setTransform(55.3,98.1);

	this.shape_68 = new cjs.Shape();
	this.shape_68.graphics.f(colors['#A5D3E7']).s().p("Ag4BfIACg9IACABQAIAAALgNQALgLAGgBIgXArQgQAeAAANgAABARQgHgCgJgFQAFgBAKgKIARgXIACABIgBgBIgBAAIADgEQAUgeAOglIACACQgCBMABAUIAAALQgBAQABATQgngbgPgFg");
	this.shape_68.setTransform(54.7,85.9);

	this.shape_69 = new cjs.Shape();
	this.shape_69.graphics.f(colors['#BADDEE']).s().p("ACHBNIACAAIAAABgAiIAjIAyg/QAkgqAHgGIAmASIACABIAQAJIBXAnIAAAAQgGgBgHABQhDAEgUAEQhPARgFAAIgyATg");
	this.shape_69.setTransform(46.4,84.4);

	this.shape_70 = new cjs.Shape();
	this.shape_70.graphics.f(colors['#C4E4F3']).s().p("AAABoIgYgEIgHgCIgLAAIg2gIIgBAAIAAgDIgDgPQgDgHAAgEQAAgMgXg/IAAgBQgDgFgBgGIAFADQARAIAQAEQAwg3AFA9IAQABIACgDQAFgBAGABQAUABAeBvQAshkAggDIAIgBQABgCgBgCIADgGIgEBVQAAAIADAJIACAGIADAFIgBAEIhQABIgUAAQgeAAAAgFgAB1AGIAHgBIABgCIgIADgABbhOQgcgUgDgKIAHABIA6AAIgBA8QgGgJgbgWg");
	this.shape_70.setTransform(36.6,100.2);

	this.shape_71 = new cjs.Shape();
	this.shape_71.graphics.f(colors['#ABDEF5']).s().p("AAdAYQgFgBgFABIAWggQAVgfAQgTIARgSIgOgBIhRgJIAAgCIADgBIAzgTQAEAABRgUQAVgEBDgEQAGAAAGABIgSAXQgLAMgFABIgBgBIAAABQgFABgMALQgLANgIAAIgCgBIg6ABIgHgCQAEALAbAUQAbAWAGAJIAAACIAAABIAAABIgBAXIABAMIAAACQABADgBADIgIABQggADgsBkQgdhxgXAAgAhlBzQhygOgXgFIABgBQAUgVAlgfQAAgBABAAQAAgBAAAAQAAAAABgBQAAAAABAAQAFgGAQgNIAMgLIABAAIABgBIADgFIAEgDIAfgYIADAJIALAUIAFAKIABAAQAXBCgBALQAAAEAEAIIACAPIAAACQgUgCgZgFgACmAkIgBACIgHAAIAIgCg");
	this.shape_71.setTransform(32.5,97);

	this.shape_72 = new cjs.Shape();
	this.shape_72.graphics.f(colors['#B8DBEC']).s().p("AgpBjIgBgEIAAgDQAAAAAAAAQgBgBAAAAQAAAAAAgBQAAAAABAAQgDgIAAgFQAAgGgDgJQgBgFgDg1IgCAAIAAAAIAAgBIABgBIgBgCIgBgLIABADIADAIQAqgxAXgVQAXgUARgRIACADQgFAGgFAOQgHASgJARQgFALgPATIgIAOIgGAPIAFgIIACgCIgXAwQgJAagIAhIgBABIgCAAIgBgJg");
	this.shape_72.setTransform(12.4,95.8);

	this.shape_73 = new cjs.Shape();
	this.shape_73.graphics.f(colors['#A2D6EE']).s().p("AiCA2IAYgwIgCACIgHAIIAIgQIAIgMQAPgUAFgLQAKgRAGgSQAFgNAFgHIgCgDQgRASgXAUQgZAVgpAwIgEgHIgCgQIgDgVQACgPAEg7IBGAAIAQADQAPADAKAEQAWAIAAAHQAAAEBwAOQABAAAAAAQABAAABAAQAAAAAAAAQABAAAAAAIABABIAEAAIBRAKIgOABQgLAAglALQgnANgDAAQgLgBgbAMIgaAKIgRAGIgBABIgeAYIgEADIgEAFIAAABIgBAAIgMALQgQANgFAHQgBAAAAAAQgBAAAAABQAAAAgBAAQAAABAAAAQgmAfgUAWQAIgiAKgagAilAGIABACIgBABIAAgDg");
	this.shape_73.setTransform(23.5,95.2);

	this.shape_74 = new cjs.Shape();
	this.shape_74.graphics.f(colors['#CBE6F3']).s().p("AhUCHQgFg8gwA3QgQgFgRgHIgFgDQABAGADAFIAAAAIAAAAIgFgKIgLgWIgEgJIABgBIATgGIAagKQAbgMALABQADAAAngNQAlgMALAAIAOgBIAMABIgPASQgQATgVAfIgXAiIgCADIgQgCgAAuhLIgmgSQhWgrgGABIAAgBQBBAHAiABIBfADQAMACBGAWIgBACIgNAEIgNADIgOACIghAFQgdAGgCgBIgMACQgIAAgJACIgKACg");
	this.shape_74.setTransform(41.1,86);

	this.shape_75 = new cjs.Shape();
	this.shape_75.graphics.f(colors['#CDE2EC']).s().p("AgSBPQhygOAAgEQAAgIgWgIQgKgEgPgDIgQgDIhGAAQAKgHAtgYQA6gcAfgGIAngQIAmgPIAOgIQAOgIAGgBIABABQgHAcgBASQAAANACAvQAEApgDAJQAAAAgBAAQAAgBAAAAQgBAAgBAAQAAAAgBABgACNgHIgSgJIAAAAIAKgCQAJgCAIAAIAMgCQACABAdgGIAhgGIAOgBIANgDIANgFIgBAEQgOAlgUAcIgDAEg");
	this.shape_75.setTransform(33.6,80.2);

	this.shape_76 = new cjs.Shape();
	this.shape_76.graphics.f(colors['#B0D5E5']).s().p("AguBOQADgJgEgoQgDgvABgNQAAgTAHgbIAAgBQAGgBBWAsQgHAGgjApIgwBAIgCABIgDACg");
	this.shape_76.setTransform(36.8,80.2);

	this.shape_77 = new cjs.Shape();
	this.shape_77.graphics.f("#B9DFF0").s().p("Ah+A3QABAAAAgBQABAAAAgBQAAAAAAgBQAAAAAAAAIAAgBQABABACgGQAFgJAFAAQAKABAHgNIAIgNQAGAAAAgEQAAgEAHAAQAIAAAHgLQAIgNAFAAQAMABAbgmIAFAAIABgIIAJAAIBNAMIApAFIAAABIgBAAQgFABgOAIIgOAIIgnAOIgmAQQgdAFg6AeQguAYgJAHIAAgLg");
	this.shape_77.setTransform(19.7,77.1);

	this.shape_78 = new cjs.Shape();
	this.shape_78.graphics.f(colors['#A2C4D4']).s().p("AA0BjIACgCQAKgKgDgFQgHgHgEADIgmgCIARAKIAIADIAHAJQhOgQgBABQgFADgDgFQgJgKgdADQgfADgEgGQgFgFgOABQgHAAgGACIAEgGIADgHIAEgHQAHgKAIgHIBfhEQgHAOgCANQgiApBIAkIAAAEQAAAAABAAQAAABAAAAQAAAAAAAAQAAABAAAAIgbgCIAdAGIADgDIACgBIACgEQAHgFABABQATgKAvgVIAxgVIAAAAIACgBIACACQgeAdgkApIgSANIAJAEIgKgDQgEACgCACIAEgEgACGAMQgegNgDgDIgOgJQgCgDgMgIIgNgKQgGgHgVgMIgVgKIgDgCIgCAAIgBgEQANgLAtgJIA/gNIABABQADAOAGALQAHATAEA+IgFAHIgFABIgBAAg");
	this.shape_78.setTransform(147.5,129.2);

	this.shape_79 = new cjs.Shape();
	this.shape_79.graphics.f(colors['#B3DAEC']).s().p("AgFBVIgEgGIgHgIIgIgEIgRgKIAmACQADgCAGAGQADAFgJALIgBACIgEAEIAAAAgAhPA1IAdADIADAAIABgEQAIhHgJhBIABAAIACAAIADADIAVAKQAUAMAFAHIANAKQAMAHACADIAOAKQADACAeAPIABADIgxASQgtAWgTAKQgBgCgHAGIgCADIgCABIgDAEIgfgHg");
	this.shape_79.setTransform(153,131.1);

	this.shape_80 = new cjs.Shape();
	this.shape_80.graphics.f(colors['#A1CADE']).s().p("AAWBIQAAAAAAgBQAAAAAAAAQgBAAAAgBQAAAAAAAAIAAgEQhJgkAjgpQACgOAGgNIgJACIACgDQAFgGAHgEIAagWIABgBIgBABIgBACQAAAAAAAAQABAAAAAAQABAAAAAAQABABABABIAAAAQAJBAgJBHIAAAEIgDAAg");
	this.shape_80.setTransform(145.6,129.5);

	this.shape_81 = new cjs.Shape();
	this.shape_81.graphics.f(colors['#B0D5E5']).s().p("AhfBCIgFgDIAAgBQALgGAngmQAxgpAMgMQATgOAigQIABAAQAGAEAeB/QgNgDhJABIhsACQAAAAAAABIgCgBg");
	this.shape_81.setTransform(151.6,92);

	this.shape_82 = new cjs.Shape();
	this.shape_82.graphics.f(colors['#C4E4F3']).s().p("AhaBvQgtgzAIgGIgTgeIgEgJIgJgMIglg9IAAAAIACgCIAMgQQAGgKADgDQANgKAxhPIAAgBIAHgNIACAIQAHAYAIAUQBhADg6A4IAMASIAGgBIAJAMQASAYhcB8QCLgmAeAeIAIAHIAHgEIAJgDIhfBGQgGAHgHAKIgEAIIgDAHQgDAAgCADIhEhSgABOBkIADgCIgJgFIAGAHgACKgFQgDguAIgMIAFAIIAyA7IhAAyQAFgOgBgtg");
	this.shape_82.setTransform(134.8,116.6);

	this.shape_83 = new cjs.Shape();
	this.shape_83.graphics.f("#B9DFF0").s().p("ACnBYQgGgFgUgIIgVgHQgDgDgsgZIgxgaQgggahQghQg+gcgSgDIANgKQAFACgBgDIABgBQABADAIgDQANgCAEAGQAIAKATgDQAUgEABABQAEAGAFgDQAEgDAGAGQAGAIAUgCQAUgDAEAEQAHANA/gDIAEAFIAJgHIAJAMIA1BZIAfAvIgBAAIAAABg");
	this.shape_83.setTransform(141.4,76.3);

	this.shape_84 = new cjs.Shape();
	this.shape_84.graphics.f(colors['#A2D6EE']).s().p("ADVC3QgJgLgtgcQgtgegCgDQgKgMgigSIghgSIgXgPIAAAAQgagEgZgFIgHgBIgJgBIgBAAQAAAAAAAAQAAgBAAAAQAAAAAAABQAAAAAAAAIgVgEQgcgFgLAAQgCgCgDACQhBgNgngDQApgSAkgMIBHgPIgFAAIgNgBIAXgGIAWgEQAggCAQgDQAYgEAYgJQASgGALAAIABABIAAgBIABgFQgggDgpgHQgpgIhXgBIAGgLQAIgHAHgJIAUgUQARgLA/guIA7BIIAKATQAIATAFAOQALAdgIAGQgFAEBTCAIAEAFIAAABIADADIA6BdQgIgJgEgFgAiDhdIAEgDIgCADg");
	this.shape_84.setTransform(125,88.3);

	this.shape_85 = new cjs.Shape();
	this.shape_85.graphics.f(colors['#B8DBEC']).s().p("AiWA7IgCgCQAEgDAEgGIAEgEIACgCQAAgBAAAAQABgBAAAAQAAAAABAAQAAgBAAAAQAHgKAEgEQAGgFAIgKQADgGA0guIgBgCIAAAAIABgBIACAAIADgDIALgLIgCAEIgGALQBUABArAIQApAHAhADIgCAEIgBABQgKgBgTAHQgYAIgaAFQgQABggACIgVAEIgWAFIAOABIAEAAIhHAQQgjAMgpAUg");
	this.shape_85.setTransform(117.4,83.5);

	this.shape_86 = new cjs.Shape();
	this.shape_86.graphics.f(colors['#A5D3E7']).s().p("AgOgSQgHgLgCgOQAFAFAUABIAmgBIABACIABgBIgBgCIAGAAQAxgEAygRIABAEQhSA9gWATIgLAJQgSANgRARQgFg/gGgSgAiRgMIBAgzIABADQAHAHAXACQAVACAFAFIg/AOQguAIgNALg");
	this.shape_86.setTransform(162.9,123.4);

	this.shape_87 = new cjs.Shape();
	this.shape_87.graphics.f(colors['#ABDEF5']).s().p("ABKCyIAJAFIgDACIgGgHgAgTAfIgJgLIA0gFQAygFAiACIAgACQgEgHgHgHIg6hcIACgBIADACIA+AlQAEAFBZBBQAWASA9BCQAGAGADAHIgmABQgXAAgFgFIABgCIgBABQgFgGgWgBQgXgCgGgHIgBgDIgyg8IgFgIQgIAMADAtQABAvgFAOIgEACIgcAWQgGAEgGAGIgBADIgGAFIgJgHQgegfiLAnQBdh+gTgZgAjigZQhRiEgPgbIABAAQAnADBBANQACgCADACQALAAAbAFIAVAEIACABIAJAAIAGABQAaAFAbAEIgGALIgOAeIgGAOIAAAAQgxBPgMAKQgEADgFAIIgNAQIgCACIgggyg");
	this.shape_87.setTransform(134.6,108.1);

	this.shape_88 = new cjs.Shape();
	this.shape_88.graphics.f(colors['#CDE2EC']).s().p("ACeD+Ighh7IgGgaIAAAAIALAIQAKAHAGAJIAMALQABADAeAYQAdAYAGAHIAMAMIAPALQAKAGAGAEIgFACQgxARgyAEIgFAAgAhkAmQhTiAAEgEQAIgGgKgdQgFgOgJgTIgKgTIg9hIQASAEA+AbQBQAiAiAbIAxAbQAqAYADADIAVAIQAUAIAGAFIgBACQgiAQgTAOQgOALgvArQgnAlgMAGIgDgFg");
	this.shape_88.setTransform(151.2,93.9);

	this.shape_89 = new cjs.Shape();
	this.shape_89.graphics.f(colors['#CBE6F3']).s().p("AD/CUIgPgLIgMgMQgGgHgdgXQgegZgBgDIgMgLQgGgIgKgHIgLgJIgBgDIgOg1QgeiAgFgFIAAAAIABgBQAvBKAeAmIBOBjQAHANAlBcIgDABQgFgFgKgGgAjQBIQA7g5higDQgIgSgHgYIgCgIIgHANIAAABIgBAAIAHgOIAOgeIAGgMIAAAAIAXAPIAhASQAiASAKANQADADAsAbQAtAcAJALQAEAGAJAJQAGAHAFAIIghgCQghgCgzAFIg1AFIgGAAIgMgRg");
	this.shape_89.setTransform(150.8,101.2);

	this.shape_90 = new cjs.Shape();
	this.shape_90.graphics.f(colors['#BADDEE']).s().p("AA/CeIACACIgBABgAByAiQg9g/gWgSQhXhDgEgFIg+glIgBgCIBtgCQBIAAANACIAOA3IAAADIAGAbIAhB4IgBABQgDgHgGgHg");
	this.shape_90.setTransform(154.6,114.6);

	this.shape_91 = new cjs.Shape();
	this.shape_91.graphics.f(colors['#B0D5E5']).s().p("AgWBnQAAgNgRgzQgTg9gEgSQgFgXABgmIAAgBQAHgCB+AbQgHALggBCIgrBiIAAABIgBABIgFAEg");
	this.shape_91.setTransform(108.8,126.4);

	this.shape_92 = new cjs.Shape();
	this.shape_92.graphics.f(colors['#A1CADE']).s().p("AgcAUQgMgIgJgMIgDAKIgBgDQgDgHgBgHIgIgiIAAgBIABABIAAACQAAgBABAAQAAgBAAAAQABAAAAgBQABAAAAgBIAAABQA+ATA9AmIAEACIgBACQgBgBAAAAQgBAAAAAAQAAABAAAAQgBAAAAAAIgEgBQghAagWAAQgUAAgLgYg");
	this.shape_92.setTransform(137.6,145.5);

	this.shape_93 = new cjs.Shape();
	this.shape_93.graphics.f(colors['#C4E4F3']).s().p("AhvCiIgJgUQgHgIgBgFQgDgPgzhOIgJgNQAeAGAYABQAthVAaBLIAVgCIACgGQAHgCAHgBQAdgHBICKQAbiOAogOIALgEIgDgIIACgJIAXBxQACALAHAKIAFAHQACACACAEQAAADACACIhoAbQhBATgCgKIggAEIgLAAIgPACIhIAHIgBABgACOgMIAJgCIAAgDIgJAFgABRhyQgrgSgIgMIAKgBIBMgTIARBQQgKgLgqgTg");
	this.shape_93.setTransform(117.5,149.5);

	this.shape_94 = new cjs.Shape();
	this.shape_94.graphics.f(colors['#B3DAEC']).s().p("AAoA7IABgCIgDgBQg8gog/gSIABgCIAEgCIASgPQAVgOAIgCIAPgIQALgHAEAAIANgJQADgBAbgVIACAAIgCA1IAABHQgCABACAHIACAEIABADIABAEIgTAYIAPgZgAA/ATQAAgFAIgDQAGAAAFANIACADIABAFIABAAIgBAAIgHABIgKACIgHAGIgQALIASghg");
	this.shape_94.setTransform(140,141.5);

	this.shape_95 = new cjs.Shape();
	this.shape_95.graphics.f(colors['#A2C4D4']).s().p("AghCcQgCgDgDgCIgEgHQgHgLgCgKIgXhzQAKALALAIQAXAyA/g0IAEACQABgBAAAAQAAAAAAAAQABAAAAAAQAAAAABAAIgPAZIATgYIgCgFIAAgCIgCgEQgCgHABgBIAAhHIADg1IgBgBIABgCIgDADQgaAUgEACIgNAIQgDAAgMAIIgPAIQgIACgUAOIgSAOIgEADIgBACIgEgBQgEgSAMgrIAPhAIABAAQAOAEANgBQAUACA6AXIADAJQAAAAAAABQgBAAAAABQAAAAAAABQAAABAAAAIAAABIACgBQAOAnAVAzIAFAWIAHgHIgHAJIABAGIgCgFIgBgCQgGgNgFAAQgIACAAAGIgSAfIAQgLIAHgGIAKgCQgxBBABABQAAAFgFACQgNADgKAdQgIAcgIACQgHACgFAOQgDAFgBAGIgDgGg");
	this.shape_95.setTransform(140,144.8);

	this.shape_96 = new cjs.Shape();
	this.shape_96.graphics.f(colors['#ABDEF5']).s().p("AkQDiQATgiAng1QAAgBAAAAQABgBAAgBQAAAAAAgBQABAAAAAAQAGgKAQgXIANgRIABgCIA7gHIASgCIAAAAQAzBOADAQQABAEAHAJIAJATIABADIg9AGQiZAQggACgAA0AvQgHABgHACIATgyQARguAQgdIAQgdIgTADIhqAOIAAgCIACgDIA6goQAHgCBjgzQAZgLBVgbQAJgDAIAAIgQAjQgKAUgHACIgBgBIAAABQgGADgLASQgMAUgJADIgDAAIhMATIgKABQAIAMArARQAqATAKAMIABADIAHAjQABAHAEAGIABADIADAIIgLADQgoAPgbCQQhJiKgeAGgADqATIAAADIgJACIAJgFg");
	this.shape_96.setTransform(109.2,145.6);

	this.shape_97 = new cjs.Shape();
	this.shape_97.graphics.f(colors['#A5D3E7']).s().p("Ag4CNIgRhPIADgBQAJgCAMgUQALgSAGgDIgPA/QgLAsAEARgAgEAVQgMABgPgEQAHgCAKgSIAOgjIADAAIgBgCIgCABIACgGQASguAGgzIADAAIAeCBIADAMQAFAWAHAYQg8gXgSgCg");
	this.shape_97.setTransform(136.6,126.7);

	this.shape_98 = new cjs.Shape();
	this.shape_98.graphics.f(colors['#CBE6F3']).s().p("Ai0DRIgKgLIgUgaIgJgKIABgBQARgKAkgaQAfgXAPgDQAFgCAtgbQAtgdAOgDQAHgBAJgEIATgEIgQAdQgOAdgRAwIgTAzIgCAFIgVADQgahOgtBXQgYAAgegGIAJAMgAAnh6Ig2gLQiBgcgHACIAAAAIAAAAIAAgBQBXgLAvgKIB6gbQAQgBBjAHIgBACIgQAKIgQAIIgQAGQgJACgiAQQgjARgDAAIgPAGQgKACgLAFIgMAGg");
	this.shape_98.setTransform(117.3,132.1);

	this.shape_99 = new cjs.Shape();
	this.shape_99.graphics.f(colors['#BADDEE']).s().p("Ai4BYIAthhQAghDAHgLIA4ALIADABIAaAGIB7AYIAAAAQgHABgJACQhVAbgXAMQhjAxgHABIg8ApgAC2A3IACgBIABABg");
	this.shape_99.setTransform(125.7,127.5);

	this.shape_100 = new cjs.Shape();
	this.shape_100.graphics.f(colors['#B8DBEC']).s().p("AgECRIgCgFIgBgDQgBgBAAAAQAAAAAAgBQgBAAAAAAQAAgBAAAAQgGgKgBgGQgCgIgGgLQgEgGgVhDIgCAAIAAAAIgBgCIABgBIgCgEIgEgOIACADIAHAKQAmhMAYgjQAYghARgdIADAEIAAAAQgFAKgCATQgCAZgIAaQgDAQgNAdIgGAVIgFAWIAHgMIACgDIgRBGQgEAlAAAuIgBAAIgBABQAAgFgEgGg");
	this.shape_100.setTransform(81.5,152.7);

	this.shape_101 = new cjs.Shape();
	this.shape_101.graphics.f(colors['#A2D6EE']).s().p("AiBBRIARhGIgCADIgGAMIAFgYIAGgTQAMgdAEgQQAHgaACgZQADgTAFgKIAAAAIgBAAIgDgEQgRAdgYAhQgZAjgnBMIgHgKQgDgKgFgIIgKgbQgCgUgOhNIBbgXQAKgBALAAQAVAAAPACQAeADADAJQABAGCXgTIAGgBIABABIAFgCIBsgNQgLAFgHABQgOADgtAcQgtAcgFABQgPADgfAXQgkAbgRAKIgBAAQgNAXgQATIgIANIAAABIAAgBIAAABQAAAAAAAAQAAAAAAAAQAAAAAAAAQAAABAAAAIgNARQgQAXgGAJQAAABgBAAQAAABAAAAQAAABgBAAQAAABAAABQgnA1gTAiQAAguADglgAi9AcIACAEIgBABIgBgFgAggAPIgDAGIgBAAg");
	this.shape_101.setTransform(95.2,151.8);

	this.shape_102 = new cjs.Shape();
	this.shape_102.graphics.f(colors['#CDE2EC']).s().p("AkPBNQBBg6AngSIAtgfQApgdAEgBIAQgQQAQgPAHgDIACACQgBAlAFAYQAEASATA8QAPA0AAANIgFABQiXATgCgGQgCgKgfgDQgPgCgVABQgKgBgLABIhbAYQAKgOA0gtgAC2gyIgagGIAAgBIAMgGQALgFALgCIAPgGQADAAAjgRQAhgQAJgCIAQgGIAQgIIARgKIgBAFQgGA0gRAuIgDAFg");
	this.shape_102.setTransform(105.8,125.6);

	this.shape_103 = new cjs.Shape();
	this.shape_103.graphics.f("#B9DFF0").s().p("AiUBlQAEgFgDAAIgBgBQADABABgJQADgMAIgCQAMgCAFgTQAGgUABAAQAHgBgBgGQgBgGAIgCQAKgCAHgQQAFgUAGgBQAQgEAYg5IAGgCIgCgMIAOgCIBngJIA4gHIAAAAIAAABIAAAAIgBAAQgIADgPAPIgQAQQgEABgpAeIgtAgQglARhBA5Qg0AtgKAOIgDgPg");
	this.shape_103.setTransform(87.1,127.6);

	this.shape_104 = new cjs.Shape();
	this.shape_104.graphics.f(colors['#A1CADE']).s().p("AgjASQgIgKgHgLIgEAGIgBgDQgCgGABgIIABgjIAAgBIABACIAAABIAEgDIAAABQA2AiAzAzIACADIgBABIgDAAIgDgCQgeANgTAAQgdAAgHghg");
	this.shape_104.setTransform(113.8,116.4);

	this.shape_105 = new cjs.Shape();
	this.shape_105.graphics.f(colors['#B3DAEC']).s().p("AAcA7IABgBIgCgDQgxg1g4ggIAAgBIACgBIAEgBIAVgKQAWgJAJAAIARgEQALgEADAAIARgFQADAAAfgOIACABQgFAQgJAiIgSBFQgCAAAAAJIACAEIgBACIABAFIgYATIAUgVgAA8AaQABgFAJgBQAGABACAPQAAAAAAAAQAAAAAAAAQAAABAAAAQAAAAAAABIABAFIAAAAIgHAAIgLgBIgIAFIgSAGQAXgYACgDg");
	this.shape_105.setTransform(116.6,114.5);

	this.shape_106 = new cjs.Shape();
	this.shape_106.graphics.f(colors['#A2C4D4']).s().p("AhLCbIgDgHQgBgFgCgCQgEgMAAgLIAFh1QAHANAJAKQALA2BJgiIAEACIACAAIgUAVIAYgTIgBgFIABgCIgBgEQAAgJABAAIAShFQAJgiAGgQIAAgBIABgDIgEACQgeAOgEABIgRAFQgDAAgLAEIgRAEQgIAAgXAIIgVALIgEAAIgBACIgEgCQAAgRAWgoIAdg5IACAAQANAHAMACQARAGA1AlQAAAEABAEIgCAFIACAAQADAqAJA1IAAAVIAIgEIgJAGQgBAEABADIgBgGQAAAAAAAAQAAgBAAAAQAAAAAAAAQAAAAAAgBQgCgPgGAAQgJABgBAEQgCAEgXAYIASgHIAIgEIALABQg/AzAAACQgBAGgGAAQgLgBgQAZQgRAagHAAQgIAAgIALQgEAFgCAHIgCgHg");
	this.shape_106.setTransform(116.7,115.8);

	this.shape_107 = new cjs.Shape();
	this.shape_107.graphics.f(colors['#C4E4F3']).s().p("AABCLIghgFIgKgCIgPgBIhIgLIgBAAIAAgDIgEgUQgFgKAAgFQABgQgfhWIAAAAQgEgHgBgIIAGAEQAXAKAVAGQBBhKAGBSQAKAAALACIAEgFQAGgBAIABQAcABAnCVQA8iFAqgEIAMgCQAAgDgBgDIAEgIIgFBzQAAALAEAMQACADABAEIADAHQgBADABADIhrABIgaAAQgqAAABgHgACdAIIAKgBIAAgDIgKAEgAB6hpQglgagFgOIAKABIBOAAIgCBRQgIgMgkgeg");
	this.shape_107.setTransform(91.5,117.4);

	this.shape_108 = new cjs.Shape();
	this.shape_108.graphics.f(colors['#B8DBEC']).s().p("Ag3CFIgCgGIAAgDQAAAAAAgBQgBAAAAgBQAAAAAAgBQAAAAABgBQgEgLAAgGQAAgIgEgMQgCgGgEhHIgDAAIABgBQAAAAAAAAQAAAAAAAAQAAgBAAAAQAAAAgBAAIACgBIgCgDIAAgPIABAEIAFALQA3hCAggcQAfgaAXgYIACAEQgHAJgGASQgJAYgNAXQgHAPgTAaIgLATQgEAHgFANIAIgLIACgCIgfBAQgMAjgLAsIgBABIgDAAQABgGgCgGg");
	this.shape_108.setTransform(59.2,111.4);

	this.shape_109 = new cjs.Shape();
	this.shape_109.graphics.f(colors['#A2D6EE']).s().p("AivBJIAhhAIgDADIgJAKQAFgNAFgJIALgRQAUgaAHgOQANgYAJgYQAGgSAHgIIgCgFQgYAYgeAbQgiAcg3BBIgFgKQgBgLgDgKIgDgdQADgUAFhOIBegBIAUAEQAVAFAOAFQAdALgBAJQABAGCXASQADAAADABIAAAAIAGAAIBsANQgMACgHgBQgOAAgzARQgyAQgFAAQgPAAgkAPIgiAOIgYAIIgBABIgpAhIgEAEIgHAHIAAABIgBAAIgQAOQgVASgIAIQgCABAAADQgzAqgbAcQAKgsANgjgAjeAHIACAEIgCABIAAgFg");
	this.shape_109.setTransform(74,110.6);

	this.shape_110 = new cjs.Shape();
	this.shape_110.graphics.f(colors['#ABDEF5']).s().p("AAnAgQgIgBgGABIAegrQAcgqAWgZIAXgYIgTgBIhsgNIAAgCIADgCIBEgZQAHAABsgaQAbgGBZgFQAKgBAHACIgXAfQgPAQgHABIgBgBIAAABQgIABgOAPQgQARgKAAIgDgBIhOABIgJgCQAEAOAlAbQAlAdAHAMIAAADIAAACIgBAhQgBAHABAJIABADQABADAAAFIgMABQgqAEg7CGQgniXgfgBgAiHCbQiZgUgfgGIABgBQAbgcAzgqQAAgDACgBQAIgJAVgRIAQgOIABgBIABAAIAGgIIAEgDIApgiIAFAMIAOAcIAHAOIABAAQAeBYgBAPQABAFAEAKIAEAVIAAADIg8gJgADeAwIAAADIgKAAIAKgDg");
	this.shape_110.setTransform(86,113);

	this.shape_111 = new cjs.Shape();
	this.shape_111.graphics.f(colors['#A5D3E7']).s().p("AhLB/IAChRIADABQAKAAAQgRQAOgPAIgBIgeA6QgWAoAAARgAACAXQgKgCgNgHQAHgBAOgPIAWgeIADABIgBgCIgCAAIAEgFQAcgoASgyIADACQgCBoABAaIAAAQQgCAVACAZQg0glgUgGg");
	this.shape_111.setTransform(115.8,98.2);

	this.shape_112 = new cjs.Shape();
	this.shape_112.graphics.f(colors['#BADDEE']).s().p("AC1BmIACABIAAABgAi3AvIBEhUQAvg5AJgJIA1AZIABABIAXAMIB0A0IAAABQgIgBgJAAQhZAFgbAGQhrAYgHAAIhDAZg");
	this.shape_112.setTransform(104.7,96.1);

	this.shape_113 = new cjs.Shape();
	this.shape_113.graphics.f(colors['#B0D5E5']).s().p("Ag+BpQAEgMgFg3QgEg/ABgSQABgYAJgkIAAgCQAIgBB0A6QgKAJgvA3IhBBWIAAAAIgCACQgCAAgDACg");
	this.shape_113.setTransform(91.8,90.6);

	this.shape_114 = new cjs.Shape();
	this.shape_114.graphics.f(colors['#CDE2EC']).s().p("AgYBqQiZgSgBgHQABgJgdgLQgOgFgVgFIgUgEIheABQANgLA9gfQBNgmApgJIA1gVQAugTAFAAIASgMQATgKAIgCIABADQgJAjgBAZQAAARADBAQAFA3gEAMQgCgBgDABgAC9gJIgYgMIABgBIAMgDQAMgDALABIAQgCQADAAAngHQAjgIAKAAIARgCIASgFIASgFQgBABAAAAQAAABAAABQAAAAgBABQAAAAAAAAQgSAygcAmIgEAFg");
	this.shape_114.setTransform(87.5,90.6);

	this.shape_115 = new cjs.Shape();
	this.shape_115.graphics.f(colors['#CBE6F3']).s().p("AhyC1QgGhRhABKQgVgGgYgKIgGgEQACAHADAHIABABIgBAAIgGgOIgPgeIgFgLIABgBIAagIIAigPQAkgPAQABQAEAAAzgQQAygRAOAAQAHABAMgCIARABIgUAZQgXAZgcApIgeAtIgDAFQgLgCgLgBgAA+hkIg0gZQh0g6gHACIAAgBIAAAAQBXAJAuABICAAEQAPADBeAdIgBACIgSAGIgSAEIgRADQgJAAgkAHQgnAIgDgBIgQACQgKAAgMADIgNACg");
	this.shape_115.setTransform(97.6,98.3);

	this.shape_116 = new cjs.Shape();
	this.shape_116.graphics.f("#B9DFF0").s().p("AiqBKQAFgDgDgBIAAgCQACACAEgIQAFgMAIAAQANABAJgRQALgSABABQAHAAAAgGQABgFAIAAQAKAAALgPQAKgSAGAAQAQACAmgzQADgBADABIAAgMIANABIBoAQIA4AHIAAAAIAAABIgCgBQgHACgUAKIgSAMQgEAAgvATIg0AVQgoAHhNAoQg9AggNAKIAAgPg");
	this.shape_116.setTransform(69,86.4);

	this.shape_117 = new cjs.Shape();
	this.shape_117.graphics.f(colors['#A1CADE']).s().p("AAsA7IgDgCQhQAIAFg2QgEgLgDgPIgGAHIAAgDIAEgPIAMghIACgBIgBABIgBACQABAAAAgBQABAAAAAAQABAAAAAAQABAAABAAIAAAAQApAyAfBBIACADIgCABIgCgCg");
	this.shape_117.setTransform(63.9,155.6);

	this.shape_118 = new cjs.Shape();
	this.shape_118.graphics.f(colors['#B3DAEC']).s().p("AAAA4IAAgBIAAgDQgfhBgsgyIACgBIAEAAIAYgDQAZgBAHACIAPACQAOAAADABIARABQAEABAhgEIACACIgeArQgcApgKATQgCAAgCAHIgBAFIgBACIgBAFIgaAKIAagNgAAsA2IgKgEIgIABIgUABQAdgQADgCQADgFAIADQAFACgCAOIAAADIgCAFIAAAAIgGgCg");
	this.shape_118.setTransform(68.8,156.1);

	this.shape_119 = new cjs.Shape();
	this.shape_119.graphics.f(colors['#B8DBEC']).s().p("AhwB2IgCgBQACgFAAgGIABgGIAAgDIAAgEQABgLACgGQACgIABgMQAAgHAShCIgCgBIAAAAIABgCIABAAIABgFIADgPIAAAEIAAAMQBLgtAlgRQAngPAegQIAAAFIAAABQgKAFgMAQQgOAUgVASQgMALgaASIgOAPIgQAQIAMgHIADgBIg0AzQgWAdgZAmgABkBJIg3gZIABAAIAIgDIgJADIgBAAIgBgBIAPgGIAygVQAAAHABAGQABARADAQIACAPIgPgIg");
	this.shape_119.setTransform(15.9,134.6);

	this.shape_120 = new cjs.Shape();
	this.shape_120.graphics.f(colors['#A5D3E7']).s().p("AhvBhIAbhMIADABQAKADAUgLQATgKAHABIgvAuQggAfgGARgAgDAWQgLgFgKgLQAHABARgJIAfgVIADABIAAgBIgCgBIAFgEQAngdAhgpIADADQgjBfgJAbIgEAOQgIAVgHAZQgng0gNgNg");
	this.shape_120.setTransform(72.1,139.4);

	this.shape_121 = new cjs.Shape();
	this.shape_121.graphics.f(colors['#A2C4D4']).s().p("AhrCMIAAgHIgBgIQAAgNAEgJIAphtQADANAEANQgFA2BQgIIADACIACABIgYAOIAbgKIABgFIABgCIABgFQACgIABABQALgTAcgpIAegrIAAgBIACgCIgEABQghADgEAAIgRgBQgDgBgOAAIgRgCQgIgCgXABIgXADIgFAAIgBABIgCgEQAFgQAhgfIAsguIABAAQALAMALAFQAPANAnAzQgCAEAAAEIgDAEIAAABIACABQgKAogIA0IgIAVIAKgCIgLAEIgCAGIABgFIAAgDQACgOgEgCQgJgDgCAFQgDACgeAQIAUgBIAIgBIAKAEQhKAdAAABQgDAFgFgBQgMgFgYATQgXATgIgDQgGgCgNAJIgJAIIAAgHg");
	this.shape_121.setTransform(66.1,154.8);

	this.shape_122 = new cjs.Shape();
	this.shape_122.graphics.f(colors['#C4E4F3']).s().p("AgBB4QhBgSADgKIgfgPIgJgEIgNgHIhBggIgCgBIABgDQACgHABgOQgCgJACgEQAGgPgChdIgBgQQAWAWAVANQBTgygSBPIASAJIAGgDIAMAEQAeALgLCZQBhhsApAJIAMADIABgIIAHgGIgqBuQgEAJABANIABAIIAAAHQgCADAAADIhkghgACHAUIABgDIgKAAIAJADgACAhlQgbgkAAgPIAJAEIBJAZIgbBMQgCgPgagng");
	this.shape_122.setTransform(45.2,154.1);

	this.shape_123 = new cjs.Shape();
	this.shape_123.graphics.f(colors['#ABDEF5']).s().p("AASgCIgMgFIAqghQAogfAdgQIAcgQIgRgHIhjgvIABgCIADAAIBJgCQAGACBwAJQAbADBWAWQAKADAFAEIgfAWQgTALgHgCIAAgBIgBABQgHgBgTAJQgUALgKgDIgDgBIhJgYIgJgEQAAAOAbAlQAaAnACANIgBADIgMAhIgFAQIAAADIgBAIIgMgDQgpgJhjBsQALibgegJgAi5A6QiLhBgbgQIAAAAQAjgSA9gZQACgCADgBQAJgFAagKIAUgIIABgBIA3AZIAPAIIABAAQACBbgGAPQgCAEACALQgBAOgCAHIgBADIg2gbgACyBEIAKABIgBACIgJgDg");
	this.shape_123.setTransform(40,148.9);

	this.shape_124 = new cjs.Shape();
	this.shape_124.graphics.f(colors['#A2D6EE']).s().p("AjABQIAzg0IgDADIgLAGIAQgRIAQgPQAagQAMgLQAUgTAPgUQAMgPAJgGIABAAIgBAAIAAgGQgeARgmAPQgoARhKArIAAgLIADgVIAGgbQAJgTAchIIBaAcIASAKQASAMALAIQAZAUgDAJQgCAGCKA+IAGADIAAABIAFABIBjAuIgTgEQgNgFg1AAQg0AAgGgCQgOgFgnADQgsADgTAAIAAAAIgxAUIgQAHIABABQAAgBAAACIgUAIQgaAKgJAFQgDABgCACQg9AYgjATQAZgmAWgegAhSBOIAJgEIgIAEgAjXADIgBAEIgBAAIACgEg");
	this.shape_124.setTransform(28.8,131.6);

	this.shape_125 = new cjs.Shape();
	this.shape_125.graphics.f(colors['#BADDEE']).s().p("ACjCHIACABIAAABgACLADQhWgUgcgEQhtgJgGgCIhJADIgBgBQAQgMBLgwQA9gpAMgFIAoAnIADADIASATIBeBUIgBABQgGgEgJgDg");
	this.shape_125.setTransform(59.8,135.9);

	this.shape_126 = new cjs.Shape();
	this.shape_126.graphics.f(colors['#B0D5E5']).s().p("AhVBjQAGgLANg1QARg9AHgRQAIgXAUgfIABgCQAHACBcBcQgMAFg+AmQhJAxgQALIAAABIgCAAIgGABg");
	this.shape_126.setTransform(51,122.9);

	this.shape_127 = new cjs.Shape();
	this.shape_127.graphics.f("#B9DFF0").s().p("Ai0AsQAGgBgCgCIgBgBQACABAGgGQAIgKAJADQAKAFAQgNIAPgOQAHAEADgGQACgEAHABQAKADAPgKQAQgNAGABQAPAGAxgkIAFACIAFgLIANAGIBeAvIAzAVIAAABIgCAAQgIgBgVAEIgWAFQgDgBgzADIg3AEQgpgFhWAOQhEALgQAHIAGgPg");
	this.shape_127.setTransform(30.9,110.9);

	this.shape_128 = new cjs.Shape();
	this.shape_128.graphics.f(colors['#CDE2EC']).s().p("AC2AiIgTgTIAAAAIAOABQAMABAKAEIAPADIApAGQAmAEAIADIARADIASACIATABIgDAEQggAogoAeIgEADgAg5BOQiNhBACgGQADgHgYgTQgMgJgRgLIgTgLIhZgcQAPgGBEgMQBWgOArAFIA3gEQAzgDADABIAXgFQASgEAJABIAAADQgSAfgIAXQgHARgRA9QgNA1gGALIgFgCg");
	this.shape_128.setTransform(47.7,124.8);

	this.shape_129 = new cjs.Shape();
	this.shape_129.graphics.f(colors['#CBE6F3']).s().p("AioCpQAThPhUAyQgUgOgWgVIABAQIgBAAIgBgPQgDgQgCgRQgBgGAAgHIAAAAQAUAAAtgDQAngDAOAFQAFACA1AAQA1AAANAFIATAFIARAHIgdAQQgcAQgoAfIgrAhIgFAEIgTgJgAEHgOIgTgCIgQgDQgJgDglgEIgpgGIgQgDQgKgEgMgBIgNgBIgDgCIgpgnQhdhcgGgCIAAgBQBNAlAuAQIB3ArQAOAIBQA6IgBACIgTgBg");
	this.shape_129.setTransform(55.1,130.6);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_129},{t:this.shape_128},{t:this.shape_127},{t:this.shape_126},{t:this.shape_125},{t:this.shape_124},{t:this.shape_123},{t:this.shape_122},{t:this.shape_121},{t:this.shape_120},{t:this.shape_119},{t:this.shape_118},{t:this.shape_117},{t:this.shape_116},{t:this.shape_115},{t:this.shape_114},{t:this.shape_113},{t:this.shape_112},{t:this.shape_111},{t:this.shape_110},{t:this.shape_109},{t:this.shape_108},{t:this.shape_107},{t:this.shape_106},{t:this.shape_105},{t:this.shape_104},{t:this.shape_103},{t:this.shape_102},{t:this.shape_101},{t:this.shape_100},{t:this.shape_99},{t:this.shape_98},{t:this.shape_97},{t:this.shape_96},{t:this.shape_95},{t:this.shape_94},{t:this.shape_93},{t:this.shape_92},{t:this.shape_91},{t:this.shape_90},{t:this.shape_89},{t:this.shape_88},{t:this.shape_87},{t:this.shape_86},{t:this.shape_85},{t:this.shape_84},{t:this.shape_83},{t:this.shape_82},{t:this.shape_81},{t:this.shape_80},{t:this.shape_79},{t:this.shape_78},{t:this.shape_77},{t:this.shape_76},{t:this.shape_75},{t:this.shape_74},{t:this.shape_73},{t:this.shape_72},{t:this.shape_71},{t:this.shape_70},{t:this.shape_69},{t:this.shape_68},{t:this.shape_67},{t:this.shape_66},{t:this.shape_65},{t:this.shape_64},{t:this.shape_63},{t:this.shape_62},{t:this.shape_61},{t:this.shape_60},{t:this.shape_59},{t:this.shape_58},{t:this.shape_57},{t:this.shape_56},{t:this.shape_55},{t:this.shape_54},{t:this.shape_53},{t:this.shape_52},{t:this.shape_51},{t:this.shape_50},{t:this.shape_49},{t:this.shape_48},{t:this.shape_47},{t:this.shape_46},{t:this.shape_45},{t:this.shape_44},{t:this.shape_43},{t:this.shape_42},{t:this.shape_41},{t:this.shape_40},{t:this.shape_39},{t:this.shape_38},{t:this.shape_37},{t:this.shape_36},{t:this.shape_35},{t:this.shape_34},{t:this.shape_33},{t:this.shape_32},{t:this.shape_31},{t:this.shape_30},{t:this.shape_29},{t:this.shape_28},{t:this.shape_27},{t:this.shape_26},{t:this.shape_25},{t:this.shape_24},{t:this.shape_23},{t:this.shape_22},{t:this.shape_21},{t:this.shape_20},{t:this.shape_19},{t:this.shape_18},{t:this.shape_17},{t:this.shape_16},{t:this.shape_15},{t:this.shape_14},{t:this.shape_13},{t:this.shape_12},{t:this.shape_11},{t:this.shape_10},{t:this.shape_9},{t:this.shape_8},{t:this.shape_7},{t:this.shape_6},{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));


}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,-44.6,180.3,234.5);

// stage content:
(lib.crystal = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	if (lib.properties.type == "glass") {
		var scale = 2.1;
		// Layer 1
		this.instance = new lib.glasscrystals();
		this.instance.parent = this;
		this.instance.setTransform(162/scale,80/1.6,0.905/scale,1/scale,0,0,0,92.9,60.2);

		this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));
	} else {
		if (lib.properties.size <= 10) {
			// один кристалл
			this.instance_1 = new lib.icrystal();
			this.instance_1.parent = this;
			this.instance_1.setTransform(76,86,1,1,-2.2,0,0,40.5,28.9);

			this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(1));
		} else {
			// множество кристаллов
			this.instance = new lib.glassнаполовинуполный2();
			this.instance.parent = this;
			this.instance.setTransform(82.5,0,0.905,1,0,0,0,92.9,80.2);	
			
			this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));
		}
	}

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(98.4,132.8,163.2,234.5);

})(lib = lib||{}, images = images||{}, createjs = createjs||{}, ss = ss||{});
var lib, images, ss;


if (window.modelNS) {
	modelNS.IReact.libs.crystal = lib;
	lib = null;
}
