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
      
      Ship.collidables = [galaxy.sun.mesh];
      setupPlugins();
		});
  }
  
  function setupPlugins() {
    Movement.call(Ship.prototype);
    Collision.call(Ship.prototype, { collidables: Ship.collidables, objectProperty: 'position' });
  }
  
  Ship.prototype.update = function () {
    var ship = this,
        controls = this.scene.controls;
    
    // gradually degrade the velocity of the ship
    if (this.velocity > 0) {
      this.velocity -= 0.005;
    }
    
    this.updateMovement();
    
    this.detectCollisions();
    
  };
  
  return Ship;
});
