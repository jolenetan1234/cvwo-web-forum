// EDIT LATER AFTER DINNER
/*
interface formProps {
    title: string,
    fields: [
        {
            question: string,
        }
    ] 
}
*/

import { Cancel, LockOutlined } from "@mui/icons-material";
import { Avatar, Box, Button, Dialog, Paper, Stack, TextField, Typography } from "@mui/material"
import React from "react";

/*
export interface FormField {
    fieldType: "input" | "select",
    placeholder: string,
    name: string,
    required?: boolean,
    type?: string,
}
    */

/**
 * Component contatining form fields and submit button. 
 * @param param0 
 * @returns 
 */
/*
export function Fields<T>({ fields, data, handleSubmit, handleChange }: {
    fields: FormField[],
    data: T,
    handleSubmit: () => void,
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void,
}): JSX.Element {
    return (
                    <Box
                    component="form"
                    onSubmit={handleSubmit}>
                        {fields.map(field => {
                            field.fieldType === "input" ? (
                                <TextField
                                key={field.name}
                                fullWidth
                                placeholder={field.required ? `${field.placeholder}*` : field.placeholder}
                                required={field.required}
                                sx={{ mb: 2 }}
                                autoFocus
                                {...(field.type ? { type: field.type } : {})} // Conditionally add the type attribute
                                name={field.name}
                                value={data[field.name as keyof T]} // Eg. data[username], data[password]
                                onChange={handleChange}
                                />

                            )
                            return (
                            );
                    })}


                        <SubmitButton 
                        submitButtonText={<>Sign In</>}
                        loading={loading}
                        />

                    </Box>
    )
}
    */

export function SubmitButton({ submitButtonText, loading}: {
    submitButtonText: React.ReactNode,
    loading: boolean,
}): JSX.Element {
    return (
        loading ? 
            <Button
            type="submit"
            variant="contained"
            fullWidth
            >
                Submitting...
            </Button>
        : 
            <Button
            type="submit"
            variant="contained"
            fullWidth
            >
                { submitButtonText }
            </Button>
    );
}

export function StyledFormHeader({ avatar, formTitle, handleClose }: {
    avatar: React.ReactElement,
    formTitle: string,
    handleClose: () => void,
}
) {
    return (
        <Box>
                    <Stack 
                    direction="row"
                    alignItems="center"
                    width="100%"
                    >
                        {/* Spacer for Avatar */}
                        <Box 
                        flexGrow={5}
                        display="flex"
                        justifyContent="flex-end" 
                        >
                        {/* Avatar */}
                            <Avatar sx={{ 
                                bgcolor: "secondary.main",
                            }}>
                                {avatar}
                            </Avatar>
                        </Box>

                        {/* Cancel button */}
                        <Button 
                        onClick={handleClose} 
                        sx={{ color: "black", display:"flex", flexGrow:"4", justifyContent: "flex-end"}}>
                            <Cancel />
                        </Button>
                    </Stack>
                    <Typography 
                    variant="h6" 
                    sx={{
                        textAlign: "center"
                    }}>
                        {formTitle}
                    </Typography>
                    </Box>
    )
}

/*
export default function Form(): JSX.Element {
    return (
        // dialog box
        <Dialog open={isLoginOpen} maxWidth="xs" onClose={handleClose}>

                <Paper elevation={8} sx={{p: 2}}>
                    {/* "Sign In" and close button */ /*}
                    <Stack 
                    direction="row"
                    alignItems="center"
                    width="100%"
                    >
                        {/* Spacer for Avatar */ /*}
                        <Box
                        flexGrow={5}
                        display="flex"
                        justifyContent="flex-end" 
                        >
                        {/* Avatar */ /*}
                            <Avatar sx={{ 
                                bgcolor: "secondary.main",
                            }}>
                                <LockOutlined />
                            </Avatar>
                        </Box>

                        {/* Cancel button */ /*}
                        <Button 
                        onClick={handleClose} 
                        sx={{ color: "black", display:"flex", flexGrow:"4", justifyContent: "flex-end"}}>
                            <Cancel />
                        </Button>
                    </Stack>
                    <Typography 
                    variant="h6" 
                    sx={{
                        textAlign: "center"
                    }}>
                        Sign In
                    </Typography>

                    {/* form component  */ /*}
                    <Box
                    component="form"
                    onSubmit={handleSubmit}>
                        {fields.map(field => {

                            return (
                            <TextField
                            key={field.name}
                            fullWidth
                            placeholder={field.required ? `${field.placeholder}*` : field.placeholder}
                            required={field.required}
                            sx={{ mb: 2 }}
                            autoFocus
                            {...(field.type ? { type: field.type } : {})} // Conditionally add the type attribute
                            name={field.name}
                            value={data[field.name as keyof LoginData]} // Eg. data[username], data[password]
                            onChange={handleChange}
                            />
                            );
                    })}

                        {/*
                        <FormControlLabel
                        control={<Checkbox value="remember" color="secondary"/>}
                        label="Remember me"
                        />
                        */ /*}

                        <SubmitButton 
                        submitButtonText={<>Sign In</>}
                        loading={loading}
                        />
                        {/*
                        <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        >
                            Sign In
                        </Button>
                        */ /*}

                    </Box>

                        <Stack sx={{ mt: 2, textAlign: "center" }}>
                            <Typography>No account?</Typography>
                            <Link href={`${import.meta.env.VITE_APP_URL}/signup`} color="#0000EE">Create one!</Link>
                        </Stack>
                    {/* </Box> */ /*}

                </Paper>

        </Dialog>
    )
}
    */