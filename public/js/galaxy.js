define([
  'three', 'ship', 'asteroid', 'sun', 'ShipControls', 'pointer_manager', 'star_field', 'earth', 'socketio', 'jquery.min'
], function(three, Ship, Asteroid, Sun, ShipControls, ControlManager, StarField, Earth, io, $) {
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
        FAR = 10000000;
        
    var scene = new THREE.Scene();
    galaxy.scene = scene;
    var camera = new THREE.PerspectiveCamera( FOV, ASPECT, NEAR, FAR );
    scene.camera = camera;
    
    var clock = new THREE.Clock();
    
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize( WIDTH, HEIGHT );
    document.body.appendChild( renderer.domElement );
    
    var controls = new ShipControls(galaxy, camera);
		ControlManager.setupControls(controls, function () {
		  render();
		});
		
    scene.add( controls.getObject() );
    scene.controls = controls;
    galaxy.controls = controls;
    
    var ship = new Ship(galaxy);
    galaxy.ship = ship;
    
    var earth = new Earth(scene);
    galaxy.earth = earth;
    
    var sun = new Sun(galaxy);
    galaxy.sun = sun;
    var starField = new StarField(scene);
    
    var ambientLight = new THREE.AmbientLight( 0x404040 );
    scene.add(ambientLight);
    
    var pointLight = new THREE.PointLight( 0xffffff, 1, 10000 );
    pointLight.position = sun.mesh.position;
    scene.add(pointLight);

    var blocker = document.getElementById( 'blocker' );
		var instructions = document.getElementById( 'instructions' );

    socket.on('moved', function (data) {
      if (data.sid === sid) { return; }

      var ship = galaxy.ships[data.id];
      if (!ship) {
        ship = new Ship(scene);
        ship.npc = true;
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
      earth.update();
      sun.update();
      
      socket.emit('move', {
        sid: sid,
        ship: {
          x: controls.position.x,
          y: controls.position.y,
          z: controls.position.z
        }
      });        
      
		  renderer.render(scene, camera);
		  time = Date.now();
	  };
  }
  
  return Galaxy;
  
});
