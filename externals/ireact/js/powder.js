(function (lib, img, cjs, ss) {

var p; // shortcut to reference prototypes

// library properties:
lib.properties = {
	width: 120,
	height: 80,
	scale:0.35,
	fps: 12,
	color: '#ffffff', // "rgba(91,202,229,0.5)",
	// color: "rgba(0,107,255,0.5)",
	opacity: 1.00,
	rod: false,	// стекляннаяпалочка
	
	down: true,
	state: 'liquid',
	size: 100,
	
	state: 'powder', // 'granules',	// 'cream', 'liquid', 'granules', 'powder'
	manifest: []
};

lib.ssMetadata = [];

// symbols:


(lib.стаканмерный = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});
	
	var rgba = colorToArray(lib.properties.color || lib.properties.defColor),
		color = 'rgba('+rgba.join(',')+')';
	
	// if (color) {
		// var rgb2 = rgb.slice(0);
		// rgb2[3] -= 0.2;
		// if (rgb2[3] > 0.5) rgb2[3] = 0.5;
	// }

	if (lib.properties.state == 'powder') {
		// тесто
		this.shape = new cjs.Shape();
		this.shape.graphics.f(color).s().p("AkJCmQlWhAAGgWQAGgWBnh2QBnh5C5gRQC6gRBoAMQDqAbBKBOIAKgLIBIA9QAzAtAxBSQAwBVgpgKQgqgLhWAmQg+AcilAAQkOAAjfgrg");
		this.shape.setTransform(76,146.5);

		this.shape_1 = new cjs.Shape();
		this.shape_1.graphics.f(color).s().p("ADXDRQkFgBjYgpIgIgBQlQhAAGgWQAGgVBlh1IADgDQBkh1CzgTIALgBQCtgPBmAJIARACIAnAFIABAAQCpAZAyBJIAMAEIAMAQIAJgEQAUAUAxAbIAIAEQA/AeAxBMQAIANAGAMQAbA2gZgCQgJACgRgBQgmAAg/AbIgXAJQhBAUiMABIgTAAg");
		this.shape_1.setTransform(75.9,146.5);

		this.shape_2 = new cjs.Shape();
		this.shape_2.graphics.f(color).s().p("ADcDRQkGgBjagpIgIgBQlRhAAGgWQAGgVBlh2IADgDQBlh1C0gSIALgBQCvgQBmALIARABIAoAGIABAAQCuAaAYBfIAKgCIAKASIAIABQAUAZA1APIAIADQBMAPAxBFIAOAYQAaAygQAEQgFAIgSgCQgmgDhBAbIgXAJQg+AWiQABIgTAAg");
		this.shape_2.setTransform(75.9,146.5);

		this.shape_3 = new cjs.Shape();
		this.shape_3.graphics.f(color).s().p("ADhDRQkIgBjbgpIgIgBQlThAAGgWQAGgWBmh1IADgDQBlh2C2gRIALgBQCwgQBmALIARACIApAGIABAAQCzAbgCB1IAJgJQADALAEAKIAHAHQAUAdA5ADIAJAAQBXAAAyA/QAIALAHAMQAZAugHAMQgCANgUgEQgkgGhDAbIgXAJQg9AZiSABIgTAAg");
		this.shape_3.setTransform(75.9,146.5);

		this.shape_4 = new cjs.Shape();
		this.shape_4.graphics.f(color).s().p("AkJCmQlWhAAGgWQAGgWBnh2QBnh5C5gRQC6gRBoAMIA7AIIABAAQC4AdgcCLIAIgPQAFBIBXgPQB9gSAxBSQAwBVgpgKQgqgLhWAmQg+AcilAAQkOAAjfgrg");
		this.shape_4.setTransform(76,146.5);

		this.shape_5 = new cjs.Shape();
		this.shape_5.graphics.f(color).s().p("ABtDCQjigCi7g1QkdhHABgiQACgiCrhPQBbhkCrgLQCpgKBtAQQAuAIAXAPIADgDQCaAlgJBxQAZgKALAIQAMBKBBgOQBigTAaBNQAdBLg9gJQhQgIhtAYQhdALh0AAIgogBg");
		this.shape_5.setTransform(73.7,146);

		this.shape_6 = new cjs.Shape();
		this.shape_6.graphics.f(color).s().p("AgKCyQi5gEiXhAQjmhNgCgtQgDguDxgqQBOhPCdgFQCagEBvAUQA8AOAUAZIADgFQB9AsAKBXQAtgMASAWQAUBNAsgNQBFgRAEBFQALBChSgHQh2gHiEALQicgDhvgFg");
		this.shape_6.setTransform(71.8,145.6);

		this.shape_7 = new cjs.Shape();
		this.shape_7.graphics.f(color).s().p("AHNC6QidgFiagCQjIgThYgGQiOgHhyhKQiuhSgHg7QgIg7E2gBQBDg8COACQCLADBxAYQBMATAPAiIAFgHQBeAzAeA+QBBgOAaAlQAaBPAXgMQAqgQgTA+QgHAzhWAAIgRgBg");
		this.shape_7.setTransform(70.5,146);

		this.shape_8 = new cjs.Shape();
		this.shape_8.graphics.f(color).s().p("AGVC+QjEgDixgQIk1grQhigJhOhTQh2hagMhHQgMhHF8AmQA3gnB/AJQB8AJBzAbQBbAZALAsIAGgKQBBA7AwAjQBVgPAiA0QAhBRACgLQAOgOgpA1QgYAshtAAIgQgBg");
		this.shape_8.setTransform(70.2,146.5);

		this.shape_9 = new cjs.Shape();
		this.shape_9.graphics.f(color).s().p("AFODSQjqgCjGgdQkngxgkgLQg3gLgqhfQg+hfgQhUQgRhUHBBOQArgTBwAPQBuAQB1AfQBpAeAIA2IAHgMQAjBABDAMQBpgTApBGQApBSgTgLQgOgMhAAuQgqAjiHAAIgLAAg");
		this.shape_9.setTransform(71.3,145.5);

		this.shape_10 = new cjs.Shape();
		this.shape_10.graphics.f(color).s().p("AjqDGQlWhAgLgOQgLgNgGhpQgGhmgVhgQgUhgIFB1QAgABBhAWQBfAWB4AjQB4AkADA+IAIgNQAFBIBXgPQB9gUAwBUQAxBVgqgKQgpgLhWAmQg+AcilAAQkOAAjfgrg");
		this.shape_10.setTransform(72.9,143.3);

		this.shape_11 = new cjs.Shape();
		this.shape_11.graphics.f(color).s().p("AA0DQQhjgIhdgOQjFghhjgVQgxgMgLgFQgXgNgRhRQgvhVgShLQgKgkBRgYQBPgZDVAWQAvAFAvAHQAvgDBOAPQAKAAAEACICGAdIBCAPQBsAZAcAtIAKgMQAKAdAcAJQAZAIAkgEQB7gPAUBiQAHAWACARQAUAkgRgEQgLgCgbAJQgMAFgQAQQgPAOgbAOQgXAbg3gBQgZAAggACQgkABglAEQgnACgpAAQhGAAhNgFg");
		this.shape_11.setTransform(71.1,145.5);

		this.shape_12 = new cjs.Shape();
		this.shape_12.graphics.f(color).s().p("ACPDHQhkgGhbgLQi5gZhxgXQgsgKgSgGQgjgMgbg5QhZhEgOg1QgLgdA7gxQA5gyDeABQAuABAsACQA9gHA8AHIALAAICIAYQAfAGAkAEQBgARAzAZIANgIQAQARAeAFQAcADAggCQB5gJgJByQACAUgDATQAWAcgEAAQAFACgIAGQABACgDATQgDAQgNAXQgDAvgygEQgYgCggAEQgjADgmAJQg/AJhWAAQglAAgqgCg");
		this.shape_12.setTransform(69.4,146.8);

		this.shape_13 = new cjs.Shape();
		this.shape_13.graphics.f(color).s().p("ADGDLQhkgDhegIQiqgSh/gZIg/gOQgwgMglghQiDg1gLgfQgLgTAkhLQAjhLDngUIBWgGQBNgMApABIAIgCICJASQAfAEAmADICfANIAPgFQAXAGAgAAIA7gCQB2gCgmCDQgDATgHASQAXAVAJADQAWAIALABQAOgBAKAXQAIASABAfQASBDgugHQgXgEghAGQghAFgoANQhEASh+AAIghAAg");
		this.shape_13.setTransform(71.5,146.8);

		this.shape_14 = new cjs.Shape();
		this.shape_14.graphics.f(color).s().p("AkACuQlVhBgLgNQgLgOANhiQAOhkDugpQDmgngcgDQAhACBtALQBrAKDUgjQDQgih6DcQBDAgAxgFQAwgDAlBWQAmBXgqgLQgpgKhWAmQg/AbilAAQkOAAjfgqg");
		this.shape_14.setTransform(75.1,145.8);

		this.shape_15 = new cjs.Shape();
		this.shape_15.graphics.f(color).s().p("Aj1CsQlWhAgLgOQgLgNAOhiQANhlDvgpQDlgngcgDQAhACBsALQBpALCwggQCtggg5DTQBCAfArAAQAqgBAmBSQAlBRglgFQglgGhOAkQg5AbilAAQkOAAjfgrg");
		this.shape_15.setTransform(74,145.9);

		this.shape_16 = new cjs.Shape();
		this.shape_16.graphics.f(color).s().p("AjrCrQlVhBgLgNQgLgOANhiQAOhkDugpQDlgogbgCQAgACBoALQBqALCNgeQCKgeAHDLQBAAhAmACQAkACAmBNQAmBMgggBQghgBhGAiQg1AailAAQkOAAjfgqg");
		this.shape_16.setTransform(73,146.1);

		this.shape_17 = new cjs.Shape();
		this.shape_17.graphics.f(color).s().p("AjhCpQlVhBgLgNQgLgOANhiQAOhkDugpQDlgogbgCQAgACBnALQBoALBpgbQBngbBHDBQBAAhAfAHQAfAEAmBIQAmBHgcAEQgcADg/AhQgvAZilAAQkOAAjfgqg");
		this.shape_17.setTransform(72,146.3);

		this.shape_18 = new cjs.Shape();
		this.shape_18.graphics.f(color).s().p("AjWCnQlWhAgLgOQgLgNAOhiQANhlDvgpQDlgngcgDQAhACBlAMQBmALBGgZQBDgZCHC5QBAAgAZALQAZAIAmBDQAnBCgYAIQgXAIg3AfQgqAZilAAQkQAAjdgrg");
		this.shape_18.setTransform(70.9,146.4);

		this.shape_19 = new cjs.Shape();
		this.shape_19.graphics.f(color).s().p("AjNCmQlVhBgLgNQgLgOANhiQAOhkDugpQDlgogbgCQAgACBjALQBlALAigWQAhgWDHCwQA+AgAUAOQATANAnA9QAmA9gSAMIhDAqQglAYilAAQkQAAjdgqg");
		this.shape_19.setTransform(70,146.6);

		this.shape_20 = new cjs.Shape();
		this.shape_20.graphics.f(color).s().p("AjDCmQlVhBgLgNQgLgOANhiQAOhkDugpQDlgogbgCQAgACBiALQBjAMgCgUQgCgUEHCnQA+AgANASIA1BIQAnA4gPARQgOARgoAcQggAXilAAQkQAAjdgqg");
		this.shape_20.setTransform(69,146.6);

		this.shape_21 = new cjs.Shape();
		this.shape_21.graphics.f(color).s().p("Ai5CmQlWhBgLgNQgLgOAOhiQANhkDvgpQDlgogcgCQAhACBgAMQBSAJgOgLIEaCJQA9AfAHAWQAHAUAoAyQAnAzgKAWQgKAWggAZQgaAXilAAQkQAAjdgqgABrjHIAIAEQgSgJAKAFg");
		this.shape_21.setTransform(68,146.6);

		this.shape_22 = new cjs.Shape();
		this.shape_22.graphics.f(color).s().p("AiwCmQlVhBgLgNQgLgOANhiQAOhkDugpQDlgogbgCQAgACBeAMIAVACQgTgKAWAEQA/ANhCgHQAvAYETBpQA7AfACAaQABAYAoAtQAoAtgFAbQgGAagYAYQgWAWilAAQkQAAjdgqg");
		this.shape_22.setTransform(67.1,146.6);

		this.shape_23 = new cjs.Shape();
		this.shape_23.graphics.f(color).s().p("AinCmQlVhBgLgNQgLgOANhiQAOhkDugpQDlgogcgCQAhACBcALQBfAMhtgMQhqgMHHCNQA7AegFAeQgEAbAoAoQAoAogBAfQgBAggQAWQgRAVilAAQkQAAjdgqg");
		this.shape_23.setTransform(66.2,146.6);

		this.shape_24 = new cjs.Shape();
		this.shape_24.graphics.f(color).s().p("AizCjQlWhAgLgOQgLgNAOhgQAPhiDxgcQDogaACgLQAigPBeAIIALABQgsgQAgAFQBLANg/gCQBFAZECBQQA5AXAEAfQAEAfAdA0QAcA2gTAeQgSAdgRAWQgQAWilAAQkQAAjdgrg");
		this.shape_24.setTransform(67.4,146.8);

		this.shape_25 = new cjs.Shape();
		this.shape_25.graphics.f(color).s().p("AjFCnQlWhAgLgOQgLgNAPhdQAPhgD0gOQDsgOAfgTQAhgfBhAEQA1gEgXgKIE5BgQA3AQAMAhQANAhARBBQARBDglAdQgkAcgRAWQgQAWilAAQkQAAjdgrgAB7jPIARAGQglgMAUAGg");
		this.shape_25.setTransform(69.2,146.4);

		this.shape_26 = new cjs.Shape();
		this.shape_26.graphics.f(color).s().p("AjaCrQlWhAgLgOQgLgNAQhbQAPhcD3gCQDwgBA8gbQAigwBiAAQA1gMgbgSQgbgRFdBqQA1AIAVAjQAUAjAGBPQAFBRg2AbQg2AbgRAWQgQAWilAAQkQAAjdgrg");
		this.shape_26.setTransform(71.3,146);

		this.shape_27 = new cjs.Shape();
		this.shape_27.graphics.f(color).s().p("AjyCwQlWhBgLgNQgLgOAQhYQAQhaD6ALQD0AMBWgjQAmhBBkgDQAngUAAgUQAAgTE5BfQAzABAdAlQAdAkgGBdQgGBfhIAZQhIAagRAWQgQAVilAAQkOAAjfgqg");
		this.shape_27.setTransform(73.7,145.6);

		this.shape_28 = new cjs.Shape();
		this.shape_28.graphics.f(color).s().p("AkMC0QlWhBgLgNQgLgOARhXQARhWD8AYQD3AZB0grQAnhSBlgHQAagcAagVQAbgVEWBTQAxgGAlAmQAmAngSBqQgSBshaAZQhZAYgRAWQgQAVilAAQkOAAjfgqg");
		this.shape_28.setTransform(76.3,145.2);

		this.shape_29 = new cjs.Shape();
		this.shape_29.graphics.f(color).s().p("AknC4QlVhAgLgOQgLgNARhVQARhTEAAlQD7AmCQgzQAohjBngLQAMgkA2gXQA1gXDyBIQAvgOAuApQAuAogdB4QgeB6hrAXQhsAWgQAWQgRAWilAAQkOAAjfgrg");
		this.shape_29.setTransform(79,144.7);

		this.shape_30 = new cjs.Shape();
		this.shape_30.graphics.f(color).s().p("AlBC9QlWhBgLgNQgLgOAShSQAShRECAzQD/AwCug5QAohzBpgQQgCgsBRgYQBQgZDOA9QAtgVA3AqQA2AqgpCGQgpCHh9AWQh9AVgRAWQgQAVilAAQkOAAjfgqg");
		this.shape_30.setTransform(81.6,144.3);

		this.shape_31 = new cjs.Shape();
		this.shape_31.graphics.f(color).s().p("AlcDBQlWhAgLgOQgLgNAThQQAShOEFA9QEDBADKhDQAqiDBrgTQgQg0BrgaQBsgaCqAwQArgcA/AsQA/Asg1CTQg1CViOAVQiPATgRAWQgQAWilAAQkOAAjfgrg");
		this.shape_31.setTransform(84.3,143.8);

		this.shape_32 = new cjs.Shape();
		this.shape_32.graphics.f(color).s().p("Al3DHQlVhBgLgNQgLgOAThNQAThLEIBKQEGBMDohLQAriTBrgXQgdg8CGgcQCHgcCHAlQApgkBHAuQBHAuhACjQhBChigASQihATgQAWQgRAVilAAQkOAAjfgqg");
		this.shape_32.setTransform(87,143.3);

		this.shape_33 = new cjs.Shape();
		this.shape_33.graphics.f(color).s().p("AmSDRQlVhBgLgNQgLgOAUhKQAThJELBXQEKBZEEhTQAtikBtgbQgrhEChgdQCigeBiAZQAngrBQAwQBQAvhMCxQhMCuiyASQizARgQAWQgRAVilAAQkOAAjfgqg");
		this.shape_33.setTransform(89.7,142.3);

		this.shape_34 = new cjs.Shape();
		this.shape_34.graphics.f(color).s().p("AmtDdQlVhAgLgOQgLgNAUhIQAVhHENBlQEOBmEhhcQAui0BugfQg4hMC8gfQC8ggA/AOQAlgyBZAxQBYAxhYC+QhYC9jEAQQjEAQgQAVQgRAWilAAQkOAAjfgrg");
		this.shape_34.setTransform(92.4,141);

		this.shape_35 = new cjs.Shape();
		this.shape_35.graphics.f(color).s().p("AmhDNQlWhAgLgOQgLgNAVhIQAUhHEOBlQD6BfEMhOQAjiZBbgfQhfiJDbgKQDagLAdAOQA8gOBrAiQBrAhhMC0QhNCzjEAQQjEAPgRAWQgQAWilAAQkOAAjfgrg");
		this.shape_35.setTransform(91.2,142.6);

		this.shape_36 = new cjs.Shape();
		this.shape_36.graphics.f(color).s().p("AmXDOQlVhAgLgOQgLgNAUhIQAVhHENBlQDnBXD4g+QAXh+BHghQiBjFD2ALQD4AJgFAPQBTAXB+ARQB9ARhBCpQhCCrjEAQQjEAPgQAWQgRAWilAAQkOAAjfgrg");
		this.shape_36.setTransform(90.2,142.5);

		this.shape_37 = new cjs.Shape();
		this.shape_37.graphics.f(color).s().p("AmODTQlVhBgLgNQgLgOAUhIQAVhGENBkQDVBRDkgxQAKhkAzgfQimkCETAfQEWAfgnAOQBrA8CQABQCQABg2CfQg3CijEAPQjEAQgQAWQgRAVilAAQkOAAjfgqg");
		this.shape_37.setTransform(89.3,142.1);

		this.shape_38 = new cjs.Shape();
		this.shape_38.graphics.f(color).s().p("AmFDYQlWhBgLgNQgLgOAVhIQAUhGEOBkQDBBKDPgjQAAhIAhgjQjOk8ExA0QE0A0hJAOQCCBhCjgQQCigPgrCWQgrCYjEAPQjEAQgRAWQgQAVilAAQkOAAjfgqg");
		this.shape_38.setTransform(88.4,141.6);

		this.shape_39 = new cjs.Shape();
		this.shape_39.graphics.f(color).s().p("Al9DdQlWhAgLgOQgLgNAVhIQAUhHEOBlQCuBCC6gUQgMgtAOgkQjzl4FPBIQFRBJhrAOQCaCGC1ggQC1ggggCNQggCOjEAQQjEAPgRAWQgQAWilAAQkOAAjfgrg");
		this.shape_39.setTransform(87.6,141);

		this.shape_40 = new cjs.Shape();
		this.shape_40.graphics.f(color).s().p("Al2DiQlWhAgLgOQgLgNAVhIQAUhHENBlQCcA7CkgGQgWgRgGglQkZm1FvBdQFtBeiNAOQCxCoDIgtQDIgwgVCDQgVCEjEAQQjEAQgRAVQgQAWilAAQkOAAjfgrg");
		this.shape_40.setTransform(86.9,140.5);

		this.shape_41 = new cjs.Shape();
		this.shape_41.graphics.f(color).s().p("AljDGIgVgEQlOg/gPgOQgLgNAVhHIABgEQAKgcA1ABQAngPBzAhQBaAQCgAOIA0ACQgMgNAAgbQhdjaBbgdQAygJBuAiQE+BdhMABQA5AoA8ATQCCAqB/geQBygcAgApQAZAbgNAyQgXBiiBAbQghAHgmADQhzAJgtANQgjAJgQAJQgUAPhtACIgzABQj+gBjUgng");
		this.shape_41.setTransform(86.7,143.6);

		this.shape_42 = new cjs.Shape();
		this.shape_42.graphics.f(color).s().p("AllCrIgVgEQlLg+gOgOQgLgOAUhGIACgEQAKgbAzABQAFgjBPAMQAzgSC3AYIAzAEQgCgHAHgUQgBiSBUgBQAxAKBhAjQEPBdgLgLQA6AZA+AHQCHANB0gbQB0gcAUAyQARAfgPAtQgfBaiCAXQgiAGgkADQh3AKglANIg1ASQgaANhmABIgxABQj7gCjSgmg");
		this.shape_42.setTransform(86.5,146.3);

		this.shape_43 = new cjs.Shape();
		this.shape_43.graphics.f(color).s().p("ABfC9Qj5gCjPgnIgVgEQlIg+gNgNQgKgNAThEIABgEQAKgdAzAAQgdg2AqgKQALg1DPAjIAyAHQAIgDAOgKQBbhLBMAbQAxAeBUAlQDfBcA3gYQA8AMBAgHQCLgOBpgZQB2gcAJA8QAJAjgSAnQgnBRiCATQgjAFgiADQh7ALgeAQQgWAKggAHQggAKhfABIgwAAg");
		this.shape_43.setTransform(86.5,148.5);

		this.shape_44 = new cjs.Shape();
		this.shape_44.graphics.f(color).s().p("ABVDHQj2gDjNgmIgVgEQlFg+gLgNQgLgNAThDIACgFQAJgdAyAAQg/hJAFggQgchYDmAuIAxAJQATACAUgCQC4gBBEA3QAwAxBHAmQCxBaB3gkQA9gDBDgTQCPgpBegWQB4gcgCBFQABAlgVAkQguBIiDAPIhEAHQiAANgVAQQgQALgoAGQgnAIhXAAIgvAAg");
		this.shape_44.setTransform(86.6,147.5);

		this.shape_45 = new cjs.Shape();
		this.shape_45.graphics.f(color).s().p("AlSC+QlWhAgLgOQgLgNAVhJQAIgbAygBQk4klFxBRQFyBSBHBhQC9ERFpitQFqiqgVCCQgVCFjEAQQjEAPgRAWQgQAWilAAQkOAAjfgrg");
		this.shape_45.setTransform(83.3,144.1);

		this.shape_46 = new cjs.Shape();
		this.shape_46.graphics.f(color).s().p("ABuDLQkKAAjcgqIgNgCQlBg9gKgLIgBgBQgEgKAgg2QAOgWAuAAQgIgMgGgNQhfiLB1gaQAvgQBTAGQE+AaB6BFIAZAWQDcCZCSgOQAigNAigQQEBh2AuAyQAWAQgIAjQgaBsiZAWIgsAFQiRAMgoAQQgPAGgJAGQgXARiJABIgTAAg");
		this.shape_46.setTransform(87.4,147.1);

		this.shape_47 = new cjs.Shape();
		this.shape_47.graphics.f(color).s().p("ABmC7QkGgBjagpIgLgCQlIg+ADgIIgBAAQADgHAsglQASgPAsAAQACgJAGgGQgGhdBlgrQAsgbBHgKQELgdCqAoIAcAOQESBkACBQIBCgdQEKh3AYBIQANAVgKAfQghBjiYATIgrAFQiVAMgfARIgaAMQgeAPiAABIgSAAg");
		this.shape_47.setTransform(87.8,148.7);

		this.shape_48 = new cjs.Shape();
		this.shape_48.graphics.f(color).s().p("ABdDEQkCgBjXgoIgLgCQlPg/AQgFIAAAAIBCgWQAXgIAoAAIAegJQBTguBVg6QAqgnA7gZQDYhUDdAMIAfAGQFGAriPCxIA/gdQETh4ADBfQAEAYgMAcQgoBaiXAQIgqAEQiZAOgXASQgJAHgSAFQglAMh3AAIgRAAg");
		this.shape_48.setTransform(88.3,147.8);

		this.shape_49 = new cjs.Shape();
		this.shape_49.graphics.f(color).s().p("AmLCvQlVhBAdgBIDJgCQCsgBBGhLQC0jqF4gNQF6gMkgEQQFciigVCAQgVCFjEAPQjEAQgQAWQgRAVilAAQkOAAjfgqg");
		this.shape_49.setTransform(89,145.7);

		this.shape_50 = new cjs.Shape();
		this.shape_50.graphics.f(color).s().p("ABhDNQkLAAjdgqIgEgBQlVhAAdgBICvgCIAVgDQCPgSA+hKQA7hWBognQCfhMDsgCQFcgGjLDiIgNANQFDiVADBnIgBAQQgVB+i3ASIgOACQirAOghASIgIAGQgTAUiZABIgKAAg");
		this.shape_50.setTransform(89,146.9);

		this.shape_51 = new cjs.Shape();
		this.shape_51.graphics.f(color).s().p("ABgDAQkLAAjdgqIgEgBQlUhAAdgBICugCIASgFQBxgkA2hHQAzhYBzgWQChg2DoADQFLAAiTDEIgIALQFCiVABBqQAAAIgCAJQgWB8i2ASIgPABQisAOgfATIgJAGQgUATiXABIgKAAg");
		this.shape_51.setTransform(89,148.2);

		this.shape_52 = new cjs.Shape();
		this.shape_52.graphics.f(color).s().p("ABgC0QkLAAjdgqIgEgBQlUhAAdgBICvgCIANgHQBUg1AuhGQArhZB9gDQCjgiDlAJQE5AFhaCqIgFAGQFEiWgDBtIgBASQgYB6i3ARIgOACQitAOgdATIgJAGQgXATiVAAIgJAAg");
		this.shape_52.setTransform(88.9,149.4);

		this.shape_53 = new cjs.Shape();
		this.shape_53.graphics.f(color).s().p("ABfCrQkLAAjcgqIgEgBQlUhAAdgBICvgCIAIgJQA3hFAmhHQAjhaCIAPQCjgNDkAOQEmALghCNIgBAFQFFiXgGBwIgCARQgYB5i3ARIgOABQivAPgbATIgJAGQgZASiTABIgJAAg");
		this.shape_53.setTransform(88.9,150.3);

		this.shape_54 = new cjs.Shape();
		this.shape_54.graphics.f(color).s().p("ABeCsQkKAAjcgqIgEgBQlUhAAdgBQAagBCUAAIAFgMQAZhWAdhFQAchbCTAgQCkAIDhAUQEVARAXBvIAEADQFEiYgIBzIgCARQgZB4i4ARIgOABQixAOgYAUIgKAHQgaARiRAAIgJAAg");
		this.shape_54.setTransform(88.9,150.2);

		this.shape_55 = new cjs.Shape();
		this.shape_55.graphics.f(color).s().p("ABcCyQkKgBjbgpIgEgBQlThAAdgBQAagBCUgBIAAgOQgFhnAWhEQAUhcCdAyQClAdDfAaQEDAWBQBSIAHAAQFGiXgLB2IgDARQgaB2i4AQIgOABQiyAPgXAUQgDAEgGADQgdARiOAAIgKAAg");
		this.shape_55.setTransform(89,149.6);

		this.shape_56 = new cjs.Shape();
		this.shape_56.graphics.f(color).s().p("ABcC4QkKgBjbgqIgEgBQlTg/AdgBQAagBCUgBIgEgQQgih5ANhDQAMhcCoBEQCmAyDdAfQDxAcCIA0IAMgEQFGiVgOB5IgDARQgbB1i4APIgOACQi0APgUAUQgEAEgGADQgfAQiMAAIgJAAg");
		this.shape_56.setTransform(88.9,149);

		this.shape_57 = new cjs.Shape();
		this.shape_57.graphics.f(color).s().p("ABaC/QkJgBjbgqIgEgBQlSg/AdgBQAagBCTgBIgIgSQhAiLAGhBQAEhdCyBVQCnBHDdAlQDdAiDBAWIAQgGQFGiVgRB8IgDAQQgcB1i4APIgOABQi1APgSAVQgEADgHADQggAQiLAAIgJAAg");
		this.shape_57.setTransform(89,148.3);

		this.shape_58 = new cjs.Shape();
		this.shape_58.graphics.f(color).s().p("AmLCbQlVhAAdgBICtgCQj6mZFHCyQFGCwIBgJQFciigVCDQgVCCjEAQQjEAQgQAVQgRAWilAAQkOAAjfgrg");
		this.shape_58.setTransform(89,147.6);

		this.shape_59 = new cjs.Shape();
		this.shape_59.graphics.f(color).s().p("AmQCUQlQg/AdgFQAagFCcACQjRl5FMCbQFLCaHUgGQFNiRgVCCQgVCCjEAQQjEAPgSAUQgRATipACIgSABQj+AAjcgrg");
		this.shape_59.setTransform(89,148.2);

		this.shape_60 = new cjs.Shape();
		this.shape_60.graphics.f(color).s().p("AmWCOQlKg+AdgJQAbgKCkAGQiplZFRCFQFRCEGogCQE9iCgVCCQgVCBjEAPQjEAPgTASQgTASitADIghAAQjwAAjagpg");
		this.shape_60.setTransform(89,148.7);

		this.shape_61 = new cjs.Shape();
		this.shape_61.graphics.f(color).s().p("AmcCHQlEg8AdgOQAcgOCsAJQiBk4FXBtQFVBtF8ACQEuhxgVCBQgVCBjEAPQjEAOgUARQgVAPiwAFIgvABQjjAAjZgpg");
		this.shape_61.setTransform(89,149.2);

		this.shape_62 = new cjs.Shape();
		this.shape_62.graphics.f(color).s().p("AmhCBQk/g7AdgSQAcgSC1ALQhYkWFcBVQFaBWFPAFQEfhfgVCAQgVCAjEAPQjEAOgWAPQgVAOi1AGIg+ABQjWAAjVgog");
		this.shape_62.setTransform(89,149.7);

		this.shape_63 = new cjs.Shape();
		this.shape_63.graphics.f(color).s().p("AmnB7Qk6g6AegWQAcgXC+APQgwj2FiA+QFfA/EiAJQEPhOgUCAQgVB/jEAOQjEAOgXANQgYAMi4AIIhCABQjRAAjVgng");
		this.shape_63.setTransform(89,150.2);

		this.shape_64 = new cjs.Shape();
		this.shape_64.graphics.f(color).s().p("AmtB1Qk0g4AegbQAdgaDGASQgIjWFnAoQFlAnD1AMQEAg9gUCAQgVB+jEAOQjEAOgZALQgYAKi8AJQgoACgmAAQjHAAjTgng");
		this.shape_64.setTransform(89,150.6);

		this.shape_65 = new cjs.Shape();
		this.shape_65.graphics.f(color).s().p("AmyBwQkvg3AfgfQAcgcDPASQAhi0FsAQQFrAQDHAPQDxgrgUB/QgVB+jEAOQjEANgaAJQgaAIi/ALQgrACgpAAQjAAAjTgmg");
		this.shape_65.setTransform(89,151);

		this.shape_66 = new cjs.Shape();
		this.shape_66.graphics.f(color).s().p("Am4BuQkpg2AfgjQAdggDXAVQBJiTFygIQFwgHCaATQDigagUB/QgVB9jEANQjEAOgbAGQgcAHjDAMQguADgvAAQi4AAjRgmg");
		this.shape_66.setTransform(89,151.1);

		this.shape_67 = new cjs.Shape();
		this.shape_67.graphics.f(color).s().p("Am+BzQkjg0AfgnQAeglDfAYQBxhyF2gfQF4gfBsAXQDTgJgUB+QgVB9jEANQjEANgdAFQgcAFjHAOQgvADg0AAQiyAAjRgmg");
		this.shape_67.setTransform(89,150.4);

		this.shape_68 = new cjs.Shape();
		this.shape_68.graphics.f(color).s().p("AnEB6QkdgzAfgsQAegpDoAcQCZhSF7g2QF9g2BAAbQDEAIgVB+QgVB7jEANQjEANgdADIjpASQgyAEg3AAQisAAjQglg");
		this.shape_68.setTransform(89.1,149.6);

		this.shape_69 = new cjs.Shape();
		this.shape_69.graphics.f(color).s().p("AnJCBQkYgyAfgvQAeguDxAfQDCgxGAhNQGDhNASAeQC1AZgVB9QgVB7jEANQjEANgfABQgfAAjPASQgyAEg6AAQinAAjQglg");
		this.shape_69.setTransform(89.1,148.8);

		this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape}]}).to({state:[{t:this.shape_1}]},1).to({state:[{t:this.shape_2}]},1).to({state:[{t:this.shape_3}]},1).to({state:[{t:this.shape_4}]},1).to({state:[{t:this.shape_5}]},1).to({state:[{t:this.shape_6}]},1).to({state:[{t:this.shape_7}]},1).to({state:[{t:this.shape_8}]},1).to({state:[{t:this.shape_9}]},1).to({state:[{t:this.shape_10}]},1).to({state:[{t:this.shape_11}]},1).to({state:[{t:this.shape_12}]},1).to({state:[{t:this.shape_13}]},1).to({state:[{t:this.shape_14}]},1).to({state:[{t:this.shape_15}]},1).to({state:[{t:this.shape_16}]},1).to({state:[{t:this.shape_17}]},1).to({state:[{t:this.shape_18}]},1).to({state:[{t:this.shape_19}]},1).to({state:[{t:this.shape_20}]},1).to({state:[{t:this.shape_21}]},1).to({state:[{t:this.shape_22}]},1).to({state:[{t:this.shape_23}]},1).to({state:[{t:this.shape_24}]},1).to({state:[{t:this.shape_25}]},1).to({state:[{t:this.shape_26}]},1).to({state:[{t:this.shape_27}]},1).to({state:[{t:this.shape_28}]},1).to({state:[{t:this.shape_29}]},1).to({state:[{t:this.shape_30}]},1).to({state:[{t:this.shape_31}]},1).to({state:[{t:this.shape_32}]},1).to({state:[{t:this.shape_33}]},1).to({state:[{t:this.shape_34}]},1).to({state:[{t:this.shape_35}]},1).to({state:[{t:this.shape_36}]},1).to({state:[{t:this.shape_37}]},1).to({state:[{t:this.shape_38}]},1).to({state:[{t:this.shape_39}]},1).to({state:[{t:this.shape_40}]},1).to({state:[{t:this.shape_41}]},1).to({state:[{t:this.shape_42}]},1).to({state:[{t:this.shape_43}]},1).to({state:[{t:this.shape_44}]},1).to({state:[{t:this.shape_45}]},1).to({state:[{t:this.shape_46}]},1).to({state:[{t:this.shape_47}]},1).to({state:[{t:this.shape_48}]},1).to({state:[{t:this.shape_49}]},1).to({state:[{t:this.shape_50}]},1).to({state:[{t:this.shape_51}]},1).to({state:[{t:this.shape_52}]},1).to({state:[{t:this.shape_53}]},1).to({state:[{t:this.shape_54}]},1).to({state:[{t:this.shape_55}]},1).to({state:[{t:this.shape_56}]},1).to({state:[{t:this.shape_57}]},1).to({state:[{t:this.shape_58}]},1).to({state:[{t:this.shape_59}]},1).to({state:[{t:this.shape_60}]},1).to({state:[{t:this.shape_61}]},1).to({state:[{t:this.shape_62}]},1).to({state:[{t:this.shape_63}]},1).to({state:[{t:this.shape_64}]},1).to({state:[{t:this.shape_65}]},1).to({state:[{t:this.shape_66}]},1).to({state:[{t:this.shape_67}]},1).to({state:[{t:this.shape_68}]},1).to({state:[{t:this.shape_69}]},1).wait(1));
	}
	

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,-138.5,188.5,328.4);


// stage content:

(lib.powder = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});
	
	// Слой 1
	this.instance = new lib.стаканмерный();
	this.instance.parent = this;
	this.instance.setTransform(63.2,0,0.705,0.705,0,0,0,90.7,63);
	
	this.playClip = this.instance;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(70));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(139.3,189.8,133.1,231.8);

})(lib = lib||{}, images = images||{}, createjs = createjs||{}, ss = ss||{});
var lib, images, ss;

if (window.modelNS) {
	modelNS.IReact.libs.powder = lib;
	lib = null;
}