/**
 * Based on FlyControls example by James Baicoianu / http://www.baicoianu.com/
 */
 
define(['three'], function (three) {
  ShipControls = function ( camera, ship ) {
    this.object = ship.mesh;
  	this.camera = camera;
  	this.ship = ship;
  
  	this.domElement = document;
  	this.speed = 1.0;
  	this.tmpQuaternion = new THREE.Quaternion();
  
  	this.mouseStatus = 0;
  
  	this.moveState = {
  	  up: 0, down: 0, left: 0, right: 0,
  	  forward: 0, back: 0,
  	  pitchUp: 0, pitchDown: 0,
  	  yawLeft: 0, yawRight: 0,
  	  rollLeft: 0, rollRight: 0
  	};
  	
  	this.moveVector = new THREE.Vector3( 0, 0, 0 );
  	this.rotationVector = new THREE.Vector3( 0, 0, 0 );
  
  	this.mousemove = function( event ) {
			var container = this.getContainerDimensions();
			var halfWidth  = container.size[ 0 ] / 2;
			var halfHeight = container.size[ 1 ] / 2;

			this.moveState.left   = - ( ( event.pageX - container.offset[ 0 ] ) - halfWidth  ) / halfWidth;
			this.moveState.up =   ( ( event.pageY - container.offset[ 1 ] ) - halfHeight ) / halfHeight;

			this.updateRotationVector();
      this.updateMovementVector();  
  	};
  
  	this.update = function( delta ) {
  		var moveMult = delta * this.speed;

  		this.object.translateX( this.moveVector.x * moveMult );
  		this.object.translateY( this.moveVector.y * moveMult );
  	};
  
  	this.updateMovementVector = function() {
  		this.moveVector.x = ( -this.moveState.left    + this.moveState.right );
  		this.moveVector.y = ( -this.moveState.down    + this.moveState.up );
  	};
  
  	this.updateRotationVector = function() {
  		this.rotationVector.x = ( -this.moveState.pitchDown + this.moveState.pitchUp );
  		this.rotationVector.y = ( -this.moveState.yawRight  + this.moveState.yawLeft );
  		this.rotationVector.z = ( -this.moveState.rollRight + this.moveState.rollLeft );
  	};
  
  	this.getContainerDimensions = function() {
  		if ( this.domElement != document ) {
  			return {
  				size	: [ this.domElement.offsetWidth, this.domElement.offsetHeight ],
  				offset	: [ this.domElement.offsetLeft,  this.domElement.offsetTop ]
  			};
  		} else {
  			return {
  				size	: [ window.innerWidth, window.innerHeight ],
  				offset	: [ 0, 0 ]
  			};
  		}
  	};
  
  	function bind( scope, fn ) {
  		return function () {
  			fn.apply( scope, arguments );
  		};
  	};
  	
  	this.handleEvent = function ( event ) {
  		if ( typeof this[ event.type ] == 'function' ) {
  			this[ event.type ]( event );
  		}
  	};
  
  	this.domElement.addEventListener( 'contextmenu', function ( event ) {
  	  event.preventDefault();
  	}, false );
  
  	this.domElement.addEventListener('mousemove', bind(this, this.mousemove), false);
  	this.domElement.addEventListener('mousedown', bind( this, this.mousedown), false);
  	this.domElement.addEventListener('mouseup', bind(this, this.mouseup), false);
  
  	this.updateMovementVector();
  	this.updateRotationVector();
  
  };

  return ShipControls;
});
