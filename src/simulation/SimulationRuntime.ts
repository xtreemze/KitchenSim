import { SimulationEngine } from './SimulationEngine';
import { KitchenSimulationConfig, SimulationSnapshot } from './types';

type SnapshotListener = (snapshot: SimulationSnapshot, running: boolean) => void;

export class SimulationRuntime {
    private readonly engine = new SimulationEngine();
    private readonly listeners = new Set<SnapshotListener>();
    private timerId: number | null = null;

    updateConfig(updates: Partial<KitchenSimulationConfig>): SimulationSnapshot {
        const snapshot = this.engine.updateConfig(updates);
        if (updates.simulationSpeed !== undefined && this.timerId !== null) {
            this.schedule();
        }
        this.emit(snapshot);
        return snapshot;
    }

    start(): SimulationSnapshot {
        if (this.timerId === null) {
            const snapshot = this.engine.step();
            this.schedule();
            this.emit(snapshot);
            return snapshot;
        }
        return this.engine.getSnapshot();
    }

    stop(): SimulationSnapshot {
        if (this.timerId !== null) {
            window.clearInterval(this.timerId);
            this.timerId = null;
        }
        const snapshot = this.engine.getSnapshot();
        this.emit(snapshot);
        return snapshot;
    }

    toggle(): SimulationSnapshot {
        return this.timerId === null ? this.start() : this.stop();
    }

    step(): SimulationSnapshot {
        const snapshot = this.engine.step();
        this.emit(snapshot);
        return snapshot;
    }

    reset(): SimulationSnapshot {
        const snapshot = this.engine.reset();
        this.emit(snapshot);
        return snapshot;
    }

    getSnapshot(): SimulationSnapshot {
        return this.engine.getSnapshot();
    }

    isRunning(): boolean {
        return this.timerId !== null;
    }

    subscribe(listener: SnapshotListener): () => void {
        this.listeners.add(listener);
        listener(this.engine.getSnapshot(), this.isRunning());
        return () => {
            this.listeners.delete(listener);
        };
    }

    private schedule(): void {
        if (this.timerId !== null) {
            window.clearInterval(this.timerId);
        }
        const { simulationSpeed } = this.engine.getSnapshot().config;
        const intervalMs = Math.max(350, Math.round(2200 / simulationSpeed));
        this.timerId = window.setInterval(() => {
            this.emit(this.engine.step());
        }, intervalMs);
    }

    private emit(snapshot: SimulationSnapshot): void {
        this.listeners.forEach((listener) => listener(snapshot, this.isRunning()));
    }
}

export const simulationRuntime = new SimulationRuntime();
