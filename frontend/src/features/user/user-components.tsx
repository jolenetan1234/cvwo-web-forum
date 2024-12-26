import { Cancel, LockOutlined } from "@mui/icons-material";
import { Avatar, Box, Button, Checkbox, Container, Dialog, FormControl, FormControlLabel, Grid2, Link, Paper, Stack, TextField, Typography } from "@mui/material";
import { SubmitButton } from "../../common/components/Form";

// contexts
import { useIsLoginOpen } from "../../common/contexts/IsLoginOpenContext";

// hooks
import { useLoginForm, useSignUpForm } from "./user-hooks";

// types
import { LoginData, SignUpData } from "./user-types";
import { FormField } from "../../common/components/Form";

export function LoginForm(): JSX.Element {
    // hooks
    const { isLoginOpen, toggleLoginOpen } = useIsLoginOpen();

    const handleClose = (): void => {
        toggleLoginOpen();
    }

    const { data, loading, error, handleChange, handleSubmit } = useLoginForm(handleClose);

    const fields: FormField[] = [
        {
            fieldType: "input",
            placeholder: "Username",
            name: "username",
            required: true,
        }, {
            fieldType: "input",
            placeholder: "Password",
            name: "password",
            required: true,
            type: "password",
        }
    ]

    return (
        // dialog box
        <Dialog open={isLoginOpen} maxWidth="xs" onClose={handleClose}>

                <Paper elevation={8} sx={{p: 2}}>
                    {/* "Sign In" and close button */}
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
                                <LockOutlined />
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
                        Sign In
                    </Typography>

                    {/* form component  */}
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
                        */}

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
                        */}

                    </Box>

                        <Stack sx={{ mt: 2, textAlign: "center" }}>
                            <Typography>No account?</Typography>
                            <Link href={`${import.meta.env.VITE_APP_URL}/signup`} color="#0000EE">Create one!</Link>
                        </Stack>
                    {/* </Box> */}

                </Paper>

        </Dialog>
    )
}

export function SignupForm(): JSX.Element {

    const fields: FormField[] = [
        {
            fieldType: "input",
            placeholder: "Username",
            name: "username",
            required: true,
        },
        {
            fieldType: "input",
            placeholder: "Password",
            name: "password",
            required: true,
            type: "password",
        },
        {
            fieldType: "input",
            placeholder: "Confirm password",
            name: "confirm_password",
            required: true,
            type: "password",
        }
    ]

    const handleClose = (): void => {
        // TODO: redirect to home page
    }

    // hooks
    const { data, loading, error, handleChange, handleSubmit } = useSignUpForm(handleClose);

    return (
        // dialog box

                <Paper elevation={8} sx={{p: 2}}>
                    {/* "Sign In" and close button */}
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
                                <LockOutlined />
                            </Avatar>
                        </Box>

                        {/* Cancel button */}
                        <Button 
                        onClick={() => {}} 
                        sx={{ color: "black", display:"flex", flexGrow:"4", justifyContent: "flex-end"}}>
                            <Cancel />
                        </Button>
                    </Stack>
                    <Typography 
                    variant="h6" 
                    sx={{
                        textAlign: "center"
                    }}>
                        Sign Up
                    </Typography>

                    {/* form component  */}
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
                            value={data[field.name as keyof SignUpData]} // Eg. data[username], data[password]
                            onChange={handleChange}
                            />
                            );
                    })}

                        {/* confirm password */}


                        <SubmitButton 
                        submitButtonText={<>Sign Up</>}
                        loading={loading}
                        />
                    </Box>

                </Paper>
    )
}