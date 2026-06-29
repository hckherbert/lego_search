'use client';

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { Box, TextField, Button } from '@mui/material';
import Paper from '@mui/material/Paper';
import Masonry from '@mui/lab/Masonry';
import { styled } from '@mui/material/styles';
import Image from 'next/image'
import {SearchResult} from '../../../lib/legoClient';


export default function SearchBar() {
  const router = useRouter();
  const params = useParams();
  
  const queryArray = params?.query;
  const urlQuery = queryArray && Array.isArray(queryArray) && queryArray 
    ? decodeURIComponent(queryArray) 
    : '';

  const [searchQuery, setSearchQuery] = useState(urlQuery);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  
  // Keep track of the last successful fetch to deduplicate rapid back-to-back triggers
  const lastFetchTrack = useRef({ query: '', time: 0 });


  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'left',
    color: (theme.vars || theme).palette.text.secondary,
    fontSize: '18px',
    ...theme.applyStyles('dark', {
      backgroundColor: '#1A2027',
    }),
  }));

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
      setSearchResults(data);
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
    <Box>
      <Box sx={{ display: 'flex', gap: 1, p: 2 }}>
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

        <Masonry 
          columns={{ 
          xs: 2,   // Mobile Portrait (2 cols)
          sm: 3,   // Mobile Landscape / iPad Portrait (3 cols)
          md: 5,   // iPad Landscape / Small Laptop (5 cols)
          lg: 6,   // Wide Screen (8 cols)
          xl: 7   // Ultra-wide (Optional: 10 cols)
        }}
          spacing={2}
        >
          {searchResults.map((item, index) => (
            <Item key={index}>
              {item.name}
              <img
                src={item.part_img_url}
                alt={item.name}
                loading="lazy"
                style={{
                  borderBottomLeftRadius: 4,
                  borderBottomRightRadius: 4,
                  display: 'block',
                  width: '100%',
                }}
              />
            </Item>
          ))}
        </Masonry>
    </Box>
  );
}