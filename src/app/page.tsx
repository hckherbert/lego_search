// src/app/colors/page.tsx

import { getLegoColors, LegoColor } from '@/lib/legoClient';
import { buildRainbowPalette } from '@/lib/colorUtils';

import Button from '@mui/material/Button';

 
export default async function ColorsPage() {
  const rawColors: LegoColor[] = await getLegoColors();
  
  // Magic happens here:
  const rainbowGroups = buildRainbowPalette(rawColors);

  return (
    <main className="p-8 max-w-5xl mx-auto">
      <h1 className="text-4xl font-extrabold mb-8 text-slate-800 tracking-tight">
        The LEGO Color Spectrum
      </h1>
      
      {/* Outer Loop: Iterate over the 11 Color Families */}
      {rainbowGroups.map((group) => (
        <section key={group.familyName} className="mb-12">
          <div className="flex items-center gap-3 mb-4 border-b border-slate-200 pb-2">
            <h2 className="text-2xl font-bold text-slate-700">
              {group.familyName}
            </h2>
            <span className="text-xs font-semibold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
              {group.colors.length} shades
            </span>
          </div>

          {/* Inner Loop: Iterate over the light-to-dark bricks in this family */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {group.colors.map((color) => (
              <div 
                key={color.id} 
                className="flex items-center gap-3 p-3 border rounded-xl bg-white shadow-xs hover:shadow-md transition-shadow"
              >
                <div 
                  className="w-10 h-10 rounded-lg border border-black/10 shadow-inner shrink-0"
                  style={{ backgroundColor: `#${color.rgb}` }}
                />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm text-slate-700 truncate">{color.name}</p>
                  <p className="text-xs font-mono text-slate-400">#{color.rgb}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}