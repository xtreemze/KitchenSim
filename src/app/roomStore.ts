let dimensions = { width: 20, height: 30 };
let wallHeight = 4;
let wallThickness = 0.1;

export function setDimensions(width: number, height: number) {
    dimensions = { width, height };
}

export function setWallHeight(height: number) {
    wallHeight = height;
}

export function setWallThickness(thickness: number) {
    wallThickness = thickness;
}

export function getDimensions() {
    return { ...dimensions };
}

export function getWallHeight() {
    return wallHeight;
}

export function getWallThickness() {
    return wallThickness;
}