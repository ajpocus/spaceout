define(['three', 'ship', 'ship_controls', 'asteroid'], function(three, Ship, ShipControls, Asteroid) {
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
    ship.mesh.position.z = -30;
    camera.lookAt(ship.mesh.position);
    
    Asteroid.generateField(scene);
    
    var directionalLight = new THREE.DirectionalLight( 0xffffff, 1.0 );
    directionalLight.position.set(0, 0, 0).normalize();
    scene.add(directionalLight);
    
    var pointLight = new THREE.PointLight( 0xffffff, 1, 100 );
    pointLight.position.set(5, 10, 0);
    scene.add(pointLight);
    
    camera.lookAt(ship.mesh.position);
    
    var controls = new ShipControls(camera, ship);
    
    var render = function () {
		  requestAnimationFrame(render);

      var delta = clock.getDelta();
      controls.update(delta);
      
      Asteroid.updateField(scene);
      
		  renderer.render(scene, camera);
	  };
    
  	render();
  }
  
  return Galaxy;
  
});
