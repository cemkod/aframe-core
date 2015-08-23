/* globals define */
(function(define){'use strict';define(function(require,exports,module){

  var proto = Object.create(
    HTMLElement.prototype, {
      createdCallback: {
        value: function() {
          this.attachEventListeners();
          this.setupScene();
        }
      },

      attachEventListeners: {
        value: function() {
          var self = this;
          var elementLoaded = this.elementLoaded.bind(this);
          this.elementsPending = 0;
          traverseDOM(this);
          function traverseDOM(node) {
            if (VRObject.prototype.isPrototypeOf(node)) {
              attachEventListener(node);
              self.elementsPending++;
            }
            node = node.firstChild;
            while (node) {
              traverseDOM(node);
              node = node.nextSibling;
            }
          }
          function attachEventListener(node) {
            node.addEventListener('loaded', elementLoaded);
          }

        }
      },

      elementLoaded: {
        value: function() {
          this.elementsPending--;
          if (this.elementsPending === 0) {
            this.resizeCanvas();
            this.render();
          }
        }
      },

      attachedCallback: {
        value: function() {
          console.log('live on DOM ;-) ');
        }
      },

      detachedCallback: {
        value: function() {
          console.log('leaving the DOM :-( )');
        }
      },

      setupScene: {
        value: function() {
          // The canvas where the WebGL contet will be painted
          this.setupCanvas();
          // The three.js renderer setup
          this.setupRenderer();
          // three.js camera setup
          this.setupCamera();
        }
      },

      setupCanvas: {
        value: function() {
          var canvas = this.canvas = document.createElement('canvas');
          canvas.classList.add('vr-canvas');
          document.body.appendChild(canvas);
          window.addEventListener('resize', this.resizeCanvas.bind(this), false);
        }
      },

      setupCamera: {
        value: function() {
          var cameraEl = document.querySelector('vr-camera');
          // If there's not a user defined camera
          if (!cameraEl) {
            cameraEl = document.createElement('vr-camera');
            this.elementsPending++;
            cameraEl.addEventListener('loaded', this.elementLoaded.bind(this));
            cameraEl.setAttribute('fov', 45);
            cameraEl.setAttribute('near', 1);
            cameraEl.setAttribute('far', 10000);
            cameraEl.setAttribute('z', 500);
          }
          this.camera = cameraEl.object3D;
          this.appendChild(cameraEl);
        }
      },

      enterVR: {
        value: function() {
          this.renderer = this.stereoRenderer;
          this.stereoRenderer.setFullScreen(true);
        }
      },

      setupRenderer: {
        value: function() {
          var canvas = this.canvas;
          var renderer = this.renderer = this.monoRenderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true, alpha: true } );
          renderer.setPixelRatio( window.devicePixelRatio );
          renderer.sortObjects = false;
          this.stereoRenderer = new THREE.VREffect(renderer);
          this.object3D = new THREE.Scene();
        }
      },

      resizeCanvas: {
        value: function() {
          var canvas = this.canvas;
          var camera = this.camera;
          // Make it visually fill the positioned parent
          canvas.style.width = '100%';
          canvas.style.height =' 100%';
          // Set the internal size to match
          canvas.width = canvas.offsetWidth;
          canvas.height = canvas.offsetHeight;
          // Updates camera
          camera.aspect = canvas.offsetWidth / canvas.offsetHeight;
          camera.updateProjectionMatrix();
          // Notify the renderer of the size change
          this.renderer.setSize( canvas.width, canvas.height );
        }
      },

      add: {
        value: function(el) {
          if (!el.object3D) { return; }
          this.object3D.add(el.object3D);
          if (el.tagName === "VR-CAMERA") {
            this.camera = el.object3D;
          }
        }
      },

      render: {
        value: function() {
          this.renderer.render( this.object3D, this.camera );
          window.requestAnimationFrame(this.render.bind(this));
        }
      }
    }
  );

  // Registering element and exporting prototype
  module.exports = document.registerElement('vr-scene', { prototype: proto });

});})(typeof define=='function'&&define.amd?define
:(function(n,w){'use strict';return typeof module=='object'?function(c){
c(require,exports,module);}:function(c){var m={exports:{}};c(function(n){
return w[n];},m.exports,m);w[n]=m.exports;};})('VRScene',this));