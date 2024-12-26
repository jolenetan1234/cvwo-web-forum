import { Box } from "@mui/material";
import { CategoryHeader } from "../features/category/category-components";
import { Feed } from "../features/post/post-components";

// hooks
import { useCategory } from "../features/category/category-hooks";
import { LoginForm } from "../features/user/user-components";
import { useIsOpen } from "../common/contexts/IsOpenContext";
import { Login } from "@mui/icons-material";
import { useIsCreateOpen } from "../common/contexts/IsCreateOpenContext";

export default function HomePage(): JSX.Element {
    // hooks
    const { selectedCategories, handleCategoryChange, handleCategoryDelete } = useCategory<number>();
    const { isOpen, toggleOpen } = useIsOpen();
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
            { isOpen ? <LoginForm /> : <></> }
        </Box>
   )
}