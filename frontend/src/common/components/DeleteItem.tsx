// TODO: DELETE THIS FILE
import { Dialog, Paper, Stack, Typography } from "@mui/material"
import { Delete } from "@mui/icons-material"
import StyledButton from "./StyledButton";
import { StyledHeader } from "./Form";


export const DeleteItemButton = ({ itemId, handleDeleteOpen, sx }: { 
    itemId: string, 
    handleDeleteOpen: () => void,
    sx?: object
}): JSX.Element => {

    return (
        <StyledButton
        content={<Delete />}
        onClick={handleDeleteOpen}
        sx={{
            ...sx,
            color: 'red',
        }}
        />
    )
}

export function ConfirmDelete({ isOpen, confirmDeleteText, handleClose, handleDelete, loading, error }: {
    isOpen: boolean,
    confirmDeleteText: string,
    handleClose: () => void,
    handleDelete: () => void,
    loading?: boolean,
    error?: string | null
}): JSX.Element {

    return (
        <Dialog open={isOpen} maxWidth="xs" onClose={handleClose}>
            <Paper elevation={8} sx={{p: 2}}>
                {/* Header */}
                <StyledHeader
                avatar={<Delete />}
                title='Delete Post'
                />

                {/* Confirm delete text */}
                <Typography>{confirmDeleteText}</Typography>

                {/* Yes and no buttons */}
                <Stack direction='row' justifyContent='space-between'>
                    <StyledButton
                    content='Cancel'
                    onClick={handleClose}
                    />

                    <StyledButton
                    content='Yes'
                    onClick={handleDelete}
                    sx={{ backgroundColor: 'red' }}
                    />
                </Stack>
            </Paper>
        </Dialog>
    )
}