define([
  'three', 'ship', 'asteroid', 'sun', 'PointerLockControls', 'control_manager'
], function(three, Ship, Asteroid, Sun, PointerLockControls, ControlManager) {
  function Galaxy() {
    var WIDTH = window.innerWidth,
    HEIGHT = window.innerHeight;

    // set some camera attributes
    var FOV = 90,
        ASPECT = WIDTH / HEIGHT,
        NEAR = 0.1,
        FAR = 10000;
        
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( FOV, ASPECT, NEAR, FAR );
    
    var clock = new THREE.Clock();
    
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize( WIDTH, HEIGHT );
    document.body.appendChild( renderer.domElement );
    
    var ship = new Ship(scene);

    // Asteroid.generateField(scene);
    var sun = new Sun(scene);
    var gravObjects = [ ship ];
    
    var ambientLight = new THREE.AmbientLight( 0x404040 );
    scene.add(ambientLight);
    
    var pointLight = new THREE.PointLight( 0xffffff, 1, 10000 );
    pointLight.position = sun.mesh.position;
    scene.add(pointLight);
    
    camera.add(ship.mesh);
    ship.mesh.position.set(0, -10, -12);
    
    var blocker = document.getElementById( 'blocker' );
		var instructions = document.getElementById( 'instructions' );

    var controls = new PointerLockControls(camera);
		ControlManager.setupControls(controls, function () {
		  render();
		});
		
    scene.add( controls.getObject() );
    scene.controls = controls;
    
    var i, r = 100, starsGeometry = [ new THREE.Geometry(), new THREE.Geometry() ];

		for ( i = 0; i < 250; i ++ ) {

			var vertex = new THREE.Vector3();
			vertex.x = Math.random() * 2 - 1;
			vertex.y = Math.random() * 2 - 1;
			vertex.z = Math.random() * 2 - 1;
			vertex.multiplyScalar( r );

			starsGeometry[ 0 ].vertices.push( vertex );

		}

		for ( i = 0; i < 1500; i ++ ) {

			var vertex = new THREE.Vector3();
			vertex.x = Math.random() * 2 - 1;
			vertex.y = Math.random() * 2 - 1;
			vertex.z = Math.random() * 2 - 1;
			vertex.multiplyScalar( r );

			starsGeometry[ 1 ].vertices.push( vertex );

		}

		var stars;
		var starsMaterials = [
			new THREE.ParticleSystemMaterial( { color: 0x555555, size: 2, sizeAttenuation: false } ),
			new THREE.ParticleSystemMaterial( { color: 0x555555, size: 1, sizeAttenuation: false } ),
			new THREE.ParticleSystemMaterial( { color: 0x333333, size: 2, sizeAttenuation: false } ),
			new THREE.ParticleSystemMaterial( { color: 0x3a3a3a, size: 1, sizeAttenuation: false } ),
			new THREE.ParticleSystemMaterial( { color: 0x1a1a1a, size: 2, sizeAttenuation: false } ),
			new THREE.ParticleSystemMaterial( { color: 0x1a1a1a, size: 1, sizeAttenuation: false } )
		];

		for ( i = 10; i < 30; i ++ ) {

			stars = new THREE.ParticleSystem( starsGeometry[ i % 2 ], starsMaterials[ i % 6 ] );

			stars.rotation.x = Math.random() * 6;
			stars.rotation.y = Math.random() * 6;
			stars.rotation.z = Math.random() * 6;

			s = i * 10;
			stars.scale.set( s, s, s );

			stars.matrixAutoUpdate = false;
			stars.updateMatrix();

			scene.add( stars );

		}

    
    var time = Date.now();
    var render = function () {
		  requestAnimationFrame(render);

      controls.update(Date.now() - time);
      ship.update();
      sun.updateGravity(controls, ship);
      
		  renderer.render(scene, camera);
		  time = Date.now();
	  };
  }
  
  return Galaxy;
  
});
