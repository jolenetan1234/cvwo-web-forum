import { Chip, Stack, Typography } from "@mui/material";
import { useState } from "react"
import StyledButton from "./StyledButton";

/**
 * A component that conditionally truncates content based on a maximum length
 * and provides a toggle to expand or collapse the content.
 *
 * @param {Object} props - Component props.
 * @param {string} props.content - The full text content to display.
 * @param {number} props.maxLength - The maximum number of characters
 * to show before truncating.
 * @returns {JSX.Element} The rendered JSX element 
 * displaying either the truncated or full content, with a toggle button.
 */
export const SeeMore = ({ content, maxLength }: {
    content: string,
    maxLength: number,
}): JSX.Element => {
    const [expanded, setExpanded] = useState(false);

    // Depending on max length, either show expanded view
    // or shortened view, with a button to toggle expanded
    if (content.length > maxLength) {
        return (
            expanded ? (
                <Stack alignItems='flex-start'>
                    <Typography>{content}</Typography>
                    <StyledButton
                    content={<Chip label='See Less' />}
                    onClick={() => setExpanded(false)}
                    sx={{ px: 0 }}
                    />
                </Stack>
            ) : (
                <Stack alignItems='flex-start'>
                    <Typography>{content.slice(0, maxLength)}</Typography>
                    {/* See More button */}
                    <StyledButton
                    content={<Chip label='...' />}
                    onClick={() => setExpanded(true)}
                    sx={{ px: 0 }}
                    />
                </Stack>
            )
        );
    } else {
        return (
            <Typography>{content}</Typography>
        );
    };
}