define(['three'], function (three) {
  var Movement = function () {
    this.position = new THREE.Vector3();
    this.movement = new THREE.Vector3();
    this.rotation = new THREE.Vector3();
    this.velocity = new THREE.Vector3();
    this.acceleration = new THREE.Vector3();
    
    this.updateMovement = function () {
      this.velocity.x += this.acceleration.x;
      this.mesh.translateX(this.velocity.x);
      
      this.velocity.y += this.acceleration.y;
      this.mesh.translateY(this.velocity.y);
      
      this.velocity.z += this.acceleration.z;
      this.mesh.translateZ(this.velocity.z);
    };
    
    return this;
  };
  
  return Movement;
});
