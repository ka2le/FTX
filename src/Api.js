import React, { useState } from 'react';
import axios from 'axios';
import { Button, CircularProgress, Typography } from '@mui/material';

const ip = "2.248.184.39";
const port = "4000";
const base_url = `http://${ip}:${port}`;

const TestApiComponent = () => {
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);

    const callTestApi = async () => {
        setLoading(true);
        try {
            const res = await axios.get(base_url+'/test-endpoint');
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
        const response = await fetch(base_url+'/game-state');
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

        const response = await fetch(base_url+'/update-game-state', {
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
