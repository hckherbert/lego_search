// src/lib/colorUtils.ts
import { LegoColor } from "./legoClient";

// src/lib/colorUtils.ts

// (Keep your existing getLuminance function at the top of the file!)

export interface ColorGroup {
  familyName: string;
  rank: number;
  colors: LegoColor[];
}


/**
 * Calculates the relative luminance of a hex color code based on WCAG standards.
 * Returns a value between 0 (darkest/black) and 1 (lightest/white).
 */
export function getLuminance(hex: string): number {
  // Clear out a leading '#' if it accidentally got attached
  const cleanHex = hex.replace("#", "");

  // Parse the hex string into base-10 integers for Red, Green, and Blue
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  // Apply the standard WCAG relative luminance coefficients
  // Human eyes perceive green as much brighter than red, and red brighter than blue.
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Sorts an array of LegoColor objects from lightest to darkest.
 */
export function sortColorsLightToDark(colors: LegoColor[]): LegoColor[] {
  // We make a copy of the array using [...colors] because .sort() mutates the original array
  return [...colors].sort((colorA, colorB) => {
    const luminanceA = getLuminance(colorA.rgb);
    const luminanceB = getLuminance(colorB.rgb);

    // Lightest to Darkest: High luminance goes first
    return luminanceB - luminanceA;
  });
}
/**
 * Logic waterfall to assign a Rebrickable color to a parent Rainbow Family
 */
function categorizeColor(color: LegoColor): { family: string; rank: number } {
  // 1. Catch all transparents immediately and send to the back
  if (color.is_trans) {
    return { family: "Transparent", rank: 11 };
  }

  const name = color.name.toLowerCase();

  // 2. Catch Metallics & Chromes next
  if (/gold|silver|chrome|copper|pearl|metal|speckle/i.test(name)) {
    return { family: "Metallic & Pearl", rank: 10 };
  }

  // 3. The Rainbow Waterfall (Order of testing matters!)
  if (/pink|rose|salmon/i.test(name)) return { family: "Pinks", rank: 7 };
  if (/purple|violet|lavender|lilac|plum|magenta/i.test(name)) return { family: "Purples & Lavenders", rank: 6 };
  if (/blue|azure|cyan|teal/i.test(name)) return { family: "Blues", rank: 5 };
  if (/green|lime|olive/i.test(name)) return { family: "Greens", rank: 4 };
  if (/yellow|amber/i.test(name)) return { family: "Yellows", rank: 3 };
  if (/orange|tangerine/i.test(name)) return { family: "Oranges", rank: 2 };
  
  // Note: We use \b (word boundary) so "Reddish Brown" doesn't get sucked into "Reds"
  if (/\bred\b|crimson|maroon/i.test(name)) return { family: "Reds", rank: 1 };
  
  if (/brown|tan|nougat|flesh|earth|khaki/i.test(name)) return { family: "Earth & Tans", rank: 8 };
  if (/white|grey|gray|black/i.test(name)) return { family: "Monochrome", rank: 9 };

  return { family: "Other / Unsorted", rank: 12 };
}

/**
 * Takes the raw list, buckets them, and runs a double-sort
 */
export function buildRainbowPalette(rawColors: LegoColor[]): ColorGroup[] {
  const groupMap = new Map<string, ColorGroup>();

  // Step 1: Drop every brick into its respective family bucket
  rawColors.forEach((color) => {
    const { family, rank } = categorizeColor(color);

    if (!groupMap.has(family)) {
      groupMap.set(family, { familyName: family, rank, colors: [] });
    }
    groupMap.get(family)!.colors.push(color);
  });

  const palette = Array.from(groupMap.values());

  // Step 2: Sort the overall groups in Rainbow order (Rank 1 -> 11)
  palette.sort((a, b) => a.rank - b.rank);

  // Step 3: Sort the specific colors inside each group Lightest -> Darkest
  palette.forEach((group) => {
    group.colors.sort((a, b) => getLuminance(b.rgb) - getLuminance(a.rgb));
  });

  return palette;
}