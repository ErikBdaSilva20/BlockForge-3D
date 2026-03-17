export function snapToGrid(position) {
  return [
    Math.round(position[0]),
    Math.max(0, Math.floor(position[1])) + 0.5,
    Math.round(position[2])
  ];
}
