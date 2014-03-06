define([
  'three', 'ship', 'asteroid', 'sun', 'PointerLockControls', 'control_manager', 'star_field', 'socketio'
], function(three, Ship, Asteroid, Sun, PointerLockControls, ControlManager, StarField, io) {
  function Galaxy() {
    var WIDTH = window.innerWidth,
      HEIGHT = window.innerHeight;
    var sid = Math.floor(Math.random() * 0x10000).toString();
    var socket = io.connect();
    var galaxy = this;
    galaxy.ships = {};
    
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
    var sun = new Sun(scene);
    var starField = new StarField(scene);
        
    camera.add(ship.mesh);
    ship.mesh.position.set(0, -10, -12);
    
    var ambientLight = new THREE.AmbientLight( 0x404040 );
    scene.add(ambientLight);
    
    var pointLight = new THREE.PointLight( 0xffffff, 1, 10000 );
    pointLight.position = sun.mesh.position;
    scene.add(pointLight);

    var blocker = document.getElementById( 'blocker' );
		var instructions = document.getElementById( 'instructions' );

    var controls = new PointerLockControls(camera);
		ControlManager.setupControls(controls, function () {
		  render();
		});
		
    scene.add( controls.getObject() );
    scene.controls = controls;
    
    socket.on('moved', function (data) {
      if (data.sid === sid) { return; }

      var ship = galaxy.ships[data.id];
      if (!ship) {
        ship = new Ship(scene);
        galaxy.ships[data.id] = ship;
      }
      
      ship.mesh.position.x = data.ship.x;
      ship.mesh.position.y = data.ship.y;
      ship.mesh.position.z = data.ship.z;
    });
    
    var time = Date.now();
    var render = function () {
		  requestAnimationFrame(render);
      controls.update(Date.now() - time);
      ship.update();
      //sun.updateGravity(controls, ship);
      
      socket.emit('move', {
        sid: sid,
        ship: {
          x: controls.yawObject.position.x,
          y: controls.yawObject.position.y,
          z: controls.yawObject.position.z
        }
      });        
      
		  renderer.render(scene, camera);
		  time = Date.now();
	  };
  }
  
  return Galaxy;
  
});
