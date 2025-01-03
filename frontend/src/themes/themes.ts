import { createTheme } from "@mui/material";

export const darkTheme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#F8C630",
            light: "skyblue",
            dark: "",
        },
        secondary: {
            main: "#724E91",
            light: "",
            dark: "",
        },
    }
})

export const lightTheme = createTheme({
    palette: {
        primary: {
            main: "#F8C630",
            light: "skyblue",
            dark: "",
        },
        secondary: {
            main: "#724E91",
            light: "",
            dark: "",
        },
        action: {
            hover: ""
        }
    }
})

export const theme = createTheme({
    typography: {
        fontFamily: "Roboto, Arial, sans-serif",
    },
    palette: {
        primary: {
            main: "#F8C630",
            light: "skyblue",
            dark: "",
        },
        secondary: {
            main: "#724E91",
            light: "",
            dark: "",
        },
        action: {
            hover: ""
        }
    }
})