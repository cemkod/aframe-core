/* globals define */
(function(define){'use strict';define(function(require,exports,module){

	document.registerElement(
	  'vr-camera',
	  {
	    prototype: Object.create(
	      VRObject.prototype, {
	      	createdCallback: {
	      		value: function() {
	      			this.object3D = new THREE.PerspectiveCamera();
	      		}
	      	},

      	  attachedCallback: {
      	  	value: function() {
      	  		this.loaded();
      	  	}
      		},

    	  	update: {
    	  		value: function() {
    	  			VRObject.prototype.update.call(this);
    	  			// Camera parameters
    	  			var fov = parseFloat(this.getAttribute('fov')) || 45;
    					var near = parseFloat(this.getAttribute('nar')) || 1;
    					var far = parseFloat(this.getAttribute('far')) || 10000;
    					var aspect = parseFloat(this.getAttribute('aspect'))
    						|| window.innerWidth / window.innerHeight;

    					// Setting three.js camera parameters
    					this.object3D.fov = fov;
    	    		this.object3D.near = near;
    	    		this.object3D.far = far;
    	    		this.object3D.aspect = aspect;
    	    		this.object3D.updateProjectionMatrix();
    	  		}
    	  	}

	      }
	    )
	  }
	);

});})(typeof define=='function'&&define.amd?define
:(function(n,w){'use strict';return typeof module=='object'?function(c){
c(require,exports,module);}:function(c){var m={exports:{}};c(function(n){
return w[n];},m.exports,m);w[n]=m.exports;};})('VRCamera',this));