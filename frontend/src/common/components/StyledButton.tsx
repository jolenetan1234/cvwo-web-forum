import { Button } from "@mui/material";

export default function StyledButton({ text, onClick }: {
    text: string,
    onClick: () => void
}): JSX.Element {
    return (
        <Button color="inherit" onClick={onClick}>
            {text}
        </Button> 
    )
}