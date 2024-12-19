import { useEffect } from "react";

// types
import { useState } from "react";
import Post from "../../types/Post";
import ApiClient, { ApiClientResponse } from "../../api/ApiClient";

// DELETE LATER. BY RIGHT NO NEED PASS IN API CLIENT.
// API client
import forumPostClient from "../../features/post/post-api-client";

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
function useFilter<T>(
    filters: any[],
    apiClient: ApiClient<T>,
    filterFunction: (filters: any[]) => Promise<ApiClientResponse<T[]>>
): useFilterResponse<T>{
    const [filteredList, setFilteredList] = useState<T[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const filterData = async (): Promise<void> => {
            setLoading(true);

            try {
                let res: ApiClientResponse<T[]>;

                if (filters.length == 0) {
                    res = await apiClient.getAll(); 
                } else {
                    res = await filterFunction(filters);
                }
                
                console.log("[useFilter] selectedCategories", filters);
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
    }, [filters]);

    return {
        filteredList,
        error,
        loading
    };
}

export default useFilter;
