// I3dPreview
function I3dPreviewModel(xmlData, wrapper, basePath, params) {

    var model;

    this.init = function () {

        model = new modelNS.I3dPreview({
            xmlData: xmlData,
            wrapper: wrapper,
            basePath: basePath,
            restyling: true,
            // scalable: false,
            // defaults: {},
            width: wrapper.data('width'),
            height: wrapper.data('height'),
            params: params
        });
        return new modelNS.I3dPreviewView({ model: model }).render();
    };
}

modelNS.I3dPreview = modelNS.BaseModel.extend({
    initialize: function (options) {
        modelNS.BaseModel.prototype.initialize.apply(this, arguments);
    },
    parseXML: function(xmlData) {
    	modelNS.BaseModel.prototype.parseXML.apply(this, arguments);
      var $xml = $(typeof(xmlData) == 'string' ? $.parseXML(xmlData) : xmlData),
					$root = $xml.find('i3dpreview'),
					src = $root.attr('src'),
          shadow = $root.attr('shadow') == 'false' ? false : true,
          bgcolor = $root.attr('bgcolor'),
          scale = $root.attr('scale'),
          cubemap = $root.attr('cubemap'),
          grid = $root.attr('grid') == 'true' ? true : false,
          $meshes = $root.find('mesh'),
          meshes = [];

  		this.src = src;
  		this.bgcolor = bgcolor;
  		this.shadow = bgcolor;
  		this.scale = scale && scale*1;
  		this.cubemap = cubemap;

      $meshes.each(function () {
        var $mesh = $(this),
            $material = $mesh.find('material'),
            $rotation = $mesh.find('rotation'),
            mesh = {
              type: $mesh.attr('type'),
              width: $mesh.attr('width')*1,
              height: $mesh.attr('height')*1,
              material: $material.attr('type'),
              map: $material.attr('map'),
              color: $material.attr('color'),
              rotation: {
                x: $rotation.attr('x')*1,
                y: $rotation.attr('y')*1,
                z: $rotation.attr('z')*1
              },
              receiveShadow: $mesh.attr('receiveShadow') == "true" ? true : false,
            };
        meshes.push(mesh);
      });

      this.meshes = meshes;
    }
});

modelNS.I3dPreviewView = modelNS.BaseModelView.extend({
    // events: {
    //    'onmouseenter .i3dpreview canvas': 'enableControls',
    //    'onmouseleave .i3dpreview canvas': 'disableControls',
    // },

    initialize: function () {
        modelNS.BaseModelView.prototype.initialize.apply(this, arguments);
    },
    render: function () {
        var self = this;

        modelNS.BaseModelView.prototype.render.apply(this);

		    this.renderScenePane();

        return this;
    },

	renderScenePane: function() {
    var self = this;

		this.scenePane = new modelNS.SingleLayout({
			title: false,
			parent: this.$el
		}).render();

		this.renderScene();

    this.scenePane.$el.on({
      'mouseenter': function () {self.enableControls()},
      'mouseleave': function () {self.disableControls()},
    })
    // this.scenePane.on('mouseleave', this.disableControls, this)
	},

  enableControls: function () {
    if (this.OrbitControls) {
      this.OrbitControls.enabled = true;
      // this.OrbitControls.update();
    }
  },

  disableControls: function () {
    if (this.OrbitControls) {
      this.OrbitControls.enabled = false;
      // this.OrbitControls.update();
    }
  },

	renderScene: function () {
    var self = this;

		if ( WEBGL.isWebGLAvailable() === false ) {
				this.scenePane.$el.appendChild( WEBGL.getWebGLErrorMessage() );
			}

			var container, stats, controls;
			var camera, scene, renderer, light;

			var clock = new THREE.Clock();

			var mixer;

			camera = new THREE.PerspectiveCamera( 45, this.model.width / this.model.height, 1, 2000 );
			camera.position.set( 100, 200, 300 );

			controls = new THREE.OrbitControls( camera );
			controls.target.set( 0, 100, 0 );
			controls.maxDistance = 400;  // TODO: xml settings
			controls.minDistance = 200;
      controls.enabled = false;
			controls.update();

      this.OrbitControls = controls;

			scene = new THREE.Scene();
			scene.background = new THREE.Color( this.model.bgcolor || 0xa0a0a0 );
			// scene.fog = new THREE.Fog( 0xa0a0a0, 200, 1000 );

			light = new THREE.HemisphereLight( 0xffffff, 0x444444 );
			light.position.set( 0, 200, 0 );
			scene.add( light );

			light = new THREE.DirectionalLight( 0xffffff );
			light.position.set( 0, 200, 100 );
			light.castShadow = true;
			light.shadow.camera.top = 180;
			light.shadow.camera.bottom = - 100;
			light.shadow.camera.left = - 120;
			light.shadow.camera.right = 120;
			scene.add( light );

      this.renderMeshes(scene);


      if (this.model.grid) {
        var grid = new THREE.GridHelper( 2000, 20, 0x000000, 0x000000 );
        grid.material.opacity = 0.2;
        grid.material.transparent = true;
        scene.add( grid );
      }


      /////////////////

      // cubemap
      // TODO: отдельно cubemap в xml гененрировать
      if (this.model.cubemap) {
        var path = this.model.basePath + '/' + this.model.cubemap;
  			var format = '.jpg';
  			var urls = [
  				path + 'px' + format, path + 'nx' + format,
  				path + 'py' + format, path + 'ny' + format,
  				path + 'pz' + format, path + 'nz' + format
  			];

  			var reflectionCube = new THREE.CubeTextureLoader().load( urls );
  			reflectionCube.format = THREE.RGBFormat;

  			//materials
  			var cubeMaterial1 = new THREE.MeshLambertMaterial( { color: 0xffffff, envMap: reflectionCube, transparent:1, opacity:0.4 } );
      }


			// model
      // TODO: отдельно в xml объект обозначать
			var loader = new THREE.FBXLoader();
			loader.setResourcePath( '' );
			loader.load(this.model.basePath + '/' + this.model.src, function ( object ) {

				object.traverse( function ( child ) {

					if ( child instanceof THREE.Mesh ) {
            // console.log(child);

						if (self.model.cubemap) {
              child.material = cubeMaterial1;
            }

            if (self.model.shadow) {
              child.castShadow = true;
  						child.receiveShadow = true;
            }

            if (self.model.scale) {
              child.scale.x = child.scale.y = child.scale.z = self.model.scale;
            }

					}

				} );

        // var mesh = new THREE.Mesh( object.geometry, customMaterial );
				// scene.add( mesh );

				scene.add( object );

			} );

			renderer = new THREE.WebGLRenderer( { antialias: true } );
			renderer.setPixelRatio( window.devicePixelRatio );
			renderer.setSize( this.model.width, this.model.height );
			renderer.shadowMap.enabled = true;

			this.scenePane.$el.append( renderer.domElement );

			function animate() {
				requestAnimationFrame( animate );
				var delta = clock.getDelta();
				if ( mixer ) mixer.update( delta );
				renderer.render( scene, camera );
			}

			animate();
	},

  renderMeshes: function (scene) {
    var meshes = this.model.meshes;
    for (var i=0; i<meshes.length; i++) {
      this.renderMesh(meshes[i], scene);
    }
  },

  renderMesh: function (mesh, scene) {
      var texture = new THREE.ImageUtils.loadTexture(this.model.basePath + '/' + mesh.map ),
          material = new THREE[mesh.material]( { color: mesh.color, map: texture } ),
          object = new THREE.Mesh( new THREE.PlaneBufferGeometry( mesh.width, mesh.height ), material );


      if (mesh.rotation.x) object.rotation.x = Math.radians(mesh.rotation.x);
      if (mesh.rotation.y) object.rotation.y = Math.radians(mesh.rotation.y);
      if (mesh.rotation.z) object.rotation.z = Math.radians(mesh.rotation.z);

      if (mesh.receiveShadow) object.receiveShadow = true;

      scene.add( object );
  }


})
