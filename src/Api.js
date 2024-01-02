import React, { useState } from 'react';
import axios from 'axios';
import { Button, CircularProgress, Typography } from '@mui/material';

const TestApiComponent = () => {
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);

    const callTestApi = async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:4000/test-endpoint');
            setResponse(res.data);
        } catch (error) {
            console.error('Error calling test API:', error);
            setResponse(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Button onClick={callTestApi} disabled={loading}>
                {loading ? <CircularProgress size={24} /> : 'Call Test API'}
            </Button>
            {response && <Typography variant="body1">Response: {JSON.stringify(response)}</Typography>}
        </div>
    );
};


export async function getGameState() {
    try {
        const response = await fetch('http://localhost:4000/game-state');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching game state: ", error);
    }
}


export async function updateGameState(updatedGameState) {
    try {
        // Sort cards for each player
        if (updatedGameState.players) {
            updatedGameState.players.forEach(player => {
                if (player.cards && Array.isArray(player.cards)) {
                    player.cards.sort();
                }
            });
        }

        const response = await fetch('http://localhost:4000/update-game-state', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedGameState),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
    } catch (error) {
        console.error("Error updating game state: ", error);
    }
}


export default TestApiComponent;
