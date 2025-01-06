import { Box } from "@mui/material";
import { CategoryHeader } from "../features/category/category-components";
import { CreatePostForm, Feed } from "../features/post/post-components";

// hooks
import { useCategory } from "../features/category/category-hooks";
import { LoginForm } from "../features/user/user-components";
import { useIsLoginOpen } from "../common/contexts/IsLoginOpenContext";
import { useIsCreateOpen } from "../common/contexts/IsCreateOpenContext";

export default function HomePage(): JSX.Element {
    // hooks
    const { selectedCategories, handleCategoryChange, handleCategoryDelete } = useCategory<string>();
    const { isLoginOpen, toggleLoginOpen } = useIsLoginOpen();
    const { isCreateOpen, toggleCreateOpen } = useIsCreateOpen();
            
    return (
        <Box>
            {/* Stack is basically a flexbox */}
            <CategoryHeader
            handleCategoryChange={handleCategoryChange}
            handleCategoryDelete={handleCategoryDelete}
            selectedCategories={selectedCategories}
            />
            <Feed
            selectedCategories={selectedCategories}
            />
            { isLoginOpen ? <LoginForm /> : <></> }
            { isCreateOpen ? <CreatePostForm /> : <></>}
        </Box>
   )
}