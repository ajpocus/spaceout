define(['three', 'collision', 'movement'], function (three, Collision, Movement) {
  function Bullet(galaxy, source) {
    var bullet = this;
    bullet.galaxy = galaxy;
    bullet.source = source;
    
    var geom = new THREE.CubeGeometry(2, 2, 20);
    var mat = new THREE.MeshLambertMaterial({ color: 0xff0000, ambient: 0xff0000 });
    var mesh = new THREE.Mesh(geom, mat);
    bullet.body = mesh;
    galaxy.scene.add(bullet.body);
    
    var pos = source.position;
    mesh.position.set(pos.x, pos.y, pos.z);
    mesh.rotation.set(source.rotation.x, source.rotation.y, source.rotation.z);
    Bullet.collidables = galaxy.enemy.body.children;
    setupPlugins();
  }
  
  function setupPlugins() {
    Movement.call(Bullet.prototype);
    Collision.call(Bullet.prototype, { collidables: Bullet.collidables });
  }
  
  Bullet.prototype.update = function () {
    var v = this.source.velocity.z;
    if (v < 0) { v *= -1; }
    this.body.translateZ(-10.0 - v);
    
    this.detectCollisions();
    if (this.explosion) {
      var explosion = this.explosion;
      var scale = explosion.scale.x + 0.1;
      explosion.scale.set(scale, scale, scale);
    }
  };
  
  return Bullet;
});
