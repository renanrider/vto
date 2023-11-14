# Virtual Try-On with Glasses Images and Face Tracking - PoC

This is a proof of concept (PoC) project to create a virtual glasses try-on experience using images of glasses instead of 3D models. The project utilizes Three.js to render a three-dimensional cube with glasses textures and JeelizFaceFilter for real-time face tracking.

## Features

- **Real-time Rendering:** Virtually render glasses over a live camera feed.
- **Face Tracking:** Use JeelizFaceFilter to track the user's face and position the glasses appropriately.
- **Multiple Styles:** Support for different glasses styles, each represented by an image.
- **3D Adjustment:** Three-dimensional adjustment of glasses to better fit the user's face.

## Requirements

- Modern browser with WebGL support.
- Camera for live image capture.

## How to Use

1. Clone the repository: `git clone https://github.com/your-username/repository-name.git`
2. Install dependencies: `npm install`
3. Start the application: `npm server.js`
4. Open the application in a browser: `http://localhost:80`

Make sure to have the glasses images available in the appropriate directory.
