import { IconButton } from "@mui/material"
import StyledButton from "../../common/components/StyledButton"
import { useAppDispatch, useAppSelector } from "../../store/store-hooks"
import { selectTheme, toggleTheme } from "./theme-slice";

// components
import { LightMode, Nightlight } from "@mui/icons-material";

export const ToggleThemeButton = (): JSX.Element => {

    const dispatch = useAppDispatch();
    const currTheme = useAppSelector(selectTheme);

    const handleClick = () => {
        dispatch(toggleTheme());
    };

    return (
        <StyledButton
        content={currTheme === 'light' ? <Nightlight/> : <LightMode/>}
        onClick={handleClick}
        />
    )
}