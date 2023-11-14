"use strict";
let THREECAMERA;

// callback : launched if a face is detected or lost.
function detect_callback(isDetected) {
  if (isDetected) {
    console.log("INFO in detect_callback() : DETECTED");
  } else {
    console.log("INFO in detect_callback() : LOST");
  }
}

function createCamera(spec) {
  //CREATE THE CAMERA

  /*
  PerspectiveCamera( fov : Number, aspect : Number, near : Number, far : Number )

  fov — Camera frustum vertical field of view.
  aspect — Camera frustum aspect ratio.
  near — Camera frustum near plane.
  far — Camera frustum far plane.
*/
  const fov = 5;
  const near = 0.1;
  const far = 100;
  const aspecRatio = spec.canvasElement.width / spec.canvasElement.height;
  THREECAMERA = new THREE.PerspectiveCamera(fov, aspecRatio, near, far);
}

function createCube() {
  //Cube config
  const boxWidth = 1;
  const boxHeight = 1;
  const boxDepth = 1;
  const geometry = new THREE.BoxBufferGeometry(boxWidth, boxHeight, boxDepth);

  //TextureLoader
  const loader = new THREE.TextureLoader();

  const materials = [
    new THREE.MeshBasicMaterial({
      map: loader.load("./glasses/glasses-3/glasses-3-side-Left.png"),
      transparent: true,
      opacity: 1,
      color: 0xffffff,
    }), //left side
    new THREE.MeshBasicMaterial({
      map: loader.load("./glasses/glasses-3/glasses-3-side-Right.png"),
      transparent: true,
      opacity: 1,
      color: 0xffffff,
    }), //right side
    new THREE.MeshBasicMaterial({
      map: loader.load("./glasses/glasses-3/glasses-3-side-Right.png"),
      transparent: true,
      opacity: 0.0,
      color: 0xff0000,
    }), //top side - unused
    new THREE.MeshBasicMaterial({
      map: loader.load("./glasses/glasses-3/glasses-3-side-Right.png"),
      transparent: true,
      opacity: 0.0,
      color: 0xff0000,
    }), //bottom side - unused
    new THREE.MeshBasicMaterial({
      map: loader.load("./glasses/glasses-3/glasses-3-front.png"),
      transparent: true,
      opacity: 1,
      color: 0xffffff,
    }), //front side - unused
    new THREE.MeshBasicMaterial({
      map: loader.load("./glasses/glasses-3/glasses-3-side-Right.png"),
      transparent: true,
      opacity: 0.0,
      color: 0xff0000,
    }), //back side -unused
  ];

  // In this cube the texture of the glasses will be applied
  const cube = new THREE.Mesh(geometry, materials);
  cube.frustumCulled = false;
  cube.scale.multiplyScalar(1.1); //1.1
  cube.position.setY(0.25); //move glasses a bit up 0.05
  cube.position.setZ(0.02); //move glasses a bit forward 0.25
  cube.rotation.x -= 0.1;
  window.zou = cube;
  addDragEventListener(cube);
  return cube;
}

function createAmbientLight() {
  return new THREE.AmbientLight(0xffffff, 1);
}

function createDirectionalLight() {
  const dirLight = new THREE.DirectionalLight(0xffffff);
  dirLight.position.set(100, 1000, 100);
  return dirLight;
}

// build the 3D. called once when Jeeliz Face Filter is OK
function initThreeScene(spec) {
  const threeStuffs = THREE.JeelizHelper.init(spec, detect_callback);
  threeStuffs.faceObject.add(createCube());
  threeStuffs.scene.add(createAmbientLight());
  threeStuffs.scene.add(createDirectionalLight());
  createCamera(spec);
} // end initThreeScene()

function changeGlasses() {
  currentTextureIndex = (currentTextureIndex + 1) % textures.length;
  const newTexture = textures[currentTextureIndex];
  window.zou.material.map = new THREE.TextureLoader().load(newTexture);
  console.log("Texture changed to:", newTexture);
}
//launched by body.onload() :
function main() {
  JeelizResizer.size_canvas({
    canvasId: "jeeFaceFilterCanvas",
    callback: function (isError, bestVideoSettings) {
      init_faceFilter(bestVideoSettings);
    },
  });
} //end main()

function init_faceFilter(videoSettings) {
  JEEFACEFILTERAPI.init({
    followZRot: true,
    canvasId: "jeeFaceFilterCanvas",
    NNCpath: "./dist/", // root of NNC.json file
    videoSettings: videoSettings,
    callbackReady: function (errCode, spec) {
      if (errCode) {
        console.log("AN ERROR HAPPENS. ERR =", errCode);
        return;
      }

      console.log("INFO : JEEFACEFILTERAPI IS READY");
      initThreeScene(spec);
    }, // end callbackReady()

    // called at each render iteration (drawing loop)
    callbackTrack: function (detectState) {
      THREE.JeelizHelper.render(detectState, THREECAMERA);
    }, // end callbackTrack()
  }); // end JEEFACEFILTERAPI.init call
} // end main()
