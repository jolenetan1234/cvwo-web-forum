import { Button } from "@mui/material";

export default function StyledButton({ content, onClick, sx }: {
    content: React.ReactNode,
    onClick: () => void
    sx?: object,
}): JSX.Element {
    return (
        <Button color="inherit" onClick={onClick} sx={sx}>
            {content}
        </Button> 
    )
}