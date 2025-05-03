import React, { useEffect, useRef } from 'react';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { db } from './firebase';
import { ref, onValue } from 'firebase/database';

const User_mainPage = () => {
    const navigate = useNavigate();
    const firstLoad = useRef(true);

    useEffect(() => {
        const songRef = ref(db, 'currentSong');

        const unsubscribe = onValue(songRef, (snapshot) => {
            const data = snapshot.val();

            if (data) {

                navigate('/live-page', {
                    state: {
                        title: data.title,
                        artist: data.artist,
                        lyrics: data.lyrics,
                    },
                });
            } else if (!firstLoad.current) {

                navigate('/main');
            }


            firstLoad.current = false;
        });

        return () => unsubscribe();
    }, [navigate]);

    return (
        <Box sx={{ backgroundColor: '#fff1e6', minHeight: '100vh', py: 4 }}>
            <Container maxWidth="sm">
                {/* Logo */}
                <Box display="flex" justifyContent="center" mb={4}>
                    <img
                        src="/jamoveo.png"
                        alt="Logo"
                        style={{ width: '200px' }}
                    />
                </Box>

                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    p={4}
                    borderRadius={3}
                    bgcolor="#ffffffcc"
                    boxShadow={3}
                >
                    <Typography
                        variant="h3"
                        gutterBottom
                        fontWeight="bold"
                        sx={{ color: '#fad2e1', mb: 3 }}
                    >
                        Waiting for next song
                    </Typography>
                    <CircularProgress size={50} />
                </Box>
            </Container>
        </Box>
    );
};

export default User_mainPage;
