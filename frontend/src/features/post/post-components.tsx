import { useParams } from "react-router-dom";

// components
import { Box, Card, CardContent, CardHeader, Chip, Dialog, Divider, FormControl, InputLabel, Link, MenuItem, OutlinedInput, Paper, Select, Stack, TextField, Typography } from "@mui/material";
import CommentSection from "../comment/comment-components.tsx";
import ErrorMessage from "../../common/components/ErrorMessage.tsx";
import Loading from "../../common/components/Loading.tsx";

// types
// import Post from "../../types/Post.ts";
import Post, { CreatePostData, UpdatedPost } from "./post-types.ts";
import { FormField } from "../../common/types/common-types.ts";

// hooks
import useFetch from "../../common/hooks/useFetch.ts";

// API client
import { useCallback, useEffect, useState } from "react";
import categoryClient from "../category/category-api-client.ts";
import StyledButton from "../../common/components/StyledButton.tsx";
import { useIsCreateOpen } from "../../common/contexts/IsCreateOpenContext.tsx";
import { useSelector } from "react-redux";
import { selectUserIsLoggedIn } from "../user/user-slice.ts";
import { useIsLoginOpen } from "../../common/contexts/IsLoginOpenContext.tsx";
import { StyledHeader, SubmitButton } from "../../common/components/Form.tsx";
import { useAllPosts, useCreatePostForm, useEditPostForm, usePostDelete } from "./post-hooks.ts";
import userClient from "../user/user-api-client.ts";
import { useIsEditPostOpen } from "../../common/contexts/IsEditPostOpenContext.tsx";
import { isAuthor } from "./post-utils.ts";
import { useIsDeletePostOpen } from "../../common/contexts/IsDeletePostOpen.tsx";
import { DeleteItemButton } from "../../common/components/DeleteItem.tsx";
import { Delete, Edit } from "@mui/icons-material";

/**
 * Header for a single PostCard.
 * Dynamic, based on whether the title needs to be a Link or not. 
 * @param param0 
 * @returns 
 */
function PostCardHeader({ post, linkUrl, editButton, deleteButton }: 
    { 
        post: Post,
        linkUrl?: string,
        editButton?: React.ReactNode,
        deleteButton?: React.ReactNode,
    }
): JSX.Element {

    // memoize the callback
    // otherwise everytime the return value is deemed to be different
    // (eg. return object is alw a DIFF REFERENCE even tho it's semantically the same)
    // then useFetch() will keep on being called.
    
    // fetch category
    console.log('HELLO', post)
    const fetchCategory = useCallback(
        () => categoryClient.getById(post.category_id),
        [post]
    );
    const { data } = useFetch(fetchCategory);
    const category = data;
    console.log("BELLO", category)

    // fetch username
    const fetchUser = useCallback(
        () => userClient.getById(post.user_id),
        []
    );
    const fetchUserResponse = useFetch(fetchUser);

    return (
        <CardHeader
        title={
            <Stack>
                <Stack direction="row" alignItems="center" justifyContent="space-between">

                    {/* flexbox for title and category chip */}
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
                        
                        {/* Category chip */}
                        <Chip
                        label={category?.label}
                        size="small"
                        color="primary"
                        sx={{ ml: 1 }} // Add some margin to the left
                        />
                    </Stack>

                    {/* Edit and delete button */}
                    <Stack direction='row'>
                        {editButton && isAuthor(post) ? editButton : <></>}
                        {deleteButton && isAuthor(post) ? deleteButton : <></>}
                    </Stack>
                </Stack>

                {/* username */}
                { fetchUserResponse.loading ? <Loading /> 
                : 
                <>{fetchUserResponse.data?.username}</>}
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
    // states
    const { allPosts, loading, error } = useAllPosts();
    const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);

    // filter posts by categories
    useEffect(() => {
        if (selectedCategories.length <= 0) {
            setFilteredPosts(allPosts);
        } else {
            const filtered = allPosts.filter(post => selectedCategories.includes(post.category_id));
            setFilteredPosts(filtered);
        }
    }, [selectedCategories, allPosts]);

    console.log("[post-components: Feed] allPosts", allPosts);

    // const { handleCategoryChange, handleCategoryDelete } = useCategory();

    if (loading) {
        return <Loading />
    } else if (error != "") {
        return <ErrorMessage message={error} />;
    }

    return (
        <Stack>
            <Stack direction="row" justifyContent="space-between">
                <Posts posts={filteredPosts}/>
                <RightBar />
            </Stack>
        </Stack> 
    )
}

/**
 * Displays the expanded, detailed view of a post. 
 * @returns 
 */
function PostDetails({ postId }: { 
    postId: string
}): JSX.Element {
    // const params = useParams<{ id : string }>();
    // const postId = params.id ?? '';
    
    // states
    const [post, setPost] = useState<Post | undefined>(undefined);

    // fetching all posts
    const { allPosts, loading, error } = useAllPosts();
    useEffect(() => {
        setPost(allPosts.find(p => p.id === postId));
    }, [allPosts]);

    // IsDeletePostOpen context
    const { isDeletePostOpen, toggleDeletePostOpen } = useIsDeletePostOpen();
    /**
     * @function handleDeleteOpen - handles the event where the "Delete" button is pressed.
     */
    const handleDeleteOpen = () => {
        toggleDeletePostOpen(postId);
    }


    if (loading) {
        return <Loading />
    } else if (error != "") {
        return (
            <ErrorMessage message={error} />
        );
    } else if (!post) {
        return (
            <ErrorMessage message="Post not found" />
        );
    } else {
            return (
                <Card sx={{ mt: 1, ml: 2, mr: 2 }}>
                    <PostCardHeader 
                        post={post as Post}
                        editButton={<EditPostButton postId={postId}/>}
                        // deleteButton={<DeletePostButton postId={postId} />}
                        deleteButton={<DeleteItemButton itemId={postId} handleDeleteOpen={handleDeleteOpen} />}
                    />

                    {/* Post Content */}
                    <CardContent sx={{ mt: -3 }}>
                        <Typography>
                            {post?.content}
                        </Typography>
                    </CardContent>


                    {/* <Divider /> */}
                    {/* Comment Section */}
                    {/* <CardContent> */}
                        {/* <CommentSection postId={postId}/> */}
                    {/* </CardContent> */}
                </Card> 
        );
   }
}

// FEATURE: CREATE POST
function CreatePostButton(): JSX.Element {
    const { isLoginOpen, toggleLoginOpen } = useIsLoginOpen();
    const { isCreateOpen, toggleCreateOpen } = useIsCreateOpen();
    const isLoggedIn = useSelector(selectUserIsLoggedIn);

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
        }, {
            fieldType: "select",
            placeholder: "Category",
            name: "category_id",
            required: true,
        }
    ];

    // HOOKS
    // consume IsCreateOpen context
    const { isCreateOpen, toggleCreateOpen } = useIsCreateOpen();
    const { data, loading, error, handleChange, handleSubmit } = useCreatePostForm(handleClose);

    // TODO: replace with REDUX!
    const fetchAllCategories = useCallback(
        () => categoryClient.getAll(), []
    );

    const { data: categories } = useFetch(fetchAllCategories);

    /*
    const formData: NewPost()

    initialFormData = {// ADD LATER}
    const { data: formData, handleChange, resetForm } = useForm<NewPost>(initialFormData);
    const handleSubmit = () => {
        dispatch(addPost(formData, token));
    }
    on submit, dispatch(addPost(newPost))    
    */

    return (
        // dialog box
        <Dialog open={isCreateOpen} maxWidth="xs" onClose={handleClose}>

                <Paper elevation={8} sx={{p: 2}}>
                    <StyledHeader
                    avatar="Hi"
                    title="Create post"
                    handleClose={handleClose}
                    />
                    
                    {/* form component  */}
                    <Box
                    component="form"
                    onSubmit={handleSubmit}>
                        {fields.map(field => {

                            return ( 
                                field.fieldType === "input" ? 
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
                            :
                            
                            <FormControl sx={({ width: 500 })}>
                                <InputLabel>{field.placeholder}</InputLabel>
                                <Select
                                key={field.name}
                                name={field.name}
                                value={data[field.name as keyof CreatePostData]}
                                onChange={handleChange}
                                input={<OutlinedInput label={field.placeholder} />}
                                required={field.required}
                                renderValue={selected => {
                                    const category = categories?.find(cat => cat.id === selected.id);
                                    return <>{category?.label}</>;
                                }}
                                >
                                    {categories?.map(cat => (
                                        <MenuItem key={cat.id} value={cat.id}>
                                            {cat.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

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

// EDIT POST
function EditPostButton({ postId }: { postId: string }): JSX.Element {
    const { isEditPostOpen, toggleEditPostOpen } = useIsEditPostOpen();

    const handleClick = () => {
        toggleEditPostOpen(postId); 
    }
    return (
        <StyledButton
        content="Edit"
        onClick={handleClick}
        />
    );
}

/**
 * 
 * @returns The form to edit a post.
 */
function EditPostForm(): JSX.Element {
    const { isEditPostOpen, toggleEditPostOpen, postId } = useIsEditPostOpen();

    const handleClose = () => {
        toggleEditPostOpen();
    }

    const { 
        data: formData, 
        loading, 
        error, 
        handleChange, 
        handleSubmit 
    } = useEditPostForm(postId, handleClose);

    // TODO: replace with REDUX!
    const fetchAllCategories = useCallback(
        () => categoryClient.getAll(), []
    );
    const { data: categories } = useFetch(fetchAllCategories);

    // form fields
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
        }, {
            fieldType: "select",
            placeholder: "Category",
            name: "category_id",
            required: true,
        }
    ];
    return (
        // dialog box
        <Dialog open={isEditPostOpen} maxWidth="xs" onClose={handleClose}>

                <Paper elevation={8} sx={{p: 2}}>
                    <StyledHeader
                    avatar={<Edit />}
                    title="Edit post"
                    handleClose={handleClose}
                    />
                    
                    {/* form component  */}
                    <Box
                    component="form"
                    onSubmit={handleSubmit}>
                        {fields.map(field => {

                            return ( 
                                field.fieldType === "input" ? 
                            <TextField
                            key={field.name}
                            fullWidth
                            placeholder={field.required ? `${field.placeholder}*` : field.placeholder}
                            required={field.required}
                            sx={{ mb: 2 }}
                            autoFocus
                            {...(field.type ? { type: field.type } : {})} // Conditionally add the type attribute
                            name={field.name}
                            value={formData[field.name as keyof UpdatedPost]} // Eg. data[username], data[password]
                            onChange={handleChange}
                            />
                            :
                            
                            <FormControl sx={({ width: 500 })}>
                                <InputLabel>{field.placeholder}</InputLabel>
                                <Select
                                key={field.name}
                                name={field.name}
                                value={formData[field.name as keyof UpdatedPost]}
                                onChange={handleChange}
                                input={<OutlinedInput label={field.placeholder} />}
                                required={field.required}
                                renderValue={selected => {
                                    const category = categories?.find(cat => cat.id === selected.id);
                                    return <>{category?.label}</>;
                                }}
                                >
                                    {categories?.map(cat => (
                                        <MenuItem key={cat.id} value={cat.id}>
                                            {cat.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            );
                    })}


                        <SubmitButton
                        submitButtonText={<>Save</>}
                        loading={loading}
                        />
                    </Box>
                        

                </Paper>

        </Dialog>
    )
}

// FEATURE: DELETE
export function ConfirmPostDelete(): JSX.Element {
    const { isDeletePostOpen, toggleDeletePostOpen, postId } = useIsDeletePostOpen();

    const handleClose = () => {
        toggleDeletePostOpen();
    }

    const confirmDeleteText = 'Are you sure you want to delete this post?';

 
    const { loading, error, handleDelete } = usePostDelete(postId, handleClose);

    return (
        <Dialog open={isDeletePostOpen} maxWidth="xs" onClose={handleClose}>
            <Paper elevation={8} sx={{p: 2}}>

                <StyledHeader
                avatar={<Delete />}
                title='Delete Post'
                />

                <Typography>{confirmDeleteText}</Typography>

                <Stack direction='row' justifyContent='space-between'>
                    <StyledButton
                    content='Cancel'
                    onClick={handleClose}
                    />

                    <StyledButton
                    content='Yes'
                    bgColor='red'
                    onClick={handleDelete}
                    />
                </Stack>
            </Paper>
        </Dialog>
    )
}


export { Feed, PostDetails, CreatePostButton, CreatePostForm, EditPostForm };