import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    TextField,
    Typography,
    Box,
    Button
} from '@mui/material';
import { demo } from './usersdb';

export default function Admin_register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const existing = await demo.getUserByUsername(username);
        if (existing) {
            setMessage('Username already exists');
            return;
        }

        await demo.addUser({ username, password, role: 'admin' });
        setMessage('Admin registered!');
        navigate('/login');
    };

    return (
        <Box sx={{ backgroundColor: '#fff1e6', minHeight: '100vh', py: 5 }}>
            <Container maxWidth="sm">
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    boxShadow={3}
                    p={4}
                    borderRadius={3}
                    bgcolor="#ffffffcc"
                >
                    {/* Logo */}
                    <img
                        src="../public/jamoveo.png"
                        alt="Logo"
                        style={{ width: '150px', marginBottom: '20px' }}
                    />

                    {/* Title */}
                    <Typography
                        variant="h3"
                        gutterBottom
                        textAlign="center"
                        fontWeight="bold"
                        sx={{ color: '#fad2e1' }}
                    >
                        Admin Register
                    </Typography>

                    {/* Form */}
                    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                        <TextField
                            fullWidth
                            label="Username"
                            margin="normal"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            margin="normal"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <Button
                            fullWidth
                            variant="contained"
                            type="submit"
                            sx={{
                                mt: 2,
                                py: 1.5,
                                backgroundColor: '#fad2e1',
                                color: 'black',
                                fontWeight: 'bold',
                                '&:hover': {
                                    backgroundColor: '#f6bccc',
                                },
                            }}
                        >
                            Register
                        </Button>
                    </form>

                    {message && (
                        <Typography mt={2} color="secondary">
                            {message}
                        </Typography>
                    )}
                </Box>
            </Container>
        </Box>
    );
}
