// Helper to create sliders with labels
export function createSlider(labelText: string, min: number, max: number, defaultValue: number, panel: HTMLElement, unit: string = '') {
    const container = document.createElement('div');
    container.style.display = 'grid';
    container.style.gridTemplateColumns = '1fr 2fr 1fr';
    container.style.gap = '10px';
    container.style.marginBottom = '10px';

    const label = document.createElement('label');
    const sliderId = `slider-${labelText.replace(/\s+/g, '-').toLowerCase()}`;
    label.setAttribute('for', sliderId);
    label.innerText = labelText;
    container.appendChild(label);

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.id = sliderId;
    slider.min = min.toString();
    slider.max = max.toString();
    slider.value = defaultValue.toString();
    slider.oninput = () => {
        valueDisplay.innerText = `${slider.value} ${unit}`;
        // console.log(`${logLabel}:`, slider.value);
    };
    container.appendChild(slider);

    const valueDisplay = document.createElement('span');
    valueDisplay.innerText = `${defaultValue} ${unit}`;
    container.appendChild(valueDisplay);

    panel.appendChild(container);
}

// Helper to create a checkbox group
export function createCheckboxGroup(options: string[], logLabel: string, panel: HTMLElement) {
    const groupContainer = document.createElement('div');
    groupContainer.style.marginBottom = '10px';

    const groupLabel = document.createElement('label');
    groupLabel.innerText = logLabel;
    groupLabel.style.display = 'block';
    groupLabel.style.marginBottom = '5px';
    groupContainer.appendChild(groupLabel);

    options.forEach((option) => {
        const container = document.createElement('div');
        container.style.display = 'grid';
        container.style.gridTemplateColumns = 'auto 1fr';
        container.style.gap = '10px';
        container.style.marginBottom = '5px';

        const checkbox = document.createElement('input');
        const checkboxId = `checkbox-${option.replace(/\s+/g, '-').toLowerCase()}`;
        checkbox.id = checkboxId;
        checkbox.type = 'checkbox';
        checkbox.checked = true;
        checkbox.onchange = () => {
            // console.log(`${logLabel} ${option}:`, checkbox.checked);
        };
        container.appendChild(checkbox);

        const label = document.createElement('label');
        label.setAttribute('for', checkboxId);
        label.innerText = option;
        container.appendChild(label);

        groupContainer.appendChild(container);
    });

    panel.appendChild(groupContainer);
}

// Helper to create radio buttons
export function createRadioGroup(options: string[], logLabel: string, panel: HTMLElement) {
    const groupContainer = document.createElement('div');
    groupContainer.style.marginBottom = '10px';

    const groupLabel = document.createElement('label');
    groupLabel.innerText = logLabel;
    groupLabel.style.display = 'block';
    groupLabel.style.marginBottom = '5px';
    groupContainer.appendChild(groupLabel);

    options.forEach((option) => {
        const container = document.createElement('div');
        container.style.display = 'grid';
        container.style.gridTemplateColumns = 'auto 1fr';
        container.style.gap = '10px';
        container.style.marginBottom = '5px';

        const radioButton = document.createElement('input');
        const radioId = `radio-${option.replace(/\s+/g, '-').toLowerCase()}`;
        radioButton.id = radioId;
        radioButton.type = 'radio';
        radioButton.name = logLabel;
        radioButton.checked = option === options[0];
        // radioButton.onchange = () => {
        //     if (radioButton.checked) console.log(`${logLabel}:`, option);
        // };
        container.appendChild(radioButton);

        const label = document.createElement('label');
        label.setAttribute('for', radioId);
        label.innerText = option;
        container.appendChild(label);

        groupContainer.appendChild(container);
    });

    panel.appendChild(groupContainer);
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

// Helper to create the container
export function createContainer() {
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '400px';
    container.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    container.style.color = 'white';
    container.style.padding = '10px';
    container.style.borderRadius = '8px';
    container.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    container.style.cursor = 'move';
    document.body.appendChild(container);

    makeDraggable(container);

    return container;
}

// Helper to create tabs
export function createTabs(container: HTMLElement, panels: { [key: string]: HTMLElement }) {
    const tabs = document.createElement('div');
    tabs.style.display = 'flex';
    tabs.style.justifyContent = 'space-between';
    tabs.style.marginBottom = '10px';
    container.appendChild(tabs);

    Object.keys(panels).forEach((name) => {
        const button = document.createElement('button');
        button.innerText = name;
        button.style.flex = '1';
        button.style.margin = '0 5px';
        button.style.padding = '10px';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.backgroundColor = 'gray';
        button.style.color = 'white';
        button.style.cursor = 'pointer';
        button.onclick = () => {
            Object.values(panels).forEach(panel => panel.style.display = 'none');
            panels[name].style.display = 'block';
        };
        tabs.appendChild(button);
    });
}

// Helper to create toggle buttons
export function createToggleButton(text: string, onClick: () => void) {
    const button = document.createElement('button');
    button.innerText = text;
    button.style.width = '100%';
    button.style.marginBottom = '10px';
    button.style.padding = '10px';
    button.style.border = 'none';
    button.style.borderRadius = '4px';
    button.style.backgroundColor = 'gray';
    button.style.color = 'white';
    button.style.cursor = 'pointer';
    button.onclick = onClick;
    return button;
}

// Helper to create collapsible sections
export function createCollapsibleSection(titleText: string, panel: HTMLElement) {
    const section = document.createElement('div');
    section.style.marginBottom = '10px';

    const header = document.createElement('button');
    header.innerText = titleText;
    header.style.width = '100%';
    header.style.padding = '10px';
    header.style.border = 'none';
    header.style.borderRadius = '4px';
    header.style.backgroundColor = 'gray';
    header.style.color = 'white';
    header.style.cursor = 'pointer';
    header.onclick = () => {
        content.style.display = content.style.display === 'none' ? 'block' : 'none';
    };
    section.appendChild(header);

    const content = document.createElement('div');
    content.style.display = 'none';
    content.style.padding = '10px';
    content.style.border = '1px solid gray';
    content.style.borderRadius = '4px';
    content.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    section.appendChild(content);

    panel.appendChild(section);
    return content;
}