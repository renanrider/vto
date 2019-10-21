"use strict";

// some globalz :f0.5
var THREECAMERA;

// callback : launched if a face is detected or lost. TODO : add a cool particle effect WoW !
function detect_callback(isDetected) {
  if (isDetected) {
    console.log('INFO in detect_callback() : DETECTED');
  } else {
    console.log('INFO in detect_callback() : LOST');
  }
}

// build the 3D. called once when Jeeliz Face Filter is OK
function init_threeScene(spec) {
  const threeStuffs = THREE.JeelizHelper.init(spec, detect_callback);

  const loadingManager = new THREE.LoadingManager();

//Cube config
  const boxWidth = 1;
  const boxHeight = 1;
  const boxDepth = 1;
  const geometry = new THREE.BoxBufferGeometry(boxWidth, boxHeight, boxDepth);
  
//TextureLoader  
  const loader = new THREE.TextureLoader();

  const materials = [
    new THREE.MeshBasicMaterial({map: loader.load('side.png'),transparent: true, opacity: 1, color: 0x000000 }), //left side
    new THREE.MeshBasicMaterial({map: loader.load('side-r.png'),transparent: true, opacity: 1, color: 0x000000}), //right
    new THREE.MeshBasicMaterial({map: loader.load('https://threejsfundamentals.org/threejs/resources/images/flower-3.jpg'),transparent: true, opacity: 0.0, color: 0xFF0000}), //top
    new THREE.MeshBasicMaterial({map: loader.load('https://threejsfundamentals.org/threejs/resources/images/flower-4.jpg'),transparent: true, opacity: 0.0, color: 0xFF0000}), //bottom
    new THREE.MeshBasicMaterial({map: loader.load('front.png'),transparent: true, opacity: 1, color: 0x000000}), //front
    new THREE.MeshBasicMaterial({map: loader.load('https://threejsfundamentals.org/threejs/resources/images/flower-6.jpg'),transparent: true, opacity: 0.0, color: 0xFF0000}), //back
  ];
  	
  const cube = new THREE.Mesh(geometry, materials);  
		cube.frustumCulled = false;  
		cube.scale.multiplyScalar(1.1); //1.1
		cube.position.setY(0.25); //move glasses a bit up 0.05
		cube.position.setZ(0);//move glasses a bit forward 0.25
		cube.rotation.x = cube.rotation.x + 0.20;
		window.zou=cube;
		addDragEventListener(cube);
		threeStuffs.faceObject.add(cube);
		threeStuffs.faceObject.add(cube);
		
		loadingManager.onLoad = () => {	//Do stuff };


  // CREATE THE VIDEO BACKGROUND
 // function create_mat2d(threeTexture, isTransparent){ //MT216 : we put the creation of the video material in a func because we will also use it for the frame
    return new THREE.RawShaderMaterial({
      depthWrite: false,
      depthTest: false,
      transparent: isTransparent,
      vertexShader: "attribute vec2 position;\n\
        varying vec2 vUV;\n\
        void main(void){\n\
          gl_Position=vec4(position, 0., 1.);\n\
          vUV=0.5+0.5*position;\n\
        }",
      fragmentShader: "precision lowp float;\n\
        uniform sampler2D samplerVideo;\n\
        varying vec2 vUV;\n\
        void main(void){\n\
          gl_FragColor=texture2D(samplerVideo, vUV);\n\
        }",
       uniforms:{
        samplerVideo: { value: threeTexture }
       }
    });
  }

  // CREATE THE CAMERA
  THREECAMERA = THREE.JeelizHelper.create_camera();
  // CREATE A LIGHT
  const ambient = new THREE.AmbientLight(0xffffff, 1);
  threeStuffs.scene.add(ambient)

  var dirLight = new THREE.DirectionalLight(0xffffff);
  dirLight.position.set(100, 1000, 100);

  threeStuffs.scene.add(dirLight)
} // end init_threeScene()

//launched by body.onload() :
function main() {
  JeelizResizer.size_canvas({
    canvasId: 'jeeFaceFilterCanvas',
    callback: function(isError, bestVideoSettings){
      init_faceFilter(bestVideoSettings);
    }
  })
} //end main()

function init_faceFilter(videoSettings){
  JEEFACEFILTERAPI.init({
    canvasId: 'jeeFaceFilterCanvas',
    NNCpath: './dist/', // root of NNC.json file
    videoSettings: videoSettings,
    callbackReady: function (errCode, spec) {
      if (errCode) {
        console.log('AN ERROR HAPPENS. SORRY BRO :( . ERR =', errCode);
        return;
      }

      console.log('INFO : JEEFACEFILTERAPI IS READY');
      init_threeScene(spec);
    }, // end callbackReady()

    // called at each render iteration (drawing loop)
    callbackTrack: function (detectState) {
      THREE.JeelizHelper.render(detectState, THREECAMERA);
    } // end callbackTrack()
  }); // end JEEFACEFILTERAPI.init call
} // end main()








 