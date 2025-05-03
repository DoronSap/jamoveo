import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button, Fab } from '@mui/material';
import { PlayArrow, Pause } from '@mui/icons-material';
import { db } from './firebase';
import { onValue, ref, set } from 'firebase/database';
import { demo } from './usersdb';

const Live_Page = () => {
    const [lyrics, setLyrics] = useState([]);
    const [songTitle, setSongTitle] = useState('');
    const [artist, setArtist] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [showChords, setShowChords] = useState(true);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [currentLineIndex, setCurrentLineIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const intervalRef = useRef(null);
    const lineRefs = useRef([]);

    const location = useLocation();
    const navigate = useNavigate();
    const { lyrics: passedLyrics, title, artist: passedArtist } = location.state || {};

    useEffect(() => {
        const fetchUserRole = async () => {
            await demo.ensureDbReady();
            const username = localStorage.getItem("loggedInUser");
            const user = await demo.getUserByUsername(username);
            setIsAdmin(user?.role === 'admin');
            setShowChords(user?.instrument?.toLowerCase() !== 'vocals');
        };
        fetchUserRole();
    }, []);

    useEffect(() => {
        if (passedLyrics) {
            setLyrics(passedLyrics);
            setSongTitle(title);
            setArtist(passedArtist);
        }
    }, [passedLyrics, title, passedArtist]);

    useEffect(() => {
        return () => {
            if (isAdmin) {
                set(ref(db, 'currentSong'), null);
            }
        };
    }, [isAdmin]);

    useEffect(() => {
        const currentSongRef = ref(db, 'currentSong');
        const unsubscribe = onValue(currentSongRef, (snapshot) => {
            const value = snapshot.val();
            if (value === null && !isAdmin) {
                navigate('/main');
            }
        });
        return () => unsubscribe();
    }, [isAdmin]);

    useEffect(() => {
        if (isPlaying) {
            intervalRef.current = setInterval(() => {
                setCurrentWordIndex((prev) => {
                    const flatLength = lyrics.flat().length;
                    const newIndex = prev + 1 >= flatLength ? 0 : prev + 1;

                    let wordCount = 0;
                    for (let i = 0; i < lyrics.length; i++) {
                        wordCount += lyrics[i].length;
                        if (newIndex < wordCount) {
                            setCurrentLineIndex(i);
                            break;
                        }
                    }

                    return newIndex;
                });
            }, 800); // slower speed
        } else {
            clearInterval(intervalRef.current);
        }
        return () => clearInterval(intervalRef.current);
    }, [isPlaying, lyrics]);

    useEffect(() => {
        const el = lineRefs.current[currentLineIndex];
        if (el) {
            const topOffset = el.getBoundingClientRect().top + window.pageYOffset - 100;
            window.scrollTo({ top: topOffset, behavior: 'smooth' });
        }
    }, [currentLineIndex]);

    const handleQuit = async () => {
        await set(ref(db, 'currentSong'), null);
        navigate(isAdmin ? '/main-admin' : '/main');
    };

    const togglePlay = () => {
        setIsPlaying((prev) => !prev);
    };

    let wordCounter = 0;

    return (
        <Box sx={{ backgroundColor: '#fff1e6', minHeight: '100vh', py: 4 }}>
            <Container maxWidth="md">
                {/* Logo */}
                <Box display="flex" justifyContent="center" mb={3}>
                    <img
                        src="../public/jamoveo.png"
                        alt="Logo"
                        style={{ width: '200px' }}
                    />
                </Box>

                {/* Song Title */}
                <Typography variant="h3" fontWeight="bold" align="center" gutterBottom>
                    {songTitle}
                </Typography>

                {/* Artist Name */}
                <Typography variant="h5" align="center" color="text.secondary" paragraph>
                    {artist}
                </Typography>

                {/* Lyrics */}
                <Box
                    mt={3}
                    p={3}
                    borderRadius={2}
                    sx={{
                        backgroundColor: '#fde2e4',
                        boxShadow: 3,
                        width: '150%',
                        maxWidth: '1000px',
                    }}
                >
                    {lyrics.length > 0 ? (
                        lyrics.map((line, lineIndex) => (
                            <Typography
                                key={lineIndex}
                                ref={(el) => (lineRefs.current[lineIndex] = el)}
                                variant="h5"
                                paragraph
                                sx={{ whiteSpace: 'pre-wrap', fontSize: '2rem' }}
                            >
                                {line.map((wordObj, wordIndex) => {
                                    const isActive = wordCounter === currentWordIndex;
                                    const element = (
                                        <span
                                            key={wordIndex}
                                            style={{
                                                marginRight: 8,
                                                fontWeight: isActive ? 'bold' : 'normal',
                                                color: isActive ? 'black' : 'inherit',
                                            }}
                                        >
                                            {showChords && wordObj.chords && (
                                                <span
                                                    style={{
                                                        fontSize: '0.8em',
                                                        color: '#99c1de',
                                                        fontWeight: 'bold',
                                                        display: 'block',
                                                    }}
                                                >
                                                    {wordObj.chords}
                                                </span>
                                            )}
                                            {wordObj.lyrics}
                                        </span>
                                    );
                                    wordCounter++;
                                    return element;
                                })}
                            </Typography>
                        ))
                    ) : (
                        <Typography variant="body1">Loading lyrics...</Typography>
                    )}
                </Box>

                {/* Admin Quit */}
                {isAdmin && (
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleQuit}
                        sx={{ mt: 3 }}
                    >
                        Quit
                    </Button>
                )}

                {/* Play/Pause Fab */}
                <Fab
                    color="primary"
                    onClick={togglePlay}
                    sx={{
                        position: 'fixed',
                        bottom: 24,
                        right: 24,
                        backgroundColor: '#fadde1',
                        '&:hover': { backgroundColor: '#ff87ab' },
                    }}
                >
                    {isPlaying ? <Pause /> : <PlayArrow />}
                </Fab>
            </Container>
        </Box>
    );
};

export default Live_Page;
