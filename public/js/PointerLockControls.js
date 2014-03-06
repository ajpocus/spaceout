/**
 * @author mrdoob / http://mrdoob.com/
 */

define(['three'], function (three) {
  THREE.PointerLockControls = function ( galaxy, camera ) {
	  var scope = this;

	  camera.rotation.set( 0, 0, 0 );

	  scope.pitchObject = new THREE.Object3D();
	  scope.pitchObject.add( camera );

	  scope.yawObject = new THREE.Object3D();
	  scope.yawObject.position.y = 10;
	  scope.yawObject.add( scope.pitchObject );

    // set initial position at (0, 0, 200)
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

	  var PI_2 = Math.PI / 2;

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

		  scope.yawObject.rotation.y -= movementX * 0.002;
		  scope.pitchObject.rotation.x -= movementY * 0.002;

		  scope.pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, scope.pitchObject.rotation.x ) );

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

			  rotation.set( scope.pitchObject.rotation.x, scope.yawObject.rotation.y, 0 );

			  v.copy( direction ).applyEuler( rotation );

			  return v;

		  }

	  }();

	  this.update = function ( delta ) {

		  if ( scope.enabled === false ) return;

		  delta *= 0.1;

		  velocity.x += ( - velocity.x ) * 0.08 * delta;
		  velocity.z += ( - velocity.z ) * 0.08 * delta;

		  velocity.y -= 0.25 * delta;

		  if ( moveForward ) velocity.z -= 0.12 * delta;
		  if ( moveBackward ) velocity.z += 0.12 * delta;

		  if ( moveLeft ) velocity.x -= 0.12 * delta;
		  if ( moveRight ) velocity.x += 0.12 * delta;

		  if ( isOnObject === true ) {

			  velocity.y = Math.max( 0, velocity.y );

		  }
		  
		  if (isShooting) {
		    var shipVector = galaxy.ship.mesh.position;
        var forwardVector = new THREE.Vector3(0, 0, -1);
        
        var shootVector = new THREE.Vector3().addVectors(shipVector, forwardVector);
        var geom = new THREE.CubeGeometry(5, 5, 5);
        var mat = new THREE.MeshBasicMaterial({ color: 0xcc0000 });
        var bullet = new THREE.Mesh(geom, mat);
        bullet.position.set(shipVector.x, shipVector.y, shipVector.z);
        
        galaxy.scene.add(bullet);
        bullets[bullets.length] = bullet;
      
        
        console.log(bullets);
        for (var i = 0; i < bullets.length; i++) {
          var bullet = bullets[i];
          bullet.translateOnAxis(shootVector, 0.5);
          
          if (bullet.position.z < -1000) {
            galaxy.scene.remove(bullet);
            bullets.splice(i, 1);
          }
        }
		  }

		  scope.yawObject.translateX( velocity.x );
		  scope.yawObject.translateY( velocity.y ); 
		  scope.yawObject.translateZ( velocity.z );

		  if ( scope.yawObject.position.y < 10 ) {

			  velocity.y = 0;
			  scope.yawObject.position.y = 10;

			  canJump = true;

		  }

	  };
	  
  };
  
  return THREE.PointerLockControls;
});

