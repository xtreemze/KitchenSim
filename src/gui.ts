
import { AdvancedDynamicTexture, Button, Slider } from '@babylonjs/gui';

const guiTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");

// Add a button
const button = Button.CreateSimpleButton("btn", "Click Me");
button.width = "150px";
button.height = "40px";
button.onPointerClickObservable.add(() => {
  console.log("Button clicked!");
});
guiTexture.addControl(button);

// Add a slider
const slider = new Slider();
slider.minimum = 1;
slider.maximum = 10;
slider.value = 5;
slider.onValueChangedObservable.add(value => {
  console.log("Slider value:", value);
});
guiTexture.addControl(slider);