import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    TextField,
    Button,
    Container,
    Typography,
    Box
} from '@mui/material';
import { demo } from './usersdb';

export default function User_login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const user = await demo.checkUserCredentials(username, password);
            if (user) {
                setMessage(`Welcome back, ${user.username}!`);
                localStorage.setItem('loggedInUser', username);
                if (user.role === 'admin') {
                    navigate('/main-admin');
                } else {
                    navigate('/main');
                }
            } else {
                setMessage('Invalid username or password');
            }
        } catch (err) {
            console.error('Login failed:', err);
            setMessage('An error occurred during login.');
        }
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
                        src="/jamoveo.png"
                        alt="Logo"
                        style={{ width: '200px', marginBottom: '20px' }}
                    />

                    {/* Title */}
                    <Typography variant="h3" gutterBottom textAlign="center" fontWeight="bold" color="#fad2e1">
                        Login
                    </Typography>

                    {/* Form */}
                    <form onSubmit={handleLogin} style={{ width: '100%' }}>
                        <TextField
                            fullWidth
                            label="Username"
                            variant="outlined"
                            margin="normal"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <TextField
                            fullWidth
                            type="password"
                            label="Password"
                            variant="outlined"
                            margin="normal"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ mt: 2, backgroundColor: '#fad2e1', ':hover': { backgroundColor: '#f9c1d1' } }}
                        >
                            Login
                        </Button>
                    </form>


                    {message && (
                        <Typography color="secondary" mt={2}>
                            {message}
                        </Typography>
                    )}
                </Box>
            </Container>
        </Box>
    );
}
