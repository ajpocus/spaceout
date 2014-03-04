define(['three', 'ship', 'ship_controls', 'asteroid', 'sun'], function(three, Ship, ShipControls, Asteroid, Sun) {
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
    ship.mesh.position.z = 180;
    camera.lookAt(ship.mesh.position);
    
    // Asteroid.generateField(scene);
    var sun = new Sun(scene);
    
    var ambientLight = new THREE.AmbientLight( 0x404040 );
    scene.add(ambientLight);
    
    var pointLight = new THREE.PointLight( 0xffffff, 1, 10000 );
    pointLight.position = sun.mesh.position;
    scene.add(pointLight);
    
    camera.position.z = 200;
    camera.lookAt(sun.mesh.position);
    
    var controls = new ShipControls(camera, ship);
    
    var render = function () {
		  requestAnimationFrame(render);

      var delta = clock.getDelta();
      controls.update(delta);
      
      // Asteroid.updateField(scene);
      
		  renderer.render(scene, camera);
	  };
    
  	render();
  }
  
  return Galaxy;
  
});
