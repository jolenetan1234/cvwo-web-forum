import { useEffect } from "react";

// types
import { useState } from "react";
import Post from "../../types/Post";
import { ApiClientResponse } from "../../api/ApiClient";

// API client
import forumPostClient from "./post-api-client";

interface useFilterResponse<T> {
    // data will only be null in the case of an error,
    // in which error message will be displayed.
    // Empty arrays will still be here.
    filteredList: T[] | null,     
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
function useFilter(selectedCategories: number[]): useFilterResponse<Post>{
    const [filteredList, setFilteredList] = useState<Post[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const filterData = async (): Promise<void> => {
            setLoading(true);

            try {
                let res: ApiClientResponse<Post[]>;

                if (selectedCategories.length == 0) {
                    res = await forumPostClient.getAll(); 
                } else {
                    res = await forumPostClient.getByCategories(selectedCategories);
                }
                
                console.log("[useFilter] selectedCategories", selectedCategories);
                console.log("[useFilter]: filterData()", res);

                // set states based on response status
                if (res.type === "success") {
                    setFilteredList(res.data);
                } else {
                    setError(res.error);
                }

            // catch unknown errors (NOT AXIOS ERRORS! Those already caught in APIClient)
            } catch (err) {
                setError("An unknown error occurred.");
            } finally {
                setLoading(false);
            }
        }

        filterData();
    }, [selectedCategories, ]);

    return {
        filteredList,
        error,
        loading
    };
}

export default useFilter;
