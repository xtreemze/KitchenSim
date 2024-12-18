import { createContainer, createTabs } from './guiHelpers';
import { addBasicControls } from './components/settings/BasicControls';
import { addAdvancedControls } from './components/settings/AdvancedControls';
import { addExpertControls } from './components/settings/ExpertControls';

export function setupGUI() {
  const container = createContainer();

  const basicPanel = document.createElement('div');
  const advancedPanel = document.createElement('div');
  const expertPanel = document.createElement('div');

  createTabs(container, { Basic: basicPanel, Advanced: advancedPanel, Expert: expertPanel });

  container.appendChild(basicPanel);
  container.appendChild(advancedPanel);
  container.appendChild(expertPanel);

  basicPanel.style.display = 'block';
  advancedPanel.style.display = 'none';
  expertPanel.style.display = 'none';

  // Add Basic controls
  addBasicControls(basicPanel);

  // Add Advanced controls
  addAdvancedControls(advancedPanel);

  // Add Expert controls
  addExpertControls(expertPanel);
}
