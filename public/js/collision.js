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
    this.opts = opts;

    this.caster = new THREE.Raycaster();
    
    this.detectCollisions = function detectCollisions() {
      var object = this;
      var pos = new THREE.Vector3();
      pos.setFromMatrixPosition(object.body.matrixWorld);
      
      var collidables = opts.collidables || [];
      
      for (var i = 0; i < object.rays.length; i++) {    
        object.caster.set(pos, object.rays[i]);
        var collisions = object.caster.intersectObjects(collidables);
        
        if (collisions.length > 0 && collisions[0].distance <= 50) {
          object.explode(collisions[0].point);
          return true;
        }
      }
      
      return false;
    };
    
    this.explode = function explode(position) {
      console.log("BOOM!");
      var object = this,
          geom = new THREE.SphereGeometry(10, 32, 32),
          mat = new THREE.MeshLambertMaterial({ color: 0xff0000, ambient: 0xff0000 });
          
      var mesh = new THREE.Mesh(geom, mat);
      mesh.position.set(position.x, position.y, position.z);
      console.log(position);
      object.galaxy.scene.add(mesh);
      object.explosion = mesh;
    };
  }
  
  return Collision;
});
