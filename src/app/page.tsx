import { getLegoColors, LegoColor } from '@/lib/legoClient';

export default async function ColorsPage() {
  // TypeScript automatically knows 'colors' is an array of LegoColor objects
  const colors: LegoColor[] = await getLegoColors();

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">LEGO Color Palette</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {colors.map((color) => (
          <div key={color.id} className="flex items-center gap-4 p-4 border rounded-xl bg-white shadow-sm">
            <div 
              className="w-12 h-12 rounded-lg border shadow-inner"
              style={{ backgroundColor: `#${color.rgb}` }} // TypeScript verifies color.rgb exists!
            />
            <div>
              <h2 className="font-semibold text-slate-700">{color.name}</h2>
              <p className="text-xs text-slate-400">HEX: #{color.rgb}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}