import { SimulationSnapshot } from './types';

export interface SimulationDashboard {
    update(snapshot: SimulationSnapshot, running: boolean): void;
    setVisible(visible: boolean): void;
    setAvatarSelection(label: string, action: string): void;
}

function metricRow(label: string): { row: HTMLDivElement; value: HTMLSpanElement } {
    const row = document.createElement('div');
    row.className = 'metric-row';

    const key = document.createElement('span');
    key.textContent = label;
    row.appendChild(key);

    const value = document.createElement('span');
    value.className = 'metric-value';
    row.appendChild(value);

    return { row, value };
}

function formatStage(stage: string): string {
    return stage.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}

export function createSimulationDashboard(): SimulationDashboard {
    const root = document.createElement('aside');
    root.className = 'simulation-dashboard';
    root.setAttribute('aria-live', 'polite');

    const heading = document.createElement('div');
    heading.className = 'dashboard-heading';
    heading.textContent = 'Kitchen telemetry';
    root.appendChild(heading);

    const status = document.createElement('div');
    status.className = 'dashboard-status';
    root.appendChild(status);

    const avatarStatus = document.createElement('div');
    avatarStatus.className = 'dashboard-avatar-status';
    avatarStatus.textContent = 'Select an avatar to inspect its current task.';
    root.appendChild(avatarStatus);

    const metricsContainer = document.createElement('div');
    metricsContainer.className = 'metrics-grid';
    root.appendChild(metricsContainer);

    const rows = {
        inventory: metricRow('Groceries'),
        consumed: metricRow('Consumed'),
        meals: metricRow('Meals served'),
        utensils: metricRow('Utensil uses'),
        waste: metricRow('Waste'),
        recycling: metricRow('Recycling'),
        bin: metricRow('Bin fill'),
        energy: metricRow('Energy'),
        water: metricRow('Water'),
        cycles: metricRow('Cycles')
    };

    Object.values(rows).forEach(({ row }) => metricsContainer.appendChild(row));

    const eventHeading = document.createElement('div');
    eventHeading.className = 'dashboard-subheading';
    eventHeading.textContent = 'Recent activity';
    root.appendChild(eventHeading);

    const events = document.createElement('ol');
    events.className = 'dashboard-events';
    root.appendChild(events);

    document.body.appendChild(root);

    return {
        update(snapshot: SimulationSnapshot, running: boolean): void {
            const { metrics, config } = snapshot;
            status.textContent = `${running ? 'Running' : 'Paused'} · ${formatStage(metrics.currentStage)} · ${config.recyclingRegion}`;
            rows.inventory.value.textContent = `${metrics.groceryInventoryKg.toFixed(1)} kg`;
            rows.consumed.value.textContent = `${metrics.groceryConsumedKg.toFixed(1)} kg`;
            rows.meals.value.textContent = metrics.mealsServed.toString();
            rows.utensils.value.textContent = metrics.utensilUses.toString();
            rows.waste.value.textContent = `${metrics.wasteGeneratedKg.toFixed(1)} kg`;
            rows.recycling.value.textContent = `${metrics.recyclingAccuracyPercent.toFixed(0)}%`;
            rows.bin.value.textContent = `${metrics.binFillLiters.toFixed(1)} / ${config.binCapacityLiters.toFixed(0)} L`;
            rows.energy.value.textContent = `${metrics.energyKWh.toFixed(2)} kWh`;
            rows.water.value.textContent = `${metrics.waterLiters.toFixed(1)} L`;
            rows.cycles.value.textContent = metrics.cycleCount.toString();

            events.replaceChildren();
            snapshot.recentEvents.slice(0, 4).forEach((event) => {
                const item = document.createElement('li');
                item.textContent = event.message;
                events.appendChild(item);
            });
        },
        setVisible(visible: boolean): void {
            root.hidden = !visible;
        },
        setAvatarSelection(label: string, action: string): void {
            avatarStatus.textContent = `${label}: ${action}`;
        }
    };
}
