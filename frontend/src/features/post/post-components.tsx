import { useParams } from "react-router-dom";

// components
import { Box, Card, CardContent, CardHeader, Chip, Divider, FormControl, InputLabel, Link, MenuItem, OutlinedInput, Select, SelectChangeEvent, Stack, Typography } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import CommentSection from "../comment/comment-components.tsx";

// types
import Post from "../../types/Post.ts";

// hooks
import useFetch from "../../common/hooks/useFetch.ts";
import Loading from "../../common/components/Loading.tsx";
import ErrorMessage from "../../common/components/ErrorMessage.tsx";
import SelectBox from "../../common/components/SelectBox.tsx";

// API client
import forumPostClient from "./post-api-client.ts";
import { useCallback, useState } from "react";

/**
 * A subheader containing the options for categories.
 * @returns The subheader above Cards.
 */
function CategoryHeader({ categories, selectedCategories, setSelectedCategories }: {
    categories: {
        label: string,
        db_value: string,
    }[],
    selectedCategories: string[],
    setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>,
}): JSX.Element {
    /*
    // HARD-CODED, REMOVE LATER
    const categories = [
        {
            label: "School",
            db_value: "school",
        },
        {
            label: "Rant",
            db_value: "rant",
        },
        {
            label: "Off-Topic",
            db_value: "off_topic",
        }
    ];

    /*
    // set states
    const [selectedCategories, setSelectedCategories] = useState<{ label: string, db_value: string }[]>([]);
    */    

    // const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    const handleChange = (
        event: SelectChangeEvent<string[]>
    ): void => {
        setSelectedCategories(event.target.value);
        console.log("handleChange", selectedCategories);
    }

    const handleDelete = (item: string): void => {
       setSelectedCategories(selectedCategories.filter(
        val => val != item
       )) ;
       console.log("handleDelete", selectedCategories);
    }
    
    /**
     * Removes `item` from `selectedCategories`.
     * @param item - A Category item.
     */
    /*
    const handleDelete = (item: { label: string, db_value: string }): void => {
        setSelectedCategories(selectedCategories.filter(
            cat => cat.db_value != item.db_value
        ));
    }
        */

    return (
       <Box sx={{ display: "flex" }}>
                <FormControl sx={{ m: 2, width: 500 }}>
      <InputLabel>Categories</InputLabel>
      <Select
        multiple
        value={selectedCategories}
        onChange={handleChange}
        input={<OutlinedInput label="Categories" />}
            renderValue={(selected) => (
                <Stack gap={1} direction="row" flexWrap="wrap">

                {selected.map((item) => {
                    // `item` refers to the db_value of a category item.
                    // and we want to access the label of that item.
                    const category = categories.find(cat => cat.db_value === item);
                    return (
                    <Chip 
                    key={item} 
                    label={category?.label}
                    onDelete = {() => handleDelete(item)}
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
        {categories.map((cat) => (
          <MenuItem key={cat.db_value} value={cat.db_value}>
            {cat.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
       </Box>
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
    const linkUrl = `${import.meta.env.VITE_APP_URL}/post/${post.id}`

    return (
        <Card>
            <CardHeader
            title={
                <Stack direction="row" alignItems="center">
                    <Link 
                    variant="h6"
                    sx={{ fontWeight: "bold" }}
                    href={linkUrl}
                    color="inherit"
                    >
                        {post.title}
                    </Link>
                    
                    <Chip
                    label={post.category}
                    size="small"
                    color="primary"
                    sx={{ ml: 1 }} // Add some margin to the left
                    />
                </Stack>
            }
            />

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
        <Box bgcolor="green" flex={3} >
            {posts.map(post => (
                <PostCard key={post.id} post={post}/>
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
    // API calls
    // const posts = getAllPosts();
    // fetch using the API client like ForumPostClient.getAll(); 
    // const { data, error, loading } = ForumPostClient.getAll();
    // have a [selectedCategories, setSelectedCategories] state. Then make the page rerender when this state changes.
    // using useCategoryFilter(category[]) => returns `{ selectedCategories, addCategory, removeCategory, resetCategory, isEmpty: boolean }

    // BUT HOW DO I PASS THE ABOVE INTO `CategoryHeader`?
    // so during render, if selectedCategories.isEmpty(), 
    // then { data, error, loading } = ForumPostClient.getAll();

    // else, { data, error, loading } = ForumPostClient.getPostsByCategory();

    const { data, error, loading } = useFetch<Post[]>(
        () => forumPostClient.getAll()
    );

    // categories
    // HARD-CODED, REMOVE LATER
    const CATEGORIES = [
        {
            label: "School",
            db_value: "school",
        },
        {
            label: "Rant",
            db_value: "rant",
        },
        {
            label: "Off-Topic",
            db_value: "off_topic",
        }
    ];

    const [categories, setCategories] = useState(CATEGORIES);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [filteredPostList, setFilteredPostList] = useState([]);

    

    // const { data, error, loading } = { filteredPostList, }
    // const [filteredPostList, setFilteredPostList] = useState([]);
    // const [selectedCategories, setSelectedCategories] = useState([]);
    // 
    /*
    useEffect(() => {
    if selectedCategories}) 
    */

    if (loading) {
        return <Loading />
    } else if (error != "") {
        return <ErrorMessage message={error} />;
    }

    return (
        <Stack>
            <CategoryHeader 
            categories={categories} 
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
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

    // const { data, error, loading } = useFetch<Post>()
    // const { data, error, loading } = useFetch<Post>(`/api/posts/${postId}`);
    /*
    const { data, error, loading } = useFetch<Post>(
        () => forumPostClient.getById(postId)
    );
    */
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
                {/* Post Title */}
                <CardHeader
                title={
                    <Stack direction="row" alignItems="center">

                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            {post?.title}
                        </Typography>

                        <Chip
                            label={post?.category}
                            size="small"
                            color="primary"
                            sx={{ ml: 1 }} // Add some margin to the left
                        />
                    </Stack>
                }
                />

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

    /*
    if () {
        // Return post details.
        return (
            <Card sx={{ mt: 1, ml: 2, mr: 2 }}>
                {/* Post Title */ /*}
                <CardHeader
                title={
                    <Stack direction="row" alignItems="center">

                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            {post?.title}
                        </Typography>

                        <Chip
                            label={post?.category}
                            size="small"
                            color="primary"
                            sx={{ ml: 1 }} // Add some margin to the left
                        />
                    </Stack>
                }
                />

                {/* Post Content */ /*}
                <CardContent sx={{ mt: -3 }}>
                    <Typography>
                        {post?.content}
                    </Typography>
                </CardContent>

                <Divider />
                {/* Comment Section */ /*}
                <CardContent>
                    <CommentSection postId={parseInt(postId)}/>
                </CardContent>
            </Card> 
        );
    } else {
        return <ErrorMessage message={error.message}/>;
    };
    */
}

export { Feed, PostDetails };