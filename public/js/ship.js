define(['three', 'OBJLoader', 'movement', 'collision'], function (three, OBJLoader, Movement, Collision) {
  function Ship(galaxy) {
    this.galaxy = galaxy;
    this.scene = this.galaxy.scene;
    this.controls = this.scene.controls;
    this.position = this.controls.position;
    
    this.mass = 5e4;  // kgs
    this.rays = [
      new THREE.Vector3(0, 0, 1),
      new THREE.Vector3(1, 0, 1),
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(1, 0, -1),
      new THREE.Vector3(0, 0, -1),
      new THREE.Vector3(-1, 0, -1),
      new THREE.Vector3(-1, 0, 0),
      new THREE.Vector3(-1, 0, 1)
    ];
    // And the "RayCaster", able to test for intersections
    this.caster = new THREE.Raycaster();

    var ship = this;
    
    var manager = new THREE.LoadingManager();
    var loader = new THREE.OBJLoader( manager );
		loader.load('spaceship.obj', function (object) {
		  object.scale.set(3, 3, 3);
			ship.scene.add(object);
			ship.mesh = object;
			ship.body = ship.mesh;
			
			ship.scene.camera.add(object);
      object.position.set(0, -10, -40);
      
      // draw reticle
      var circleGeom = new THREE.CircleGeometry(5, 64, 64);
      var circleMat = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
      var circle = new THREE.Mesh(circleGeom, circleMat);
      
      var crossGeom = new THREE.Geometry();
      crossGeom.vertices.push( new THREE.Vector3(-10, 0, 0) );
      crossGeom.vertices.push( new THREE.Vector3(10, 0, 0) );
      crossGeom.vertices.push( new THREE.Vector3(0, 0, 0) );
      crossGeom.vertices.push( new THREE.Vector3(0, 10, 0) );
      crossGeom.vertices.push( new THREE.Vector3(0, -10, 0) );
      crossGeom.vertices.push( new THREE.Vector3(0, 0, 0) );
      var crossMat = new THREE.LineBasicMaterial({ color: 0xff0000 });
      var cross = new THREE.Line(crossGeom, crossMat);

      circle.position.z = -200;
      cross.position.z = -200;
      
      object.add(cross);
      object.add(circle);
      
      ship.cross = cross;
		});
		
		var collidables = [galaxy.sun.mesh];
		var position = ship.controls.body.position;
    setupPlugins(collidables, position);
  }
  
  function setupPlugins(collidables, position) {
    Movement.call(Ship.prototype);
    Collision.call(Ship.prototype, { collidables: collidables, position: position });
  }
  
  Ship.prototype.update = function () {
    var ship = this,
        controls = this.scene.controls;
    
    if (!controls.enabled) { return; }
    
    // gradually degrade the velocity of the ship
    if (this.velocity > 0) {
      this.velocity -= 0.005;
    }
    
    this.updateRotation();
    this.updateMovement();
    
    var exploded = this.detectCollisions();
    if (exploded) {
      controls.enabled = false;
      setTimeout(function () {
        ship.respawn();
      }, 1000);
    }
  };
  
  Ship.prototype.respawn = function () {
    var ship = this,
      camera = ship.scene.camera,
      controls = ship.controls;
    
    ship.velocity.set(0, 0, 0);
    controls.velocity.set(0, 0, 0);
    controls.body.position.set(0, 0, 5000);
    ship.position.set(0, -10, -40);
    ship.body.position.set(0, -10, -40);
    controls.enabled = true;
  };
  
  return Ship;
});
