import { addAdvancedControls } from './components/settings/AdvancedControls';
import { addBasicControls } from './components/settings/BasicControls';
import { addExpertControls } from './components/settings/ExpertControls';
import { createContainer, createTabs } from './guiHelpers';

export function setupGUI(): void {
    const container = createContainer();
    const basicPanel = document.createElement('div');
    const advancedPanel = document.createElement('div');
    const expertPanel = document.createElement('div');

    createTabs(container, { Basic: basicPanel, Advanced: advancedPanel, Expert: expertPanel });
    container.appendChild(basicPanel);
    container.appendChild(advancedPanel);
    container.appendChild(expertPanel);

    basicPanel.hidden = false;
    advancedPanel.hidden = true;
    expertPanel.hidden = true;

    addBasicControls(basicPanel);
    addAdvancedControls(advancedPanel);
    addExpertControls(expertPanel);
}
