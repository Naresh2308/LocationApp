/**
 * Decodes a flexible polyline string into an array of [latitude, longitude] pairs.
 * This is a simplified decoder that assumes:
 *   - The polyline is 2D (no third dimension)
 *   - A fixed precision of 5 (i.e. multiply by 1e-5)
 *   - A simplified header (skips the first 3 characters)
 *
 * @param polyline The flexible polyline encoded string.
 * @returns An array of coordinate pairs: [latitude, longitude]
 */
export function decode(polyline: string): number[][] {
    let index = 0;
    const result: number[][] = [];
    let lat = 0;
    let lng = 0;
    const multiplier = 1e-5;
  
    // For simplicity, we skip the header.
    // Note: The official flexible polyline header may vary in length.
    index = 3;
  
    while (index < polyline.length) {
      // Decode latitude difference
      const { value: deltaLat, index: nextIndex1 } = decodeSigned(polyline, index);
      index = nextIndex1;
      lat += deltaLat;
  
      // Decode longitude difference
      const { value: deltaLng, index: nextIndex2 } = decodeSigned(polyline, index);
      index = nextIndex2;
      lng += deltaLng;
  
      result.push([lat * multiplier, lng * multiplier]);
    }
  
    return result;
  }
  
  /**
   * Decodes a signed number from the polyline starting at the given index.
   * Returns the decoded number and the updated index.
   *
   * @param polyline The encoded polyline string.
   * @param start The starting index.
   * @returns An object with the decoded value and the new index.
   */
  function decodeSigned(polyline: string, start: number): { value: number; index: number } {
    let result = 0;
    let shift = 0;
    let index = start;
    let byte: number;
  
    do {
      byte = charToValue(polyline.charAt(index++));
      result |= (byte & 0x1F) << shift;
      shift += 5;
    } while (byte >= 0x20);
  
    const value = (result >> 1) ^ (-(result & 1));
    return { value, index };
  }
  
  /**
   * Converts a character to its corresponding value using the modified base64 alphabet.
   *
   * The alphabet used by flexible polyline is:
   * "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"
   *
   * @param char The character to convert.
   * @returns The numerical value.
   */
  function charToValue(char: string): number {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
    return alphabet.indexOf(char);
  }
  