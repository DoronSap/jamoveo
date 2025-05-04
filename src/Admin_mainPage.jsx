import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    TextField,
    Box,
    List,
    ListItem,
    ListItemText,
    Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { songsDB } from './songsdb';
import { ref, set } from "firebase/database";
import { db } from "./firebase";

const Admin_mainPage = () => {
    const [query, setQuery] = useState('');
    const [songs, setSongs] = useState([]);
    const [filtered, setFiltered] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        set(ref(db, 'currentSong'), null);
    }, []);

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const allSongs = await songsDB.getAllSongs();
                setSongs(allSongs);
            } catch (err) {
                console.error('Error fetching songs:', err);
            }
        };
        fetchSongs();
    }, []);

    useEffect(() => {
        const q = query.trim().toLowerCase();
        if (!q) {
            setFiltered([]);
            return;
        }

        const result = songs.filter((song) => {
            const title_en = song.title?.toLowerCase() || '';
            const title_he = song.heb_title?.toLowerCase() || '';
            return title_en.startsWith(q) || title_he.startsWith(q);
        });

        setFiltered(result);
    }, [query, songs]);

    const handleSongClick = (song) => {
        set(ref(db, 'currentSong'), {
            title: song.title,
            lyrics: song.lyrics
        });

        navigate('/live-page', {
            state: {
                title: song.title,
                lyrics: song.lyrics,
                artist: song.artist
            }
        });
    };

    return (
        <Box sx={{ backgroundColor: '#fff1e6', minHeight: '100vh', py: 4 }}>
            <Container maxWidth="lg">
                <Box display="flex" justifyContent="center" mb={4}>
                    <img
                        src="/jamoveo.png"
                        alt="Logo"
                        style={{ width: '200px' }}
                    />
                </Box>

                <Box
                    boxShadow={4}
                    p={5}
                    borderRadius={4}
                    bgcolor="#fde2e4"
                    mx="auto"
                    sx={{
                        width: '150%',
                        maxWidth: '1000px',
                    }}
                >
                    <Typography
                        variant="h3"
                        fontWeight="bold"
                        gutterBottom
                        align="center"
                        sx={{ color: '#ff87ab', mb: 3 }}
                    >
                        Search any song...
                    </Typography>

                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Type song name (Hebrew or English)..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') e.preventDefault();
                        }}
                        sx={{
                            backgroundColor: '#fff',
                            borderRadius: 2,
                            mb: 4
                        }}
                    />

                    <List sx={{ width: '100%' }}>
                        {query && filtered.length === 0 && (
                            <Typography align="center" width="100%" mt={2}>
                                No songs found.
                            </Typography>
                        )}

                        {filtered.map((song) => (
                            <Paper
                                key={song.id}
                                elevation={2}
                                sx={{
                                    backgroundColor: '#fad2e1',
                                    mb: 2,
                                    borderRadius: 2,
                                    ':hover': {
                                        backgroundColor: '#ff87ab',
                                        cursor: 'pointer'
                                    }
                                }}
                                onClick={() => handleSongClick(song)}
                            >
                                <ListItem>
                                    <ListItemText
                                        primary={`${song.title} / ${song.heb_title}`}
                                        secondary={song.artist}
                                    />
                                </ListItem>
                            </Paper>
                        ))}
                    </List>
                </Box>
            </Container>
        </Box>
    );
};

export default Admin_mainPage;
