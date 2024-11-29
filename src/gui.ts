import { Nullable, Scene } from '@babylonjs/core';
import { AdvancedDynamicTexture, Button, IAdvancedDynamicTextureOptions, Slider, StackPanel, Checkbox, RadioButton, TextBlock } from '@babylonjs/gui';

export function createGUI(scene: Nullable<Scene> | IAdvancedDynamicTextureOptions | undefined) {
  const guiTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);

  // Create a stack panel for organized layout
  const stackPanel = new StackPanel();
  stackPanel.width = "220px";
  stackPanel.horizontalAlignment = StackPanel.HORIZONTAL_ALIGNMENT_LEFT;
  stackPanel.verticalAlignment = StackPanel.VERTICAL_ALIGNMENT_CENTER;
  guiTexture.addControl(stackPanel);

  // Add a slider for family size
  const familySizeSlider = new Slider();
  familySizeSlider.minimum = 1;
  familySizeSlider.maximum = 6;
  familySizeSlider.value = 4;
  familySizeSlider.height = "20px";
  familySizeSlider.width = "200px";
  familySizeSlider.onValueChangedObservable.add((value) => {
    console.log("Family Size:", value);
  });
  addLabelToSlider(stackPanel, familySizeSlider, "Family Size:");

  // Add a slider for grocery trip frequency
  const grocerySlider = new Slider();
  grocerySlider.minimum = 1;
  grocerySlider.maximum = 7;
  grocerySlider.value = 3;
  grocerySlider.height = "20px";
  grocerySlider.width = "200px";
  grocerySlider.onValueChangedObservable.add((value) => {
    console.log("Grocery Trip Frequency:", value, "days");
  });
  addLabelToSlider(stackPanel, grocerySlider, "Grocery Trip Frequency (days):");

  // Add a slider for meal preparation frequency
  const mealSlider = new Slider();
  mealSlider.minimum = 1;
  mealSlider.maximum = 4;
  mealSlider.value = 2;
  mealSlider.height = "20px";
  mealSlider.width = "200px";
  mealSlider.onValueChangedObservable.add((value) => {
    console.log("Meal Prep Frequency:", value, "meals/day");
  });
  addLabelToSlider(stackPanel, mealSlider, "Meals Prepared (per day):");

  // Add checkboxes for enabling/disabling major appliances
  const appliancesCheckboxGroup = new StackPanel();
  appliancesCheckboxGroup.isVertical = true;
  appliancesCheckboxGroup.width = "220px";

  const applianceNames = ["Dishwasher", "Microwave", "Oven"];
  applianceNames.forEach((name) => {
    const checkbox = new Checkbox();
    checkbox.width = "20px";
    checkbox.height = "20px";
    checkbox.isChecked = true;
    checkbox.color = "white";
    checkbox.onIsCheckedChangedObservable.add((value) => {
      console.log(`${name} Enabled:`, value);
    });

    const header = new TextBlock();
    header.text = name;
    header.width = "180px";
    header.height = "20px";
    header.textHorizontalAlignment = TextBlock.HORIZONTAL_ALIGNMENT_LEFT;

    const container = new StackPanel();
    container.isVertical = false;
    container.addControl(checkbox);
    container.addControl(header);
    appliancesCheckboxGroup.addControl(container);
  });
  stackPanel.addControl(appliancesCheckboxGroup);

  // Add radio buttons for meal type selection
  const mealTypeGroup = new StackPanel();
  mealTypeGroup.isVertical = true;
  mealTypeGroup.width = "220px";

  const mealTypes = ["Cooked", "Pre-Packaged", "Mixed"];
  mealTypes.forEach((type) => {
    const radioButton = new RadioButton();
    radioButton.group = "mealType";
    radioButton.width = "20px";
    radioButton.height = "20px";
    radioButton.color = "white";
    radioButton.isChecked = type === "Cooked";
    radioButton.onIsCheckedChangedObservable.add((checked) => {
      if (checked) console.log("Meal Type:", type);
    });

    const header = new TextBlock();
    header.text = type;
    header.width = "180px";
    header.height = "20px";
    header.textHorizontalAlignment = TextBlock.HORIZONTAL_ALIGNMENT_LEFT;

    const container = new StackPanel();
    container.isVertical = false;
    container.addControl(radioButton);
    container.addControl(header);
    mealTypeGroup.addControl(container);
  });
  stackPanel.addControl(mealTypeGroup);

  // Add a slider for the day-night cycle
  const dayNightSlider = new Slider();
  dayNightSlider.minimum = 0;
  dayNightSlider.maximum = 24;
  dayNightSlider.value = 12;
  dayNightSlider.height = "20px";
  dayNightSlider.width = "200px";
  dayNightSlider.onValueChangedObservable.add((value) => {
    console.log("Time of Day:", value, "hours");
  });
  addLabelToSlider(stackPanel, dayNightSlider, "Time of Day (hours):");
}

// Helper function to add a labeled slider
function addLabelToSlider(parent: StackPanel, slider: Slider, labelText: string) {
  const label = new TextBlock();
  label.text = labelText;
  label.height = "30px";
  label.color = "white";
  label.textHorizontalAlignment = TextBlock.HORIZONTAL_ALIGNMENT_LEFT;
  parent.addControl(label);
  parent.addControl(slider);
}