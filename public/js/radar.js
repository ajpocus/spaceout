define(['three', 'sun'], function (three, Sun) {
  function Radar(galaxy) {
    this.galaxy = galaxy;
  }
  
  Radar.prototype.update = function (enemy) {
    var origin = this.galaxy.controls.body.position;
    var pos = enemy.body.position;
    
    var dx = Math.min(200, Math.max(-200, Math.round(pos.x - origin.x)));
    var dy = Math.min(200, Math.max(-200, Math.round(pos.z - origin.z)));
    var dist2 = Sun.dist2(pos, origin);
    dist2 = Math.min(200, dist2) / 200;
    
    console.log(dist2);
    dx = dx;
    dy = dy;
    
    ship = document.querySelector("#radar .ship");
    console.log(dx, dy);
    ship.style.right = dx * dist2 + "px";
    ship.style.top = dy * dist2 + "px";
  };
  
  return Radar;
});
