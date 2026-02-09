// "#2B4B38" -> [43, 75, 56]
export const hexToRgb = (hex: string): number[] => {
  const clean = hex.replace("#", "");
  return [
    parseInt(clean.substring(0, 2), 16),
    parseInt(clean.substring(2, 4), 16),
    parseInt(clean.substring(4, 6), 16),
  ];
};

// Blends colour1 & colour2 based on the ratio [0, 1]
// When ratio = 0, output = colour1
// When ratio = 1, output = colour2
export function interpolateColours(
  colour1: number[],
  colour2: number[],
  ratio: number
): number[] {
  return colour1.map((val, idx) =>
    Math.round(val + (colour2[idx] - val) * ratio)
  );
}

//  [43, 75, 56] -> "rgb(43,75,56)""
export const rgbToCss = (colour: number[]) => `rgb(${colour.join(",")})`;
