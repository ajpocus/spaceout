define(['three', 'collision', 'movement'], function (three, Collision, Movement) {
  function Bullet(galaxy, source, target) {
    var bullet = this;
    bullet.galaxy = galaxy;
    bullet.source = source;
    bullet.target = target || galaxy.ship.cross;
    
    var geom = new THREE.CubeGeometry(2, 2, 20);
    var mat = new THREE.MeshLambertMaterial({ color: 0xff0000, ambient: 0xff0000 });
    var mesh = new THREE.Mesh(geom, mat);
    bullet.body = mesh;
    
    var pos = new THREE.Vector3();
    pos.setFromMatrixPosition(source.matrixWorld);
    bullet.body.position.set(pos.x, pos.y, pos.z);
    
    galaxy.scene.add(bullet.body);
    
    Bullet.collidables = galaxy.enemy.body.children;
    setupPlugins();
  }
  
  function setupPlugins() {
    Movement.call(Bullet.prototype);
    Collision.call(Bullet.prototype, { collidables: Bullet.collidables });
  }
  
  Bullet.prototype.update = function () {
    var v = 0;
    if (this.source.velocity) {
      v = this.source.velocity.z;
    }
    if (v < 0) { v *= -1; }
    
    var origin = new THREE.Vector3();
    origin.setFromMatrixPosition(this.source.matrixWorld);
    var target = new THREE.Vector3();
    target.setFromMatrixPosition(this.target.matrixWorld);
    var vector = origin.sub(target);
    
    console.log(vector);
    this.body.translateOnAxis(vector.normalize(), -10.0 - v);
    this.body.rotation.set(-vector.y, -vector.x, vector.z);
    
    this.detectCollisions();
    if (this.explosion) {
      var explosion = this.explosion;
      var scale = explosion.scale.x + 0.1;
      explosion.scale.set(scale, scale, scale);
    }
  };
  
  return Bullet;
});
