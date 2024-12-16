import { useEffect, useState } from "react"

// MOCK APIs
import { getAllPosts, getPostById } from "../../api/post-api";
import { getCommentsByPostId, getCommentById } from "../../api/comment-api";

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
                    const res = getAllPosts();
                    setData(res as T);
                } catch (err) {
                    setError(err as Error);
                }
            } else if (url.includes('/api/posts')) {
                try {
                    const id = getIdFromParams(url);
                    const res = getPostById(id);
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