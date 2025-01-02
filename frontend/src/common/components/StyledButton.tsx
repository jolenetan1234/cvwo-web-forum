import { Button } from "@mui/material";

export default function StyledButton({ content, onClick, contentColor, bgColor }: {
    content: React.ReactNode,
    onClick: () => void
    contentColor?: string,
    bgColor?: string,
}): JSX.Element {
    return (
        <Button color="inherit" onClick={onClick} sx={{ 
            color: contentColor ?? 'inherit',
            backgroundColor: bgColor ?? 'inherit',
            }}>
            {content}
        </Button> 
    )
}