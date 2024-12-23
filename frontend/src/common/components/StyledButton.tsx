import { Button } from "@mui/material";

export default function StyledButton({ content, onClick }: {
    content: React.ReactNode,
    onClick: () => void
}): JSX.Element {
    return (
        <Button color="inherit" onClick={onClick}>
            {content}
        </Button> 
    )
}