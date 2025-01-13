// components
import { Box, Card, CardContent, CardHeader, Chip, Dialog, Divider, FormControl, InputLabel, Link, MenuItem, OutlinedInput, Paper, Select, Stack, TextField, Typography } from "@mui/material";
import ErrorMessage from "../../common/components/ErrorMessage.tsx";
import Loading from "../../common/components/Loading.tsx";

// types
// import Post from "../../types/Post.ts";
import Post, { CreatePostData, NewPost, UpdatedPost } from "./post-types.ts";
import { FormField } from "../../common/types/common-types.ts";

// hooks
import useFetch from "../../common/hooks/useFetch.ts";

// API client
import React, { useCallback, useEffect, useState } from "react";
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
import { AddCircle, Delete, Edit, PostAdd } from "@mui/icons-material";
import CreateItemButton from "../../common/components/CreateItem.tsx";
import { isEdited } from "../../common/utils.ts";
import { SeeMore } from "../../common/components/SeeMore.tsx";
import { useNavigate } from "react-router-dom";

// FEATURE: VIEW POST
/**
 * Header for a single PostCard.
 * Dynamic, based on whether the title needs to be a Link or not. 
 * @param param0 
 * @returns 
 */
const PostCardHeader = ({ post, linkUrl, editButton, deleteButton }: 
    { 
        post: Post,
        linkUrl?: string,
        editButton?: React.ReactNode,
        deleteButton?: React.ReactNode,
    }
): JSX.Element => {

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

    // For title link
    const navigate = useNavigate();

    return (
        <CardHeader
        title={
            <Stack>
                <Stack direction="row" alignItems="center" justifyContent="space-between">

                    {/* flexbox for title and category chip */}
                    <Stack direction="row" alignItems="center">
                        {linkUrl ? (
                            <Typography
                            variant='h6'
                            sx={{ fontWeight: "bold", cursor: "pointer", textDecorationLine: "underline" }}
                            onClick={() => navigate(linkUrl)}
                            >
                                {post.title}
                            </Typography>
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
 * Template for a PostCard. 
 * @param
 * @returns 
 */
const GenericPostCard = ({ post, linkUrl, editButton, deleteButton, }: {
    post: Post,
    linkUrl?: string,
    editButton?: React.ReactNode,
    deleteButton?: React.ReactNode,
}) => {
    return (
        <Card sx={{ mt: 1, ml: 2, mr: 2 }}>
            <Stack direction='row' alignItems='center'>
                {/* Right side with post title and post content */}
                <Stack width='80%'>
                    {/* Header with title */}
                    <PostCardHeader 
                    post={post} 
                    {...(linkUrl && { linkUrl: linkUrl })}
                    {...(editButton && { editButton: editButton })}
                    {...(deleteButton && { deleteButton: deleteButton })}
                    />

                    {/* Post content */}
                    <CardContent sx={{ mt: -3 }}>
                        <SeeMore
                        content={post.content}
                        maxLength={100}
                        />
                    </CardContent>
                </Stack>

                {/* Left side with date and edited status */}
                <Stack alignItems='center' width='20%'>
                    {/* Created date */}
                    <Typography 
                    variant='subtitle2'
                    sx={{ fontWeight: 'bold', }}
                    >
                        {post.created_at}
                    </Typography>

                    {/* Edited status */}
                    {isEdited(post) ?
                    <Typography
                    variant='subtitle2'
                    >
                        Edited
                    </Typography>
                    :
                    <></>
                    }
                </Stack>
            </Stack>

        </Card>
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
const PostCard = ({ post }: { post: Post, }): JSX.Element => {
    // link to another URL to show post details
    const linkUrl = `/posts/${post.id}`;

    return (
        <GenericPostCard
        post={post}
        linkUrl={linkUrl}
        />
    )
}

/**
 * A list view of forum posts.
 * @param {Object} props = Properties passed to the Posts component.
 * @param {Post[]} props.posts - Array of Post to be displayed.
 * @returns {JSX.Element} A component containing the forum posts.
 */
const Posts = ({ posts }: { posts: Post[] }): JSX.Element => {
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
const RightBar = (): JSX.Element => {
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
const Feed = ({ selectedCategories }: {
    selectedCategories: string[],
}): JSX.Element => {
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

    if (loading) {
        return <Loading />
    } else if (error) {
        return <ErrorMessage message={error} />;
    }

    return (
        <Stack>
            <Stack direction="row" justifyContent="space-between">
                <Posts posts={filteredPosts}/>
                {/* <RightBar /> */}
            </Stack>
        </Stack> 
    )
}

/**
 * Displays the expanded, detailed view of a post. 
 * @returns 
 */
const PostDetails = ({ post }: { 
    post: Post
}): JSX.Element => {

    const postId = post.id;

    const { isDeletePostOpen, toggleDeletePostOpen } = useIsDeletePostOpen();
    /**
     * @function handleDeleteOpen - handles the event where the "Delete" button is pressed.
     */
    const handleDeleteOpen = () => {
        toggleDeletePostOpen(postId);
    }

            return (

                <GenericPostCard
                post={post}
                editButton={<EditPostButton postId={postId}/>}
                deleteButton={<DeleteItemButton itemId={postId} handleDeleteOpen={handleDeleteOpen} />}
                />

                // <Card sx={{ mt: 1, ml: 2, mr: 2 }}>
                //     <PostCardHeader 
                //         post={post as Post}
                //         editButton={<EditPostButton postId={postId}/>}
                //         // deleteButton={<DeletePostButton postId={postId} />}
                //         deleteButton={<DeleteItemButton itemId={postId} handleDeleteOpen={handleDeleteOpen} />}
                //     />

                //     {/* Post Content */}
                //     <CardContent sx={{ mt: -3 }}>
                //         <Typography>
                //             {post?.content}
                //         </Typography>
                //     </CardContent>

                // </Card>
        );
//    }
}

// FEATURE: CREATE POST
const CreatePostButton = (): JSX.Element => {
    const { isLoginOpen, toggleLoginOpen } = useIsLoginOpen();
    const { isCreateOpen, toggleCreateOpen } = useIsCreateOpen();
    const isLoggedIn = useSelector(selectUserIsLoggedIn);

    /** Conditionally render either the CreatePostForm
     * or the LoginForm,
     * based on the logged in status of the user.
     */
    const handleCreatePostOpen = () => {
        isLoggedIn ? toggleCreateOpen() : toggleLoginOpen();
    };

    return (
        <StyledButton
        content={<AddCircle />}
        onClick={handleCreatePostOpen}
        sx={{ color: 'primary.main' }}
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

    // Fetch categories to fill up the "Select Categories" button
    // TODO: replace with REDUX!
    const fetchAllCategories = useCallback(
        () => categoryClient.getAll(), []
    );

    const { data: categories } = useFetch(fetchAllCategories);

    return (
        // dialog box
        <Dialog open={isCreateOpen} maxWidth="xs" onClose={handleClose}>

                <Paper elevation={8} sx={{p: 2}}>
                    <StyledHeader
                    avatar={<PostAdd />}
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
                            value={data[field.name as keyof NewPost]} // Eg. data[username], data[password]
                            onChange={handleChange}
                            />
                            :
                            
                            <FormControl fullWidth>
                                <InputLabel>{field.placeholder}</InputLabel>
                                <Select
                                key={field.name}
                                name={field.name}
                                value={data[field.name as keyof NewPost]}
                                onChange={handleChange}
                                input={<OutlinedInput label={field.placeholder} />}
                                required={field.required}
                                renderValue={selected => {
                                    const category = categories?.find(cat => cat.id === selected);
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
                        sx={{ mt: 2 }}
                        />

                        {error ? <ErrorMessage message={error} /> : <></>}
                    </Box>
                        

                </Paper>

        </Dialog>
    )
}

// FEATURE: EDIT POST
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
function EditPostForm({ post }: {
    post: Post,
}): JSX.Element {
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
    } = useEditPostForm(post, handleClose);

    // TODO: replace with REDUX!
    const fetchAllCategories = useCallback(
        () => categoryClient.getAll(), []
    );
    const { data: categories, loading: fetchCategoriesLoading } = useFetch(fetchAllCategories);

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
                            <FormControl fullWidth>
                                <InputLabel>{field.placeholder}</InputLabel>
                                {/* Conditionally render based on loading state of categories */}
                                {fetchCategoriesLoading
                                    ?
                                    <Select 
                                    value=''
                                    />
                                    :
                                    <Select
                                    key={field.name}
                                    name={field.name}
                                    value={formData[field.name as keyof UpdatedPost]}
                                    onChange={handleChange}
                                    input={<OutlinedInput label={field.placeholder} />}
                                    required={field.required}
                                    renderValue={selected => {
                                        const category = categories?.find(cat => cat.id === selected);
                                        return <>{category?.label}</>;
                                    }}
                                    >
                                        {categories?.map(cat => (
                                            <MenuItem key={cat.id} value={cat.id}>
                                                {cat.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                }
                            </FormControl>
                            );
                    })}


                        <SubmitButton
                        submitButtonText={<>Save</>}
                        loading={loading}
                        sx={{ mt: 2 }}
                        />

                        {error ? <ErrorMessage message={error} /> : <></>}
                    </Box>
                        

                </Paper>

        </Dialog>
    )
}

// FEATURE: DELETE
// export function ConfirmPostDelete(): JSX.Element {
//     const { isDeletePostOpen, toggleDeletePostOpen, postId } = useIsDeletePostOpen();

//     const handleClose = () => {
//         toggleDeletePostOpen();
//     }

//     const confirmDeleteText = 'Are you sure you want to delete this post?';

 
//     const { loading, error, handleDelete } = usePostDelete(postId, handleClose);

//     return (
//         <Dialog open={isDeletePostOpen} maxWidth="xs" onClose={handleClose}>
//             <Paper elevation={8} sx={{p: 2}}>

//                 <StyledHeader
//                 avatar={<Delete />}
//                 title='Delete Post'
//                 />

//                 <Typography>{confirmDeleteText}</Typography>

//                 <Stack direction='row' justifyContent='space-between'>
//                     <StyledButton
//                     content='Cancel'
//                     onClick={handleClose}
//                     />

//                     <StyledButton
//                     content='Yes'
//                     bgColor='red'
//                     onClick={handleDelete}
//                     />
//                 </Stack>
//             </Paper>
//         </Dialog>
//     )
// }


export { Feed, PostDetails, CreatePostButton, CreatePostForm, EditPostForm };