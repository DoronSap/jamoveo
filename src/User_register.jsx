import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    TextField,
    Typography,
    Box,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import { demo } from './usersdb';

const instruments = ['Guitar', 'Piano', 'Drums', 'Violin', 'Bass', 'Vocals'];

export default function User_register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [instrument, setInstrument] = useState('');
    const [message, setMessage] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const existing = await demo.getUserByUsername(username);
        if (existing) {
            setMessage('Username already exists');
            return;
        }

        await demo.addUser({ username, password, instrument, role: 'user' });
        setMessage('User registered!');
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
                        style={{ width: '200px', marginBottom: '20px' }}
                    />

                    {/* Title */}
                    <Typography
                        variant="h3"
                        gutterBottom
                        textAlign="center"
                        fontWeight="bold"
                        sx={{ color: '#fad2e1' }}
                    >
                        Register
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
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Instrument</InputLabel>
                            <Select
                                value={instrument}
                                onChange={(e) => setInstrument(e.target.value)}
                                label="Instrument"
                                required
                            >
                                {instruments.map((inst) => (
                                    <MenuItem key={inst} value={inst}>
                                        {inst}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
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
