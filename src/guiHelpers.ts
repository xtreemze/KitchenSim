// Helper to create sliders with labels
export function createSlider(labelText: string, min: number, max: number, defaultValue: number, logLabel: string, panel: HTMLElement) {
    const container = document.createElement('div');
    container.style.display = 'grid';
    container.style.gridTemplateColumns = '1fr 1fr';
    container.style.gap = '10px';
    container.style.marginBottom = '10px';

    const label = document.createElement('label');
    label.innerText = labelText;
    container.appendChild(label);

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = min.toString();
    slider.max = max.toString();
    slider.value = defaultValue.toString();
    slider.oninput = () => {
        console.log(`${logLabel}:`, slider.value);
    };
    container.appendChild(slider);

    panel.appendChild(container);
}

// Helper to create a checkbox group
export function createCheckboxGroup(options: string[], logLabel: string, panel: HTMLElement) {
    options.forEach((option) => {
        const container = document.createElement('div');
        container.style.display = 'grid';
        container.style.gridTemplateColumns = 'auto 1fr';
        container.style.gap = '10px';
        container.style.marginBottom = '10px';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = true;
        checkbox.onchange = () => {
            console.log(`${logLabel} ${option}:`, checkbox.checked);
        };
        container.appendChild(checkbox);

        const label = document.createElement('label');
        label.innerText = option;
        container.appendChild(label);

        panel.appendChild(container);
    });
}

// Helper to create radio buttons
export function createRadioGroup(options: string[], logLabel: string, panel: HTMLElement) {
    options.forEach((option) => {
        const container = document.createElement('div');
        container.style.display = 'grid';
        container.style.gridTemplateColumns = 'auto 1fr';
        container.style.gap = '10px';
        container.style.marginBottom = '10px';

        const radioButton = document.createElement('input');
        radioButton.type = 'radio';
        radioButton.name = logLabel;
        radioButton.checked = option === options[0];
        radioButton.onchange = () => {
            if (radioButton.checked) console.log(`${logLabel}:`, option);
        };
        container.appendChild(radioButton);

        const label = document.createElement('label');
        label.innerText = option;
        container.appendChild(label);

        panel.appendChild(container);
    });
}

// Helper to create titles
export function createTitle(text: string) {
    const title = document.createElement('h3');
    title.innerText = text;
    title.style.marginBottom = '10px';
    return title;
}

// Make the container draggable
export function makeDraggable(element: HTMLElement) {
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    element.onmousedown = (e) => {
        if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'BUTTON') {
            return;
        }
        isDragging = true;
        offsetX = e.clientX - element.offsetLeft;
        offsetY = e.clientY - element.offsetTop;
        document.onmousemove = (e) => {
            if (isDragging) {
                element.style.left = `${e.clientX - offsetX}px`;
                element.style.top = `${e.clientY - offsetY}px`;
            }
        };
        document.onmouseup = () => {
            isDragging = false;
            document.onmousemove = null;
            document.onmouseup = null;
        };
    };
}