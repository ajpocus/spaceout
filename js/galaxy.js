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
    
    var asteroids = [];
    var p = 0;
    for (var i = 0; i > -300; i -= 5) {
      for (var j = 0; j < 8; j++) {
        var asteroid = new Asteroid(scene);
        var minX = -(window.innerWidth / 2),
            maxX = window.innerWidth / 2,
            minY = -(window.innerHeight / 2),
            maxY = window.innerHeight / 2,
            minZ = -10,
            maxZ = -1000;
            
        asteroid.mesh.position.x = Math.random() * (maxX - minX) + minX;
        asteroid.mesh.position.y = Math.random() * (maxY - minY) + minY;
        asteroid.mesh.position.z = i;
        
        asteroids[p] = asteroid;
        p++;
      }
    }
    
    var directionalLight = new THREE.DirectionalLight( 0xffffff, 1.0 );
    directionalLight.position.set(0, 1, 0).normalize();
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
      
      for (var i = 0; i < asteroids.length; i++) {
        asteroids[i].mesh.translateZ(1.0);
      }
      
		  renderer.render(scene, camera);
	  };
    
  	render();
  }
  
  return Galaxy;
  
});
