import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import BlogCard from '../components/BlogCard';
import { Typography, Grid, Container } from '@mui/material';

const FavoritesPage = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFavorites = async () => {
            const user = auth.currentUser;
            if (!user) return;

            try {
                
                const favoritesQuery = query(
                    collection(db, 'favorites'),
                    where('userID', '==', user.uid)
                );
                const favoritesSnapshot = await getDocs(favoritesQuery);
                const favoriteBlogIDs = favoritesSnapshot.docs.map(doc => doc.data().blogID);

                
                const blogsQuery = query(collection(db, 'blogs'));
                const blogsSnapshot = await getDocs(blogsQuery);

                const favoritedBlogs = blogsSnapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data() }))
                    .filter(blog => favoriteBlogIDs.includes(blog.id));

                setFavorites(favoritedBlogs);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching favorites:', error);
            }
        };

        fetchFavorites();
    }, []);

    if (loading) return <Typography>Loading favorites...</Typography>;

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Your Favorites
            </Typography>
            {favorites.length === 0 ? (
                <Typography>No favorites found. Start adding some!</Typography>
            ) : (
                <Grid container spacing={3}>
                    {favorites.map(blog => (
                        <Grid item xs={12} sm={6} md={4} key={blog.id}>
                            <BlogCard blog={blog} showDeleteIcon={false} />
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};

export default FavoritesPage;
