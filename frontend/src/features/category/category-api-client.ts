import ApiClient, { ApiClientResponse } from "../../api/ApiClient"; 
// import Category from "../../types/Category";
import Category from "./category-types";
import MockError from "../../common/errors/MockError";

// MOCK API ENDPOINTS
import { getAllCategories, getCategorybyId } from "../../api/category-api";

class CategoryClient extends ApiClient<Category> {
    async getAll(): Promise<ApiClientResponse<Category[]>> {
        
        try {
            // TODO: replace with axios GET call
            // const data = await axios.get("")
            const res = await getAllCategories();
           
            const data = res.map(cat => ({
                ...cat,
                id: cat.id.toString(),
            }))

            return {
                type: "success",
                data: data,
                error: "",
            }
        } catch (err: any) {
            let message;

            // TODO: Replace MockError with AxiosError or something
            if (err instanceof MockError) {
                message = err.message;
            } else {
                message = "An unknown error occurred.";
            };

            return {
                type: "error",
                data: null,
                error: message,
            };
        }
    }

    async getById(categoryId: string): Promise<ApiClientResponse<Category>> {
        try {
            // TODO: replace with axios GET call
            // const data = await axios.get("API_BASE_URL/category/categoryId")

            console.log("categoryClient.getById(id)", categoryId);
            const res = await getCategorybyId(parseInt(categoryId));
           
            const data = {
                ...res,
                id: res.id.toString()
            }

            return {
                type: "success",
                data: data,
                error: "",
            };

        } catch (err: any) {
            let message;

            // TODO: Replace MockError with AxiosError or something
            if (err instanceof MockError) {
                message = err.message;
            } else {
                message = "An unknown error occurred.";
            }

            return {
                type: "error",
                data: null,
                error: message,
            };
        }
    }
}

const categoryClient = new CategoryClient("");
export default categoryClient;