"use strict";

// some globalz :f0.5
var THREECAMERA;

// callback : launched if a face is detected or lost.
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
    new THREE.MeshBasicMaterial({map: loader.load('./glasses/glasses-3/glasses-3-side-Left.png'),transparent: true, opacity: 1, color: 0xFFFFFF }), //left side 
    new THREE.MeshBasicMaterial({map: loader.load('./glasses/glasses-3/glasses-3-side-Right.png'),transparent: true, opacity: 1, color: 0xFFFFFF}), //right side
    new THREE.MeshBasicMaterial({map: loader.load('./glasses/glasses-3/glasses-3-side-Right.png'),transparent: true, opacity: 0.0, color: 0xFF0000}), //top side - unused
    new THREE.MeshBasicMaterial({map: loader.load('./glasses/glasses-3/glasses-3-side-Right.png'),transparent: true, opacity: 0.0, color: 0xFF0000}), //bottom side - unused
    new THREE.MeshBasicMaterial({map: loader.load('./glasses/glasses-3/glasses-3-front.png'),transparent: true, opacity: 1, color: 0xFFFFFF}), //front side - unused
    new THREE.MeshBasicMaterial({map: loader.load('./glasses/glasses-3/glasses-3-side-Right.png'),transparent: true, opacity: 0.0, color: 0xFF0000}), //back side -unused
  ];
  	
 // In this cube the texture of the glasses will be applied
  const cube = new THREE.Mesh(geometry, materials);  
		cube.frustumCulled = false;  
		cube.scale.multiplyScalar(1.1); //1.1
		cube.position.setY(0.25); //move glasses a bit up 0.05
		cube.position.setZ(0.02);//move glasses a bit forward 0.25
		cube.rotation.x = cube.rotation.x + -0.10;
		window.zou=cube;
		addDragEventListener(cube);
		threeStuffs.faceObject.add(cube);

  // CREATE THE CAMERA
  //THREECAMERA = THREE.JeelizHelper.create_camera();


  //CREATE THE CAMERA

  /*
  PerspectiveCamera( fov : Number, aspect : Number, near : Number, far : Number )

  fov — Camera frustum vertical field of view.
  aspect — Camera frustum aspect ratio.
  near — Camera frustum near plane.
  far — Camera frustum far plane.
*/
  var fov = 5;
  var near = 0.1;
  var far = 100;
  var aspecRatio = spec.canvasElement.width / spec.canvasElement.height;
  THREECAMERA = new THREE.PerspectiveCamera(fov, aspecRatio, near, far);

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
    followZRot: true,
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








 