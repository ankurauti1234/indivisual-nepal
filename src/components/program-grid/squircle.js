export const squircleClipPath = (width, height, cornerRadius = 4) => {
  const toRadians = (deg) => (deg * Math.PI) / 180;
  const squircle = (cornerRadius) => (angle) => {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return {
      x: Math.sign(cos) * Math.pow(Math.abs(cos), 2 / cornerRadius),
      y: Math.sign(sin) * Math.pow(Math.abs(sin), 2 / cornerRadius),
    };
  };

  return new Array(360)
    .fill(0)
    .map((_, i) => i)
    .map(toRadians)
    .map(squircle(cornerRadius))
    .map(({ x, y }) => ({
      x: Math.round(((x * width) / 2 + width / 2) * 50) / 50,
      y: Math.round(((y * height) / 2 + height / 2) * 10) / 10,
    }))
    .map(({ x, y }) => `${x}px ${y}px`)
    .join(", ");
};