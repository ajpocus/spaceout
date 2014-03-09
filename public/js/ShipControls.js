/**
 * @author mrdoob / http://mrdoob.com/
 */

define(['three'], function (three) {
  ShipControls = function ( galaxy, camera ) {
	  var scope = this;
    var TERMINAL_V = 1.0;
    
	  camera.rotation.set( 0, 0, 0 );

	  scope.pitchObject = new THREE.Object3D();
	  scope.pitchObject.add( camera );

	  scope.yawObject = new THREE.Object3D();
	  scope.yawObject.add( scope.pitchObject );

    scope.xRad = 0;
    scope.yRad = 0;
    scope.xDiff = 0;
    scope.yDiff = 0;
    
    // set initial position, away from the sun
    scope.yawObject.translateZ(5000);
    
	  var moveForward = false;
	  var moveBackward = false;
	  var moveLeft = false;
	  var moveRight = false;
    
    var isShooting = true;
    var bullets = [];
	  var isOnObject = false;
	  var canJump = false;

	  var velocity = new THREE.Vector3();
    scope.velocity = velocity;
    
	  var PI_2 = Math.PI / 2;
    var PI_4 = Math.PI / 4;
    
    var onMouseDown = function (event) {
      if ( scope.enabled === false ) return;
      
      isShooting = true;
    };
    
    var onMouseUp = function (event) {
      isShooting = false;
    };

	  var onMouseMove = function ( event ) {

		  if ( scope.enabled === false ) return;

		  var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		  var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
		  
		  // normalize movements to a fraction of screen size
		  movementX = movementX / window.innerWidth;
		  movementY = movementY / window.innerHeight;

      scope.xRad = PI_2 * movementX;
      scope.yRad = PI_2 * movementY;
		  scope.xDiff = scope.xRad / 60;
      scope.yDiff = scope.yRad / 60;
    
		  var ship = galaxy.ship.mesh;
		  ship.rotation.z = Math.max( - PI_2, Math.min( PI_2, ship.rotation.z - scope.xRad));
	  };

	  var onKeyDown = function ( event ) {
		  switch ( event.keyCode ) {
			  case 38: // up
			  case 87: // w
				  moveForward = true;
				  break;

			  case 37: // left
			  case 65: // a
				  moveLeft = true; break;

			  case 40: // down
			  case 83: // s
				  moveBackward = true;
				  break;

			  case 39: // right
			  case 68: // d
				  moveRight = true;
				  break;

			  case 32: // space
				  if ( canJump === true ) velocity.y += 10;
				  canJump = false;
				  break;
		  }
	  };

	  var onKeyUp = function ( event ) {

		  switch( event.keyCode ) {

			  case 38: // up
			  case 87: // w
				  moveForward = false;
				  break;

			  case 37: // left
			  case 65: // a
				  moveLeft = false;
				  break;

			  case 40: // down
			  case 83: // s
				  moveBackward = false;
				  break;

			  case 39: // right
			  case 68: // d
				  moveRight = false;
				  break;

		  }

	  };

    document.addEventListener('mousedown', onMouseDown, false);
	  document.addEventListener('mousemove', onMouseMove, false);
	  document.addEventListener('keydown', onKeyDown, false);
	  document.addEventListener('keyup', onKeyUp, false);

	  this.enabled = false;

	  this.getObject = function () {

		  return scope.yawObject;

	  };

	  this.isOnObject = function ( boolean ) {

		  isOnObject = boolean;
		  canJump = boolean;

	  };

	  this.getDirection = function() {

		  // assumes the camera itself is not rotated

		  var direction = new THREE.Vector3( 0, 0, -1 );
		  var rotation = new THREE.Euler( 0, 0, 0, "YXZ" );

		  return function( v ) {

			  rotation.set( scope.pitchObject.rotation.x, scope.yawObject.rotation.y, scope.yawObject.position.z);

			  v.copy( direction ).applyEuler( rotation );

			  return v;

		  }

	  }();

	  this.update = function ( delta ) {
		  if ( scope.enabled === false ) return;

		  delta *= 0.1;

		  velocity.x += ( - velocity.x ) * 0.08 * delta;
		  velocity.y += ( - velocity.y ) * 0.08 * delta;
      velocity.z += ( - velocity.z ) * 0.08 * delta;
      
      velocity.x = Math.max(-TERMINAL_V, Math.min(TERMINAL_V, velocity.x));
      velocity.y = Math.max(-TERMINAL_V, Math.min(TERMINAL_V, velocity.y));
      velocity.z = Math.max(-TERMINAL_V, Math.min(TERMINAL_V, velocity.z));
      
		  if ( moveForward ) velocity.z -= 0.12 * delta;
		  if ( moveBackward ) velocity.z += 0.12 * delta;

		  if ( moveLeft ) velocity.x -= 0.12 * delta;
		  if ( moveRight ) velocity.x += 0.12 * delta;

		  scope.yawObject.rotation.y -= scope.xRad * 4;
		  scope.pitchObject.rotation.x -= scope.yRad * 4;

      if (Math.abs(scope.xDiff) > Math.abs(scope.xRad)) {
        scope.xRad = 0;
      } else {
        scope.xRad -= scope.xDiff;
      }
      
      if (Math.abs(scope.yDiff) > Math.abs(scope.yRad)) {
        scope.yRad = 0;
      } else {
        scope.yRad -= scope.yDiff;
      }
      
      var ship = galaxy.ship.mesh;
      if (ship.rotation.z !== 0) {
        var diff = 0.01;
        if (ship.rotation.z < 0) { diff *= -1 }
        if (Math.abs(ship.rotation.z) < Math.abs(diff)) {
          diff = ship.rotation.z;
        }
        
        ship.rotation.z = Math.max( -PI_2, Math.min( PI_2, ship.rotation.z - diff));
      }
            
		  scope.pitchObject.rotation.x = Math.max(-PI_2, Math.min(PI_2, scope.pitchObject.rotation.x));
		  
		  var rotFactor = scope.pitchObject.rotation.x / PI_2;
		  velocity.y += rotFactor * 0.12 * delta;
		  
		  scope.yawObject.translateX( velocity.x );
		  scope.yawObject.translateY( velocity.y ); 
		  scope.yawObject.translateZ( velocity.z );

      if (isShooting) {
        scope.fireBullet();
		  }
		  
      scope.updateBullets();

	  };
	  
	  this.fireBullet = function () {
	    var geom = new THREE.CubeGeometry(2, 2, 20);
      var mat = new THREE.MeshLambertMaterial({ color: 0xff0000, ambient: 0xff0000 });
      var bullet = new THREE.Mesh(geom, mat);
      
      var pos = scope.yawObject.position;
      bullet.position.set(pos.x, pos.y, pos.z);
      bullet.rotation.set(scope.pitchObject.rotation.x, scope.yawObject.rotation.y, 0);
      
      galaxy.scene.add(bullet);
      bullets[bullets.length] = bullet;
      isShooting = false;
	  };
	  
	  this.updateBullets = function () {
	    for (var i = 0; i < bullets.length; i++) {
        var bullet = bullets[i];
        var v = velocity.z;
        if (v < 0) { v *= -1; }
        bullet.translateZ(-10.0 - v);
      }
	  };
  };
  
  return ShipControls;
});

