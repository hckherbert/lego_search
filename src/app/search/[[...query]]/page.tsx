'use client';

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { Box, TextField, Button } from '@mui/material';

export default function SearchBar() {
  const router = useRouter();
  const params = useParams();
  
  const queryArray = params?.query;
  const urlQuery = queryArray && Array.isArray(queryArray) && queryArray 
    ? decodeURIComponent(queryArray) 
    : '';

  const [searchQuery, setSearchQuery] = useState(urlQuery);
  
  // Keep track of the last successful fetch to deduplicate rapid back-to-back triggers
  const lastFetchTrack = useRef({ query: '', time: 0 });

  // 1. Core API Fetching Function
  const executeSearch = async (queryText: string) => {
    if (!queryText.trim()) return;

    const now = Date.now();
    // If we are searching the same thing within 300ms, block the second duplicate call completely
    if (lastFetchTrack.current.query === queryText && (now - lastFetchTrack.current.time) < 300) {
      return;
    }

    // Update tracker immediately before making the network request
    lastFetchTrack.current = { query: queryText, time: now };

    console.log('🚀 Executing API fetch for:', queryText);
    try {
      const res = await fetch(`/api/parts/${encodeURIComponent(queryText)}`);
      if (!res.ok) throw new Error('Failed to fetch parts');
      const data = await res.json();
      console.log('✅ Search results received:', data);
    } catch (error) {
      console.error('❌ API Error:', error);
    }
  };

  // 2. Handle button click / Enter key press
  const handleSearchClick = () => {
    if (!searchQuery.trim()) {
      router.push('/search');
      return;
    }
    
    // Push the new URL. The useEffect below handles capturing it and executing.
    router.push(`/search/${encodeURIComponent(searchQuery)}`);
  };

  // 3. Keep the textfield text synchronized if the user hits back/forward in browser
  useEffect(() => {
    setSearchQuery(urlQuery);
  }, [urlQuery]);

  // 4. Single Source of Truth for API executions
  useEffect(() => {
    if (urlQuery) {
      executeSearch(urlQuery);
    }
  }, [urlQuery]); 

  return (
    <Box sx={{ display: 'flex', gap: 1, p: 2, maxWidth: 500 }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Type your search here..."
        size="small"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSearchClick();
        }}
      />
      <Button variant="contained" onClick={handleSearchClick}>
        Search
      </Button>
    </Box>
  );
}