// NOTE: this is only for development purposes.
// USELESS once backend is set up.

import MockError from "../common/errors/MockError";
// import Category from "../types/Category";

interface BackendCategory {
    id: number;
    value: string;
    label: string;
}

// HARD CODED
const categories: BackendCategory[] = [
    {
        id: 1,
        value: "rant",
        label: "Rant",
    },
    {
        id: 2,
        value: "school",
        label: "School",
    },
    {
        id: 3,
        value: "off_topic",
        label: "Off-Topic",
    }
]

export const getAllCategories = async (): Promise<BackendCategory[]> => {
    return categories;
}

export const getCategorybyId = async (categoryId: number): Promise<BackendCategory> => {
    // Responsibility of error handling should fall on the caller.
    const category = categories.find(cat => cat.id === categoryId);

    // mock 404 error
    if (!category) {
        throw new MockError("404: Post Not Found");
    } else {
        return category;
    };
}