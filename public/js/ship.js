define(['three', 'OBJLoader', 'movement'], function (three, OBJLoader, Movement) {
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
      
		});
  }
  
  Movement.call(Ship.prototype);
  
  Ship.prototype.update = function () {
    var ship = this,
        controls = this.scene.controls;
    
    // gradually degrade the velocity of the ship
    if (this.velocity > 0) {
      this.velocity -= 0.005;
    }
    
    this.updateMovement();
    
    this.detectCollisions();
    
    if (ship.particles && ship.particles.length) {
      for (var i = 0; i < ship.particleCount; i++) {
        var particle = ship.particles.vertices[i];
        particle.velocity.y -= Math.random() * 10;
        particle.add(particle.velocity);
      } 
    }
  };
  
  Ship.prototype.detectCollisions = function detectCollisions() {
    var ship = this;
    var shipPos = ship.galaxy.controls.position;
    var collidableMeshList = [
      ship.galaxy.sun.mesh
    ];
    
    for (var i = 0; i < ship.rays.length; i++) {    
      ship.caster.set(shipPos, ship.rays[i]);
      var collisions = ship.caster.intersectObjects(collidableMeshList);
      if (collisions.length > 0 && collisions[0].distance <= 32) {
        ship.explode();
      }
    }
  };
  
  Ship.prototype.explode = function explode() {
    var ship = this,
        particleCount = 100,
        particles = new THREE.SphereGeometry(10, 10, 10),
        particleMat = new THREE.ParticleBasicMaterial({
          color: 0xff0000,
          size: 5,
          blending: THREE.AdditiveBlending
        });
        
    var pos = ship.galaxy.controls.position;
    for (var i = 0; i < particleCount; i++) {
      var pX = pos.x,
          pY = pos.y,
          pZ = pos.z,
          particle = new THREE.Vector3(pX, pY, pZ);
      
      var minV = -100,
          maxV = 100,
          xV = Math.random() * (minV - maxV) + minV,
          yV = Math.random() * (minV - maxV) + minV,
          zV = Math.random() * (minV - maxV) + minV;
      particle.velocity = new THREE.Vector3(xV, yV, zV);
      particles.vertices.push(particle);
    }
    
    var particleSystem = new THREE.ParticleSystem(particles, particleMat);
    ship.particleSystem = particleSystem;
    ship.particles = particles;
    ship.particleCount = particleCount;
    
    ship.scene.add(particleSystem);
  };
  
  return Ship;
});
