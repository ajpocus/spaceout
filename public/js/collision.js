define(['three'], function (three) {
  function Collision(opts) {
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

    this.caster = new THREE.Raycaster();
    
    this.detectCollisions = function detectCollisions() {
      var object = this;
      var pos = object.body.position;
      var collidables = opts.collidables || [];

      for (var i = 0; i < object.rays.length; i++) {    
        object.caster.set(pos, object.rays[i]);
        var collisions = object.caster.intersectObjects(collidables);
        
        if (collisions.length > 0 && collisions[0].distance <= 100) {
          console.log("HEYO");
          object.explode();
        }
      }
    };
    
    this.explode = function explode() {
      console.log("BOOM!");
      var object = this,
          particleCount = 100,
          particles = new THREE.SphereGeometry(10, 10, 10),
          particleMat = new THREE.ParticleBasicMaterial({
            color: 0xff0000,
            size: 5,
            blending: THREE.AdditiveBlending
          });
          
      var pos = object.galaxy.controls.position;
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
      object.particleSystem = particleSystem;
      object.particles = particles;
      object.particleCount = particleCount;
      
      object.scene.add(particleSystem);
    };
  }
  
  return Collision;
});