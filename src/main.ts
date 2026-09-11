import './styles/app.css';
import { initializeScene } from './app/SceneManager';
import { setupGUI } from './gui';
import { bindScene } from './models';

export const scene = initializeScene('renderCanvas');
bindScene(scene);
setupGUI();
