import { useParams } from "react-router-dom";

// components
import { Box, Card, CardContent, CardHeader, Chip, Divider, FormControl, InputLabel, Link, MenuItem, OutlinedInput, Select, SelectChangeEvent, Stack, Typography } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import CommentSection from "../comment/comment-components.tsx";
import ErrorMessage from "../../common/components/ErrorMessage.tsx";
import Loading from "../../common/components/Loading.tsx";

// types
import Post from "../../types/Post.ts";

// hooks
import useFetch from "../../common/hooks/useFetch.ts";
import useFilter from "../../common/hooks/useFilter.ts";
import { useCategory } from "./post-hooks.ts";

// API client
import forumPostClient from "./post-api-client.ts";
import { useCallback, useState } from "react";
import categoryClient from "../category/category-api-client.ts";

/**
 * A subheader containing the options for categories.
 * @returns The subheader above Cards.
 */
function CategoryHeader({ handleCategoryChange, handleCategoryDelete, selectedCategories }: {
   handleCategoryChange: (event: SelectChangeEvent<number[]>) => void,
   handleCategoryDelete: (catId: number) => void,
   selectedCategories: number[],
}): JSX.Element {

    // hooks
    // fetch all categories
    const { data, error, loading } = useFetch(
        () => categoryClient.getAll()
    );
    const categories = data;
    
    return (
       <Box sx={{ display: "flex" }}>
                <FormControl sx={{ m: 2, width: 500 }}>
      <InputLabel>Categories</InputLabel>
      <Select
        multiple
        value={selectedCategories}
        onChange={handleCategoryChange}
        input={<OutlinedInput label="Categories" />}
            renderValue={(selected) => (
                <Stack gap={1} direction="row" flexWrap="wrap">

                {selected.map((catId) => {
                    // we do this to access the label of each category
                    const category = categories?.find(cat => cat.id === catId);
                    return (
                    <Chip 
                    key={catId} 
                    label={category?.label}
                    onDelete = {() => handleCategoryDelete(catId)}
                    deleteIcon={
                        <CancelIcon
                    onMouseDown={e => e.stopPropagation()}
                    />
                    }
                />
                    );
            })}
            </Stack>
        )}
      >
        {categories?.map((cat) => (
          <MenuItem key={cat.id} value={cat.id}>
            {cat.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
       </Box>
    )
}

/**
 * Header for a single PostCard.
 * Dynamic, based on whether the title needs to be a Link or not. 
 * @param param0 
 * @returns 
 */
function PostCardHeader({ post, linkUrl }: 
    { 
        post: Post,
        linkUrl?: string,
    }
): JSX.Element {

    // access `category` of the Post
    const { data } = useFetch(
        () => categoryClient.getById(post.category_id)
    );
    const category = data;

    return (
        <CardHeader
        title={
            <Stack direction="row" alignItems="center">
                {linkUrl ? (
                    <Link 
                    variant="h6"
                    sx={{ fontWeight: "bold" }}
                    href={linkUrl}
                    color="inherit"
                    >
                        {post.title}
                    </Link>
                ) : (
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        {post.title}
                    </Typography>
                )}
                
                <Chip
                label={category?.label}
                size="small"
                color="primary"
                sx={{ ml: 1 }} // Add some margin to the left
                />
            </Stack>
        }
        />
    )
}

/**
 * Card view of a Post.
 * When clicked, redirects to the Post details.
 * @param {Object} props - Properties passed to the PostCard component.
 * @param {number} props.key - Post ID.
 * @param {string} props.title - Post title.
 * @param {string} props.content - Post content.
 * @returns {JSX.Element} A component displaying a Post.
 */
function PostCard({ post }: { post: Post, }): JSX.Element {
    // link to another URL to show post details
    const linkUrl = `${import.meta.env.VITE_APP_URL}/post/${post.id}`

    return (
        <Card>
            <PostCardHeader post={post} linkUrl={linkUrl} />

            <CardContent sx={{ mt: -3 }}>
                <Typography>
                    {post.content.length > 100 ? `${post.content.slice(0, 100)}...` 
                    : post.content}
                </Typography>
            </CardContent>
        </Card>
    )
}

/**
 * A list view of forum posts.
 * @param {Object} props = Properties passed to the Posts component.
 * @param {Post[]} props.posts - Array of Post to be displayed.
 * @returns {JSX.Element} A component containing the forum posts.
 */
function Posts({ posts }: { posts: Post[] }): JSX.Element {
    return (
        <Box flex={3} >
            { posts.length == 0 ? 
            <Typography>"No posts :(</Typography>
            : posts.map(post => (
                <PostCard key={post.id} post={post} />
            ))}
        </Box>
    )
}

/**
 * A right bar containing other information(?)
 * @returns {JSX.Element} A component containing the right bar of the Feed.
 */
function RightBar(): JSX.Element {
    return (
        <Box bgcolor="purple" flex={1}>
            RightBar
        </Box>
    )
}

/**
 * The main feature of our app.
 * Displays all forum posts, that can be filtered based on category and search keywords.
 * @param {Object} props - Properties passed to the Feed component.
 * @param {Post[]} props.posts - Array of Post to be displayed.
 * @returns {JSX.Element} A component that displays the Feed.
 */
function Feed(): JSX.Element {

    // hooks
    const { selectedCategories, handleCategoryChange, handleCategoryDelete } = useCategory<number>();

    const { filteredList, error, loading } = useFilter<Post>(
        selectedCategories,
        forumPostClient,
        () => forumPostClient.getByCategories(selectedCategories)
    );
    const data = filteredList; 

    console.log("[post-components: Feed] data", data);

    // const { handleCategoryChange, handleCategoryDelete } = useCategory();

    if (loading) {
        return <Loading />
    } else if (error != "") {
        return <ErrorMessage message={error} />;
    }

    return (
        <Stack>
            <CategoryHeader 
            handleCategoryChange={handleCategoryChange}
            handleCategoryDelete={handleCategoryDelete}
            selectedCategories={selectedCategories}
            />
            <Stack direction="row" justifyContent="space-between">
                <Posts posts={data as Post[]}/>
                <RightBar />
            </Stack>
        </Stack> 
    )
}

/**
 * Displays the expanded, detailed view of a post. 
 * @returns 
 */
function PostDetails(): JSX.Element {
    const params = useParams<{ id : string }>();
    const postId = parseInt(params.id);

    // memoize the callback
    const fetchPostDetails = useCallback(
        () => forumPostClient.getById(postId),
        [postId]
    );

   const { data, error, loading } = useFetch(fetchPostDetails);

    const post = data;
    console.log(post);

    if (loading) {
        return <Loading />;
    } else if (error != "") {
        return <ErrorMessage message={error} />
    } else {
        return (
            <Card sx={{ mt: 1, ml: 2, mr: 2 }}>
                <PostCardHeader post={post as Post} />

                {/* Post Content */}
                <CardContent sx={{ mt: -3 }}>
                    <Typography>
                        {post?.content}
                    </Typography>
                </CardContent>

                <Divider />
                {/* Comment Section */}
                <CardContent>
                    <CommentSection postId={postId}/>
                </CardContent>
            </Card> 
        );
    }
}

export { Feed, PostDetails };