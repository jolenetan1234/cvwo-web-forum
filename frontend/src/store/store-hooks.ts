import { useDispatch, useSelector } from "react-redux"; 
import { AppDispatch, RootState } from "./store";

// these hooks help with type inference
// use instead of simply calling `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();