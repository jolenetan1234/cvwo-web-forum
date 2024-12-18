import { useEffect } from "react";

// types
import { useState } from "react";
import Post from "../../types/Post";
import { ApiClientResponse } from "../../api/ApiClient";

// API client
import forumPostClient from "./post-api-client";

interface useFilterResponse {
    filteredList: Post[],
    error: string,
    loading: boolean,
}

/**
 * 
 * @param list 
 * @param selectedCategories 
 */
// set type argument as T, because the expected behaviour of this is an array
// sort of like Stream<T>
function useFilter(selectedCategories: string[]): useFilterResponse{
    const [filteredList, setFilteredList] = useState<Post[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const filterData = async () => {
            let res: ApiClientResponse<Post[]>

            if (selectedCategories.length == 0) {
                res = await forumPostClient.getAll(); 
            } else {
                res = await forumPostClient.getByCategories(selectedCategories);
            }

            console.log("useFilter: filterData()", res);
        }
    })

    if (selectedCategories.length == 0) {
        // data = APIClient.getAll()
    } else {
        // data = APIClient.fetchByCategory

        ))
    }
}

