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
    
    console.log(controls.yawObject);
    
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
