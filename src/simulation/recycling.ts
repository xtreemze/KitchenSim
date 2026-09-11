import { RecyclingRegion, WasteCategory } from './types';

interface RecyclingRule {
    recyclable: readonly WasteCategory[];
    compostable: readonly WasteCategory[];
    recyclingCaptureRate: number;
    compostCaptureRate: number;
    hazardousCaptureRate: number;
}

export interface WasteProcessingResult {
    recycledKg: number;
    compostedKg: number;
    landfillKg: number;
    correctlySortedKg: number;
    sortableKg: number;
}

export const RECYCLING_RULES: Record<RecyclingRegion, RecyclingRule> = {
    USA: {
        recyclable: ['Plastic', 'Glass', 'Paper', 'Metal'],
        compostable: ['Compost'],
        recyclingCaptureRate: 0.62,
        compostCaptureRate: 0.55,
        hazardousCaptureRate: 0.72
    },
    Japan: {
        recyclable: ['Plastic', 'Glass', 'Paper', 'Metal'],
        compostable: ['Compost'],
        recyclingCaptureRate: 0.9,
        compostCaptureRate: 0.38,
        hazardousCaptureRate: 0.92
    },
    EU: {
        recyclable: ['Plastic', 'Glass', 'Paper', 'Metal'],
        compostable: ['Compost'],
        recyclingCaptureRate: 0.82,
        compostCaptureRate: 0.8,
        hazardousCaptureRate: 0.88
    }
};

export function processWaste(
    waste: Record<WasteCategory, number>,
    region: RecyclingRegion,
    enabledCategories: readonly WasteCategory[]
): WasteProcessingResult {
    const rule = RECYCLING_RULES[region];
    let recycledKg = 0;
    let compostedKg = 0;
    let landfillKg = 0;
    let correctlySortedKg = 0;
    let sortableKg = 0;

    (Object.keys(waste) as WasteCategory[]).forEach((category) => {
        const amount = waste[category];
        if (amount <= 0) {
            return;
        }

        const isRecyclable = rule.recyclable.includes(category);
        const isCompostable = rule.compostable.includes(category);
        const isHazardous = category === 'Hazardous';
        const requiresSorting = isRecyclable || isCompostable || isHazardous;
        const sortingEnabled = enabledCategories.includes(category);

        if (requiresSorting) {
            sortableKg += amount;
        }

        if (!sortingEnabled && requiresSorting) {
            landfillKg += amount;
            return;
        }

        if (isRecyclable) {
            const captured = amount * rule.recyclingCaptureRate;
            recycledKg += captured;
            landfillKg += amount - captured;
            correctlySortedKg += captured;
            return;
        }

        if (isCompostable) {
            const captured = amount * rule.compostCaptureRate;
            compostedKg += captured;
            landfillKg += amount - captured;
            correctlySortedKg += captured;
            return;
        }

        if (isHazardous) {
            const captured = amount * rule.hazardousCaptureRate;
            correctlySortedKg += captured;
            landfillKg += amount;
            return;
        }

        landfillKg += amount;
    });

    return {
        recycledKg,
        compostedKg,
        landfillKg,
        correctlySortedKg,
        sortableKg
    };
}
