export function generateDecrementingHexValues(
  startHex: string,
  steps: number,
): string[] {
  // Convert the starting hexadecimal string to a decimal number
  let currentValue = parseInt(startHex, 16);

  // Initialize an empty array to store the results
  const results: string[] = [];

  // Loop from the starting number down to -100 (inclusive)
  for (let i = steps; i >= 0; i--) {
    currentValue--;

    results.push(currentValue.toString(16));
  }

  return results;
}
