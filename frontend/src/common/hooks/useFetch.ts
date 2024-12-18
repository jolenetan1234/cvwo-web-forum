import { useEffect, useState } from "react"

// types
import { ApiClientResponse } from "../../api/ApiClient";

// MOCK APIs
import { getAllPosts, getPostById } from "../../api/post-api";
import { getCommentsByPostId, getCommentById } from "../../api/comment-api";

interface useFetchResponse<T> {
    // data will only be null in the case of an error. 
    // Empty arrays will still be here.
    data: T | null,     
    error: string,
    loading: boolean,
}

// calls eg. APIClient.get() => returns Promise<>
function useFetch<T>(
    fetchFunction: () => Promise<ApiClientResponse<T>> 
): useFetchResponse<T> {
    // if error !="" && data != null => then populate the response.
    // else, return { data: null, error: error, loading, false }
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    // useEffect() so that fetchData() is called whenever its dependencies change.
    // Ie. whenever `fetchFunction` changes.
    useEffect(() => {
        const fetchData = async (): Promise<void> => {
            console.log("fetchData()");
            setLoading(true);

            try {
                // Wait for the Promise<ApiClientResponse<T>> to resolve
                const res = await fetchFunction();
                console.log("fetched", res);

                if (res.type === "success") {
                    setData(res.data); 
                } else {
                    setError(res.error);
                }
            // catch unknown errors (NOT AXIOS ERRORS! Those already caught in APIClient)
            } catch (err) {
                setError("An unknown error occured.");
            } finally {
                setLoading(false);
            }
        }

        fetchData();
        console.log("LOADING", loading)

        /*
        // fetch the data, or setError should it throw an error.
        // Using try-catch here won't ensure asynchronous errors from fetchData() are caught.
        try {
            fetchData();
        } catch (err) {
            setError("An unknown error occurred.");
        }
        */
    }, [fetchFunction])

    return {
        data,
        error,
        loading,
    };
}

export default useFetch;

/*
function useFetch<T>(url: string): {
    data: T,
    error: Error | null,
    loading: boolean,
} {
    // set `data` as an array
    const [data, setData] = useState<T | null>(null);
    // set `error` as an object
    const [error, setError] = useState<Error | null>(null);
    // set `loading` as a boolean
    const [loading, setLoading] = useState(true);

    // useEffect so data is refetched whenever the API URL changes.
    useEffect(() => {
        // TEMP: helper function to obtain id from params
        const getIdFromParams = (url: string): number => {
            const matches = url.match(/\/(\d+)$/); // Match the last number in the URL
            return parseInt(matches[1]);
        }
 
        const fetchData = async () => {

            // TODO: replace with the appropriate `axios.get()` call. 
            // For now, it's hardcoded.
            if (url === '/api/posts') {
                try {
                    const res = await getAllPosts();
                    setData(res as T);
                } catch (err) {
                    setError(err as Error);
                }
            } else if (url.includes('/api/posts')) {
                try {
                    const id = getIdFromParams(url);
                    const res = await getPostById(id);
                    setData(res as T);
                } catch (err) {
                    setError(err as Error);
                }
            } else if (url === '/api/posts/comments/:postId') {
                try {
                    const id = getIdFromParams(url);
                    const res = getCommentsByPostId(id);
                    setData(res as T);
                } catch (err) {
                    setError(err as Error);
                }
            } else if (url === '/api/comments/:commentId') {
                try {
                    const id = getIdFromParams(url);
                    const res = getCommentById(id);
                    setData(res as T);
                } catch (err) {
                    setError(err as Error);
                }
            }

            setLoading(false);
           
        }

        fetchData();
    }, [url, loading]);
   

    return { 
        data,
        error,
        loading,
    };
}

export default useFetch;
*/