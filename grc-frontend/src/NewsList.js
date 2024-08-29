// src/NewsList.js
import React, { useState } from 'react';
import axios from 'axios';
import { Container, TextField, Button, List, ListItem, ListItemText, Typography } from '@mui/material';

const NewsList = () => {
    const [keyword, setKeyword] = useState('');
    const [articles, setArticles] = useState([]);

    const fetchNews = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:5000/news?keyword=${keyword}`);
            setArticles(response.data);
        } catch (error) {
            console.error("There was an error fetching the news!", error);
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                GRC Relevant News
            </Typography>
            <TextField 
                label="Keyword" 
                variant="outlined" 
                fullWidth 
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)} 
            />
            <Button 
                variant="contained" 
                color="primary" 
                fullWidth 
                style={{ marginTop: '20px' }} 
                onClick={fetchNews}
            >
                Fetch News
            </Button>
            <List style={{ marginTop: '20px' }}>
                {articles.map((article, index) => (
                    <ListItem key={index}>
                        <ListItemText 
                            primary={article.headline} 
                            secondary={
                                <>
                                    <Typography variant="body2">{article.description}</Typography>
                                    <a href={article.url} target="_blank" rel="noopener noreferrer">Read more</a>
                                </>
                            } 
                        />
                    </ListItem>
                ))}
            </List>
        </Container>
    );
};

export default NewsList;