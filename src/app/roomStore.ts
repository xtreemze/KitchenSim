let dimensions = { width: 20, height: 30 };
let wallHeight = 4;
let wallThickness = 0.1;

function setDimensions(width: number, height: number) {
    dimensions = { width, height };
}

function setWallHeight(height: number) {
    wallHeight = height;
}

function setWallThickness(thickness: number) {
    wallThickness = thickness;
}

function getDimensions() {
    return dimensions;
}

function getWallHeight() {
    return wallHeight;
}

function getWallThickness() {
    return wallThickness;
}

export { setDimensions, setWallHeight, setWallThickness, getDimensions, getWallHeight, getWallThickness };