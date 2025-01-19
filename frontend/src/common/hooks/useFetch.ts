import { useEffect, useState } from "react"

// types
import { ApiClientResponse } from "../../api/ApiClient";
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
            console.log("[useFetch.fetchData()]");
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
                setError(`An unknown error occured: ${err}`);
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