define(['three', 'ship', 'asteroid', 'sun', 'PointerLockControls'], function(three, Ship, Asteroid, Sun, PointerLockControls) {
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
    ship.mesh.position.x = 200;
    ship.mesh.position.y = 400;
    camera.lookAt(ship.mesh.position);
    
    // Asteroid.generateField(scene);
    var sun = new Sun(scene);
    var gravObjects = [ ship ];
    
    var ambientLight = new THREE.AmbientLight( 0x404040 );
    scene.add(ambientLight);
    
    var pointLight = new THREE.PointLight( 0xffffff, 1, 10000 );
    pointLight.position = sun.mesh.position;
    scene.add(pointLight);
    
    camera.position.z = 200;
    camera.lookAt(sun.mesh.position);
    
    var blocker = document.getElementById( 'blocker' );
		var instructions = document.getElementById( 'instructions' );

    var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
    var controls = new PointerLockControls(camera);
    
		if ( havePointerLock ) {
			var element = document.body;
			
			var pointerlockchange = function ( event ) {
				if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {

					controls.enabled = true;
					blocker.style.display = 'none';
				} else {
					controls.enabled = false;

					blocker.style.display = '-webkit-box';
					blocker.style.display = '-moz-box';
					blocker.style.display = 'box';

					instructions.style.display = '';
				}
			}

			var pointerlockerror = function ( event ) {

				instructions.style.display = '';

			}

			// Hook pointer lock state change events
			document.addEventListener( 'pointerlockchange', pointerlockchange, false );
			document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
			document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

			document.addEventListener( 'pointerlockerror', pointerlockerror, false );
			document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
			document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

			instructions.addEventListener( 'click', function ( event ) {

				instructions.style.display = 'none';

				// Ask the browser to lock the pointer
				element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

				if ( /Firefox/i.test( navigator.userAgent ) ) {

					var fullscreenchange = function ( event ) {

						if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {

							document.removeEventListener( 'fullscreenchange', fullscreenchange );
							document.removeEventListener( 'mozfullscreenchange', fullscreenchange );

							element.requestPointerLock();
						}

					}

					document.addEventListener( 'fullscreenchange', fullscreenchange, false );
					document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );

					element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;

					element.requestFullscreen();

				} else {

					element.requestPointerLock();

				}

			}, false );

		} else {

			instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';

		}
    
    scene.add( controls.getObject() );
    
    var time = Date.now();
    var render = function () {
		  requestAnimationFrame(render);

      var delta = clock.getDelta();
      controls.update(Date.now() - time);
      
      ship.mesh.position.x = camera.position.x;
      ship.mesh.position.y = camera.position.y;
      ship.mesh.position.z = camera.position.z + 200;
      camera.lookAt(ship.mesh.position);

      sun.updateGravity(gravObjects);
      // Asteroid.updateField(scene);
      
		  renderer.render(scene, camera);
		  time = Date.now();
	  };
    
  	render();
  }
  
  return Galaxy;
  
});
