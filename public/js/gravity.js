define(['three'], function (three) {
  var Gravity = function (opts) {
    this.G = 6.67e-11;
    
    // defaults, to ensure values are there
    this.mass = this.mass || 5000;
    this.radius = this.radius || 1000;
    this.satellites = opts.satellites || [];
    
    this.updateGravity = function () {
      var self = this;
      
      for (var i = 0; i < self.satellites.length; i++) {
        var object = self.satellites[i];
        
        var force = self.getForce(object);
        var acceleration = force / object.mass;

        var posVector = object.position.clone();
        var selfVector = self.position.clone();
        var lookVector = selfVector.add(objectVector).normalize();
        
        for (prop in ['x', 'y', 'z']) {
          object.acceleration[prop] = acceleration * lookVector[prop];
        }
      }
    };
    
    this.getForce = function (object) {
      var mesh = this.mesh;
      var mesh2 = object.mesh;
      
      var x2 = Math.pow((mesh.position.x - mesh2.position.x), 2);
      var y2 = Math.pow((mesh.position.y - mesh2.position.y), 2);
      var z2 = Math.pow((mesh.position.z - mesh2.position.z), 2);
      
      var dist2 = Math.sqrt(x2 + y2 + z2);
      var force = (this.G * this.mass * object.mass) / dist2;
      
      return force;
    };
    
    return this;
  };
  
  return Gravity;
});
