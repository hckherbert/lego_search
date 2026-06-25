'use client';

import { useState } from "react";
import { Box, TextField, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { SearchResult, getParts } from 'lib/legoClient';

export default function SearchBar() {

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = async () => {

    //event.preventDefault(); // Prevents page reload if inside a form
    //setSearchQuery("window")
    console.log('Searching for:', searchQuery);
 
    if (!searchQuery.trim()) return;

    try {
      // 2. Call your API route
      //const result: SearchResult[] = await getParts(searchQuery);
      const res = await fetch(`/api/parts/${encodeURIComponent(searchQuery)}`);
      
      if (!res.ok) {
        throw new Error('Failed to fetch parts');
      }
  
       const data = await res.json();
       console.log('Search results:', data);

    } catch (error) {
      console.error('API Error:', error);
    }
  };




 return (
    <Box 
      sx={{ display: 'flex', gap: 1, p: 2, maxWidth: 500 }}
    >
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Type your search here..."
        size="small"
        value={searchQuery} // Links state to input value
        onChange={(e) => setSearchQuery(e.target.value)} // Updates state on every keystroke
      />
      <Button 
        variant="contained"
        onClick={() => {
          handleSearch();
  }}
      >
        Search
      </Button>
      
    </Box>
 )};
 