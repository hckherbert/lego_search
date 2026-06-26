'use client';

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { Box, TextField, Button } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
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
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>part num</TableCell>
            <TableCell align="right">part name</TableCell>
            <TableCell align="right">image</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {searchResults.map((row:SearchResult) => (
            <TableRow
              key={row.part_num}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.part_num}
              </TableCell>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">
                {row.part_img_url}
                </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </Box>
  );
}