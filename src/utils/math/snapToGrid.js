export function snapToGrid(position) {
  return [
    Math.floor(position[0]) + 0.5,
    Math.max(0, Math.floor(position[1])) + 0.5,
    Math.floor(position[2]) + 0.5
  ];
}
