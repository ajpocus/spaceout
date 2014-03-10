define(['three', 'OBJLoader'], function (three, OBJLoader) {
  function Ship(galaxy) {
    this.galaxy = galaxy;
    this.scene = this.galaxy.scene;
    this.mass = 5e4;  // kgs
    this.velocity = 0;
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
			ship.scene.add(object);
			ship.mesh = object;
			
			ship.scene.camera.add(object);
      object.position.set(0, -2, -12);
		});
  }
  
  Ship.prototype.update = function () {
    var controls = this.scene.controls,
      pitchObject = controls.pitchObject,
      yawObject = controls.yawObject;
    
    // gradually degrade the velocity of the ship
    if (this.velocity > 0) {
      this.velocity -= 0.005;
    }
    
    this.detectCollisions();
    
    // this.mesh.rotation.z = yawObject.rotation.y;
  };
  
  Ship.prototype.detectCollisions = function detectCollisions() {
    var ship = this;
    var shipPos = ship.galaxy.controls.yawObject.position;
    var collidableMeshList = [
      ship.galaxy.sun.mesh,
      ship.galaxy.earth.mesh
    ];
    
    for (var i = 0; i < ship.rays.length; i++) {    
      ship.caster.set(shipPos, ship.rays[i]);
      var collisions = ship.caster.intersectObjects(collidableMeshList);
      if (collisions.length > 0 && collisions[0].distance <= 32) {
        console.log("HIT");
      }
    }
  };
  
  return Ship;
});
