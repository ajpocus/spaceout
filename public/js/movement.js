define(['three'], function (three) {
  var Movement = function () {
    this.position = new THREE.Vector3();
    this.movement = new THREE.Vector3();
    this.rotation = new THREE.Vector3();
    this.velocity = new THREE.Vector3();
    this.acceleration = new THREE.Vector3();
    
    this.updateRotation = function () {
      this.body.rotation.set(this.rotation.x, this.rotation.y, this.rotation.z);
    };
    
    this.updateMovement = function () {
      if (this.hasOwnProperty('enabled')) {
        if (!this.enabled) { return; }
      }
      
      this.velocity.x += this.acceleration.x;
      this.body.translateX(this.velocity.x);
      
      this.velocity.y += this.acceleration.y;
      this.body.translateY(this.velocity.y);
      
      this.velocity.z += this.acceleration.z;
      this.body.translateZ(this.velocity.z);
      
      this.position = this.body.position;
    };
    
    return this;
  };
  
  return Movement;
});
