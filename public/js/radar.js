define(['three'], function (three) {
  function Radar(scene) {
    this.scene = scene;
  }
  
  Radar.prototype.update = function (ship) {
    var origin = new THREE.Vector3(0, 0, 0);
    var pos = ship.mesh.position;
    var objectVector = new THREE.Vector3(pos.x, pos.y, pos.z);
    var lookVector = new THREE.Vector3().addVectors(origin, objectVector).normalize().multiplyScalar(400);
    
    ship = document.querySelector("#radar .ship");
    console.log(lookVector);
    ship.style.right = 200 - lookVector.x;
    ship.style.top = 200 - lookVector.z;
  };
  
  return Radar;
});