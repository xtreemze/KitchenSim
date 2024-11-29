
import { StackPanel, Slider, Checkbox, RadioButton, TextBlock, Control } from "@babylonjs/gui";

// Helper to create sliders with labels
export function createSlider(labelText: string, min: number, max: number, defaultValue: number, logLabel: string, panel: StackPanel) {
    const label = new TextBlock();
    label.text = labelText;
    label.height = "30px";
    label.color = "white";
    label.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    panel.addControl(label);

    const slider = new Slider();
    slider.minimum = min;
    slider.maximum = max;
    slider.value = defaultValue;
    slider.height = "20px";
    slider.width = "250px";
    slider.onValueChangedObservable.add((value) => {
        console.log(`${logLabel}:`, value);
    });
    panel.addControl(slider);
}

// Helper to create a checkbox group
export function createCheckboxGroup(options: string[], logLabel: string, panel: StackPanel) {
    options.forEach((option) => {
        const checkbox = new Checkbox();
        checkbox.width = "20px";
        checkbox.height = "20px";
        checkbox.isChecked = true;
        checkbox.color = "white";
        checkbox.onIsCheckedChangedObservable.add((value) => {
            console.log(`${logLabel} ${option}:`, value);
        });

        const header = new TextBlock();
        header.text = option;
        header.width = "200px";
        header.height = "30px";
        header.color = "white";
        header.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;

        const container = new StackPanel();
        container.isVertical = false;
        container.addControl(checkbox);
        container.addControl(header);

        panel.addControl(container);
    });
}

// Helper to create radio buttons
export function createRadioGroup(options: string[], logLabel: string, panel: StackPanel) {
    options.forEach((option) => {
        const radioButton = new RadioButton();
        radioButton.group = "radioGroup";
        radioButton.width = "20px";
        radioButton.height = "20px";
        radioButton.color = "white";
        radioButton.isChecked = option === options[0]; // Default first option checked
        radioButton.onIsCheckedChangedObservable.add((checked) => {
            if (checked) console.log(`${logLabel}:`, option);
        });

        const header = new TextBlock();
        header.text = option;
        header.width = "200px";
        header.height = "30px";
        header.color = "white";
        header.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;

        const container = new StackPanel();
        container.isVertical = false;
        container.addControl(radioButton);
        container.addControl(header);

        panel.addControl(container);
    });
}

// Helper to create titles
export function createTitle(text: string) {
    const title = new TextBlock();
    title.text = text;
    title.height = "40px";
    title.color = "white";
    title.fontSize = "20px";
    title.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    return title;
}