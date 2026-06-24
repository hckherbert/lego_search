export interface LegoColor {
  id: number;
  name: string;
  rgb: string;
  is_trans: boolean;
}

export async function getLegoColors(): Promise<LegoColor[]> {
  const apiKey = process.env.REBRICKABLE_API_KEY;

  if (!apiKey) {
    throw new Error("Missing REBRICKABLE_API_KEY in environment variables.");
  }

  const res = await fetch(`${process.env.API_BASE_URL}lego/colors`, {
    headers: {
      'Authorization': `key ${apiKey}`
    }
  });

  if (!res.ok) {
    throw new Error('Failed to fetch Lego colors');
  }

  const data = await res.json();
  return data.results as LegoColor[];
}