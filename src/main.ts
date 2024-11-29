import { Engine, Scene, ArcRotateCamera, HemisphericLight, Vector3, MeshBuilder } from '@babylonjs/core';
import { createGUI } from './gui'; // Import the GUI module
import { createCabinet } from './components/Cabinet'; // Import the Cabinet component

// Get canvas element
const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;

// Create Babylon.js engine and scene
const engine = new Engine(canvas, true);
const scene = new Scene(engine);

// Add a camera
const camera = new ArcRotateCamera("camera", Math.PI / 2, Math.PI / 3, 10, new Vector3(0, 0, 0), scene);
camera.attachControl(canvas, true);

// Add a light
const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);

// Add a simple ground
const ground = MeshBuilder.CreateGround("ground", { width: 10, height: 10 }, scene);

// Add a cabinet to the scene
const cabinet = createCabinet(scene);

// Create GUI
createGUI(scene);

// Start rendering the scene
engine.runRenderLoop(() => {
  scene.render();
});
