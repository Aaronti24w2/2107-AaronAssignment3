/* eslint-disable react/prop-types */
import { Button, Card, CardActions, CardContent, CardMedia, Chip, IconButton, Typography } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import DeleteIcon from '@mui/icons-material/Delete'
import FavoriteBorder from '@mui/icons-material/FavoriteBorder'
import Favorite from '@mui/icons-material/Favorite'
import { db } from '../firebaseConfig'
import { doc, setDoc, deleteDoc, getDocs, collection, query, where } from 'firebase/firestore'
import { auth } from '../firebaseConfig'
import { useState, useEffect } from "react"

const BlogCard = (props) => {
    const { blog, deleteBlog = () => {}, showDeleteIcon = true } = props;
    

    const navigate = useNavigate();
    const [isFavorited, setIsFavorited] = useState(false);

    useEffect(() => {
        const fetchFavoriteStatus = async () => {
            const user = auth.currentUser;
            if (!user) return;

            const favoritesRef = collection(db, 'favorites');
            const q = query(favoritesRef, where('userID', '==', user.uid), where('blogID', '==', blog.id));
            const querySnapshot = await getDocs(q);

            setIsFavorited(!querySnapshot.empty);
        };

        fetchFavoriteStatus();
    }, [blog.id]);

    const toggleFavorite = async () => {
        const user = auth.currentUser;
        if (!user) {
            console.error('User not authenticated');
            return;
        }

        const favoriteDocRef = doc(collection(db, 'favorites'));

        try {
            if (isFavorited) {
                // Remove from favorites
                const favoritesRef = collection(db, 'favorites');
                const q = query(favoritesRef, where('userID', '==', user.uid), where('blogID', '==', blog.id));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const docId = querySnapshot.docs[0].id;
                    await deleteDoc(doc(db, 'favorites', docId));
                }
            } else {
                // Add to favorites
                await setDoc(favoriteDocRef, {
                    userID: user.uid,
                    blogID: blog.id,
                });
            }
            setIsFavorited(!isFavorited);
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    return (
        <Card style={{ position: 'relative' }}>
            <CardMedia
                sx={{ height: 140 }}
                image={blog.image}
                title={blog.title}
            />
            {showDeleteIcon && (
                <IconButton
                    style={{ position: 'absolute', right: '10px', top: '5px' }}
                    aria-label="delete"
                    size="small"
                    onClick={() => deleteBlog(blog.id)}
                >
                    <DeleteIcon fontSize="inherit" />
                </IconButton>
            )}
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {blog.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {blog.description}
                </Typography>
                <Chip label={blog.category} variant="outlined" />
            </CardContent>
            <CardActions>
                <IconButton onClick={toggleFavorite} color={isFavorited ? 'error' : 'default'}>
                    {isFavorited ? <Favorite /> : <FavoriteBorder />}
                </IconButton>
                <Button color="secondary" variant="contained" onClick={() => navigate(`/viewblogs/${blog.id}`)}>
                    Learn More
                </Button>
            </CardActions>
        </Card>
    );
};

export default BlogCard