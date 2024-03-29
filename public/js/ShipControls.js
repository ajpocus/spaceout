/**
 * @author mrdoob / http://mrdoob.com/
 */

define(['three', 'movement', 'bullet'], function (three, Movement, Bullet) {
  ShipControls = function ( galaxy, camera ) {
	  var scope = this;
    var TERMINAL_V = 10.0;
    
	  camera.rotation.set( 0, 0, 0 );
    
    var pitchObject = new THREE.Object3D();
	  pitchObject.add( camera );
    scope.pitchObject = pitchObject;
    
	  var yawObject = new THREE.Object3D();
	  yawObject.position.y = 10;
	  yawObject.add( pitchObject );
	  yawObject.velocity = new THREE.Vector3();
	  scope.yawObject = yawObject;	
    scope.body = yawObject;
    
    scope.xRad = 0;
    scope.yRad = 0;
    scope.xDiff = 0;
    scope.yDiff = 0;
    
    // set initial position, away from the sun
    scope.body.translateZ(3000);
    
	  scope.moveForward = false;
	  scope.moveBackward = false;
	  scope.moveLeft = false;
	  scope.moveRight = false;
    
    var isShooting = true;
    var bullets = [];
	  var isOnObject = false;
	  var canJump = false;

	  var PI_2 = Math.PI / 2;
    var PI_4 = Math.PI / 4;
    
    var onMouseDown = function (event) {
      if ( scope.enabled === false ) return;
      
      isShooting = true;
    };
    
    var onMouseUp = function (event) {
      if ( scope.enabled === false ) return;
      
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
    
		  var ship = galaxy.ship;
		  ship.rotation.z = Math.max( - PI_2, Math.min( PI_2, ship.rotation.z - scope.xRad));
		  ship.rotation.x = Math.max( - PI_2, Math.min( PI_2, ship.rotation.x - scope.yRad));
	  };

	  var onKeyDown = function ( event ) {
	    if ( scope.enabled === false ) return;
	    
		  switch ( event.keyCode ) {
			  case 38: // up
			  case 87: // w
				  scope.moveForward = true;
				  break;

			  case 37: // left
			  case 65: // a
				  scope.moveLeft = true; break;

			  case 40: // down
			  case 83: // s
				  scope.moveBackward = true;
				  break;

			  case 39: // right
			  case 68: // d
				  scope.moveRight = true;
				  break;

			  case 32: // space
				  if ( canJump === true ) scope.velocity.y += 10;
				  canJump = false;
				  break;
		  }
	  };

	  var onKeyUp = function ( event ) {
      if ( scope.enabled === false ) return;
      
		  switch( event.keyCode ) {

			  case 38: // up
			  case 87: // w
				  scope.moveForward = false;
				  break;

			  case 37: // left
			  case 65: // a
				  scope.moveLeft = false;
				  break;

			  case 40: // down
			  case 83: // s
				  scope.moveBackward = false;
				  break;

			  case 39: // right
			  case 68: // d
				  scope.moveRight = false;
				  break;

		  }

	  };

    document.addEventListener('mousedown', onMouseDown, false);
	  document.addEventListener('mousemove', onMouseMove, false);
	  document.addEventListener('keydown', onKeyDown, false);
	  document.addEventListener('keyup', onKeyUp, false);

	  this.enabled = false;

	  this.getObject = function () {

		  return yawObject;

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

			  rotation.set( pitchObject.rotation.x, yawObject.rotation.y, 0);

			  v.copy( direction ).applyEuler( rotation );

			  return v;

		  }

	  }();

	  this.update = function ( delta ) {
		  if ( scope.enabled === false ) return;

		  delta *= 0.1;

		  scope.velocity.x += ( - scope.velocity.x ) * 0.08 * delta;
		  scope.velocity.y += ( - scope.velocity.y ) * 0.08 * delta;
      scope.velocity.z += ( - scope.velocity.z ) * 0.08 * delta;
      
      scope.velocity.x = Math.max(-TERMINAL_V, Math.min(TERMINAL_V, scope.velocity.x));
      scope.velocity.y = Math.max(-TERMINAL_V, Math.min(TERMINAL_V, scope.velocity.y));
      scope.velocity.z = Math.max(-TERMINAL_V, Math.min(TERMINAL_V, scope.velocity.z));
      
		  if ( moveForward ) scope.velocity.z -= 36.0 * delta;
		  if ( moveBackward ) scope.velocity.z += 36 * delta;

		  if ( moveLeft ) scope.velocity.x -= 36 * delta;
		  if ( moveRight ) scope.velocity.x += 36 * delta;

		  scope.body.rotation.y -= scope.xRad * 4;
		  pitchObject.rotation.x -= scope.yRad * 4;
      
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
      
      if (ship.rotation.x !== 0) {
        var diff = 0.01;
        if (ship.rotation.x < 0) { diff *= -1 }
        if (Math.abs(ship.rotation.x) < Math.abs(diff)) {
          diff = ship.rotation.x;
        }
        
        ship.rotation.x = Math.max( -PI_2, Math.min( PI_2, ship.rotation.x - diff));
      }
            
		  pitchObject.rotation.x = Math.max(-PI_2, Math.min(PI_2, pitchObject.rotation.x));
		  
		  var rotFactor = scope.rotation.x / PI_2;
		  scope.velocity.y += rotFactor * 0.12 * delta;
		  
      if (isShooting) {
        scope.fireBullet();
		  }
		  
      scope.updateBullets();
      scope.updateMovement();
	  };
	  
	  this.fireBullet = function () {
	    if ( scope.enabled === false ) return;
	    
	    var bullet = new Bullet(galaxy, galaxy.ship.mesh, galaxy.ship.cross);      
      bullets[bullets.length] = bullet;
      isShooting = false;
	  };
	  
	  this.updateBullets = function () {
	    if ( scope.enabled === false ) return;
	    
	    for (var i = 0; i < bullets.length; i++) {
        var bullet = bullets[i];
        bullet.update();
      }
	  };
  };
  
  Movement.call(ShipControls.prototype);
  
  return ShipControls;
});

