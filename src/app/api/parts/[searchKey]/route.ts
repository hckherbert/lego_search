import { NextResponse } from 'next/server';
import { SearchResult, getParts } from '../../../lib/legoClient';

// Next.js passes the dynamic route parameters in the second argument
export async function GET(
  request: Request,
  { params }: { params: Promise<{ searchKey: string }> }
) {
  try {
    // In Next.js App Router, params is an async object
    const { searchKey } = await params;

    if (!searchKey) {
      return NextResponse.json({ error: 'Search key is required' }, { status: 400 });
    }

    const decodedSearchKey = decodeURIComponent(searchKey);

    const data = await getParts(decodedSearchKey);
    return  NextResponse.json(data);
    
    
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}