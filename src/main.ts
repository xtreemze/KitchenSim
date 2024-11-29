import { initializeScene } from './app/SceneManager';
import { setupGUI } from './gui';

// Create GUI
setupGUI();

// Initialize the scene
export const scene = initializeScene('renderCanvas');
