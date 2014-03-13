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
        
        if (collisions.length > 0 && collisions[0].distance <= 10) {
          var particleSystem = object.explode();
          return particleSystem;
        }
      }
    };
    
    this.explode = function explode() {
      console.log("BOOM!");
      var object = this,
          geom = new THREE.SphereGeometry(10, 10, 10),
          mat = new THREE.MeshLambertMaterial({ color: 0xff0000, ambient: 0xff0000 });
          
      var pos = object.body.position;
      var mesh = new THREE.Mesh(geom, mat);
      mesh.position.set(pos.x, pos.y, pos.z);
      console.log(pos);
      object.galaxy.scene.add(mesh);
      object.explosion = mesh;
    };
  }
  
  return Collision;
});
