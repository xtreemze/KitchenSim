function slugify(value: string): string {
    return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function createSlider(
    labelText: string,
    min: number,
    max: number,
    defaultValue: number,
    panel: HTMLElement,
    unit = ''
): HTMLInputElement {
    const container = document.createElement('div');
    container.className = 'control-row control-row-slider';

    const label = document.createElement('label');
    const sliderId = `slider-${slugify(labelText)}`;
    label.htmlFor = sliderId;
    label.textContent = labelText;
    container.appendChild(label);

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.id = sliderId;
    slider.min = min.toString();
    slider.max = max.toString();
    slider.value = defaultValue.toString();
    container.appendChild(slider);

    const valueDisplay = document.createElement('span');
    valueDisplay.className = 'control-value';
    const updateValue = (): void => {
        valueDisplay.textContent = `${slider.value}${unit ? ` ${unit}` : ''}`;
    };
    slider.addEventListener('input', updateValue);
    updateValue();
    container.appendChild(valueDisplay);

    panel.appendChild(container);
    return slider;
}

export function createCheckboxGroup(
    options: readonly string[],
    labelText: string,
    panel: HTMLElement,
    checkedOptions: readonly string[] = options
): HTMLInputElement[] {
    const groupContainer = document.createElement('fieldset');
    groupContainer.className = 'control-group';

    const legend = document.createElement('legend');
    legend.textContent = labelText;
    groupContainer.appendChild(legend);

    const groupName = `checkbox-${slugify(labelText)}`;
    const inputs = options.map((option) => {
        const container = document.createElement('label');
        container.className = 'control-choice';

        const checkbox = document.createElement('input');
        checkbox.id = `${groupName}-${slugify(option)}`;
        checkbox.name = groupName;
        checkbox.value = option;
        checkbox.type = 'checkbox';
        checkbox.checked = checkedOptions.includes(option);
        container.appendChild(checkbox);

        const text = document.createElement('span');
        text.textContent = option;
        container.appendChild(text);

        groupContainer.appendChild(container);
        return checkbox;
    });

    panel.appendChild(groupContainer);
    return inputs;
}

export function createRadioGroup(
    options: readonly string[],
    labelText: string,
    panel: HTMLElement,
    defaultValue: string = options[0] ?? ''
): HTMLInputElement[] {
    const groupContainer = document.createElement('fieldset');
    groupContainer.className = 'control-group';

    const legend = document.createElement('legend');
    legend.textContent = labelText;
    groupContainer.appendChild(legend);

    const groupName = `radio-${slugify(labelText)}`;
    const inputs = options.map((option) => {
        const container = document.createElement('label');
        container.className = 'control-choice';

        const radioButton = document.createElement('input');
        radioButton.id = `${groupName}-${slugify(option)}`;
        radioButton.type = 'radio';
        radioButton.name = groupName;
        radioButton.value = option;
        radioButton.checked = option === defaultValue;
        container.appendChild(radioButton);

        const text = document.createElement('span');
        text.textContent = option;
        container.appendChild(text);

        groupContainer.appendChild(container);
        return radioButton;
    });

    panel.appendChild(groupContainer);
    return inputs;
}

export function createTitle(text: string): HTMLHeadingElement {
    const title = document.createElement('h3');
    title.textContent = text;
    return title;
}

export function makeDraggable(element: HTMLElement): void {
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    element.addEventListener('mousedown', (event) => {
        const target = event.target as HTMLElement;
        if (['INPUT', 'BUTTON', 'LABEL'].includes(target.tagName)) {
            return;
        }
        isDragging = true;
        offsetX = event.clientX - element.offsetLeft;
        offsetY = event.clientY - element.offsetTop;
    });

    document.addEventListener('mousemove', (event) => {
        if (!isDragging) {
            return;
        }
        element.style.left = `${event.clientX - offsetX}px`;
        element.style.top = `${event.clientY - offsetY}px`;
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
}

export function createContainer(): HTMLDivElement {
    const container = document.createElement('div');
    container.className = 'control-panel';
    document.body.appendChild(container);
    makeDraggable(container);
    return container;
}

export function createTabs(container: HTMLElement, panels: Record<string, HTMLElement>): void {
    const tabs = document.createElement('div');
    tabs.className = 'control-tabs';
    container.appendChild(tabs);

    Object.entries(panels).forEach(([name, selectedPanel], index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = name;
        button.className = 'control-tab';
        button.setAttribute('aria-pressed', index === 0 ? 'true' : 'false');
        button.addEventListener('click', () => {
            Object.values(panels).forEach((panel) => {
                panel.hidden = true;
            });
            tabs.querySelectorAll('button').forEach((tab) => tab.setAttribute('aria-pressed', 'false'));
            selectedPanel.hidden = false;
            button.setAttribute('aria-pressed', 'true');
        });
        tabs.appendChild(button);
    });
}

export function createToggleButton(text: string, onClick: () => void): HTMLButtonElement {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = text;
    button.className = 'primary-control';
    button.addEventListener('click', onClick);
    return button;
}

export function createCollapsibleSection(titleText: string, panel: HTMLElement): HTMLDivElement {
    const section = document.createElement('section');
    section.className = 'control-section';

    const header = document.createElement('button');
    header.type = 'button';
    header.textContent = titleText;
    header.className = 'section-toggle';
    header.setAttribute('aria-expanded', 'false');
    section.appendChild(header);

    const content = document.createElement('div');
    content.className = 'section-content';
    content.hidden = true;
    section.appendChild(content);

    header.addEventListener('click', () => {
        content.hidden = !content.hidden;
        header.setAttribute('aria-expanded', String(!content.hidden));
    });

    panel.appendChild(section);
    return content;
}
