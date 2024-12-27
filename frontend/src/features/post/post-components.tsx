import { useParams } from "react-router-dom";

// components
import { Avatar, Box, Card, CardContent, CardHeader, Chip, Dialog, Divider, Link, Paper, Stack, TextField, Typography } from "@mui/material";
import CommentSection from "../comment/comment-components.tsx";
import ErrorMessage from "../../common/components/ErrorMessage.tsx";
import Loading from "../../common/components/Loading.tsx";

// types
// import Post from "../../types/Post.ts";
import Post, { CreatePostData } from "./post-types.ts";
import { FormField } from "../../common/types/common-types.ts";

// hooks
import useFetch from "../../common/hooks/useFetch.ts";
import useFilter from "../../common/hooks/useFilter.ts";

// API client
import forumPostClient from "./post-api-client.ts";
import { useCallback } from "react";
import categoryClient from "../category/category-api-client.ts";
import StyledButton from "../../common/components/StyledButton.tsx";
import { useIsCreateOpen } from "../../common/contexts/IsCreateOpenContext.tsx";
import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "../user/user-slice.ts";
import { useIsLoginOpen } from "../../common/contexts/IsLoginOpenContext.tsx";
import { StyledFormHeader, StyledFormTitle, SubmitButton } from "../../common/components/Form.tsx";
import { useCreatePostForm } from "./post-hooks.ts";

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

    // memoize the callback
    // otherwise everytime the return value is deemed to be different
    // (eg. return object is alw a DIFF REFERENCE even tho it's semantically the same)
    // then useFetch() will keep on being called.
    const fetchCategory = useCallback(
        () => categoryClient.getById(post.category_id),
        []
    );

    // access `category` of the Post
    /*
    const { data } = useFetch(
        () => categoryClient.getById(post.category_id)
    );
    */
   const { data } = useFetch(fetchCategory);
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
function Feed({ selectedCategories }: {
    selectedCategories: string[],
}): JSX.Element {

    // hooks
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
    const postId = params.id;

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

// FEATURE: CREATE POST
function CreatePostButton(): JSX.Element {
    const { isLoginOpen, toggleLoginOpen } = useIsLoginOpen();
    const { isCreateOpen, toggleCreateOpen } = useIsCreateOpen();
    const isLoggedIn = useSelector(selectIsLoggedIn);

    const handleClick = () => {
        isLoggedIn ? toggleCreateOpen() : toggleLoginOpen();
    };

    return (
        <StyledButton
        content="Create post"
        onClick={handleClick}
        />
    );
}

function CreatePostForm(): JSX.Element {
    // HOOKS
    // consume IsCreateOpen context
    const { isCreateOpen, toggleCreateOpen } = useIsCreateOpen();
    const { data, loading, error, handleChange, handleSubmit } = useCreatePostForm();

    const handleClose = () => {
        toggleCreateOpen();
    }

    const fields: FormField[] = [
        {
            fieldType: "input",
            placeholder: "Title",
            name: "title",
            required: true,
        }, {
            fieldType: "input",
            placeholder: "Type a post!",
            name: "content",
            required: true,
        }
    ];

    return (
        // dialog box
        <Dialog open={isCreateOpen} maxWidth="xs" onClose={handleClose}>

                <Paper elevation={8} sx={{p: 2}}>
                    <StyledFormHeader
                    avatar="Hi"
                    formTitle="Create post"
                    handleClose={handleClose}
                    />
                    {/* "Sign In" and close button */}
                    {/*
                    <Stack 
                    direction="row"
                    alignItems="center"
                    width="100%"
                    >
                        {/* Spacer for Avatar */}

                        {/*
                        <Box 
                        flexGrow={5}
                        display="flex"
                        justifyContent="flex-end" 
                        >
                        {/* Avatar */}
                        {/*
                            <Avatar sx={{ 
                                bgcolor: "secondary.main",
                            }}>
                                <LockOutlined />
                            </Avatar>
                        </Box>

                        {/* Cancel button */}
                        {/*
                        <Button 
                        onClick={handleClose} 
                        sx={{ color: "black", display:"flex", flexGrow:"4", justifyContent: "flex-end"}}>
                            <Cancel />
                        </Button>
                    </Stack>
                    <Typography 
                    variant="h6" 
                    sx={{
                        textAlign: "center"
                    }}>
                        Sign In
                    </Typography>
                    */}

                    {/* form component  */}
                    
                    <Box
                    component="form"
                    onSubmit={handleSubmit}>
                        {fields.map(field => {

                            return (
                            <TextField
                            key={field.name}
                            fullWidth
                            placeholder={field.required ? `${field.placeholder}*` : field.placeholder}
                            required={field.required}
                            sx={{ mb: 2 }}
                            autoFocus
                            {...(field.type ? { type: field.type } : {})} // Conditionally add the type attribute
                            name={field.name}
                            value={data[field.name as keyof CreatePostData]} // Eg. data[username], data[password]
                            onChange={handleChange}
                            />
                            );
                    })}


                        <SubmitButton
                        submitButtonText={<>Create post</>}
                        loading={loading}
                        />
                    </Box>
                        

                </Paper>

        </Dialog>
    )
}

export { Feed, PostDetails, CreatePostButton, CreatePostForm };