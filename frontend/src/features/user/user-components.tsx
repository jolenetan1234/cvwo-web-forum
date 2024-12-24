import { Cancel, LockOutlined } from "@mui/icons-material";
import { Avatar, Box, Button, Checkbox, Container, Dialog, FormControl, FormControlLabel, Grid2, Link, Paper, Stack, TextField, Typography } from "@mui/material";
import { SubmitButton } from "../../common/components/Form";

// contexts
import { useIsOpen } from "../../common/contexts/IsOpenContext";

// hooks
import { useLoginForm, useSignUpForm } from "./user-hooks";

// types
import { LoginData, SignUpData } from "./user-types";
import { FormField } from "../../common/components/Form";

export function LoginForm(): JSX.Element {
    // hooks
    const { isOpen, toggleOpen } = useIsOpen();

    const handleClose = (): void => {
        toggleOpen();
    }

    const { data, loading, error, handleChange, handleSubmit } = useLoginForm(handleClose);

    // TODO: abstract into hook
    // <U> : data format for the form (eg. LoginData in this case)
    // <T> : Type of the expected ApiClientResponse of `submitFunction`. (Eg. User in this case)
    // useForm<T, U>(init: U, submitFunction: () => ApiClientResponse<T>) => 
    // { data: U, loading: boolean, error: string, handleChange, handleSubmit }
    /*
    const [ data, setData ] = useState<LoginData>({
        username: "",
        password: "",
    });

    const [ error, setError ] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
        console.log("[LoginForm.handleChange] data", data);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        // call the API endpoint and send the response.
        // Set error message also if any.
        // userClient.login(data);
        e.preventDefault();

        const login = async (): Promise<void> => {
            try {
                const res = await userClient.login(data);

                if (res.type === "success") {
                    const user = res.data;
                        console.log("submitted");
                        resetForm();
                        handleClose();
                } else {
                    setError(res.error);
                }

            } catch (err: any) {
               setError("An unexpected error occurred.");
            } finally {
                setLoading(false);
            }
        }

        login();
    };

    const resetForm = (): void => {
        // reset form to initial state
        setData({
            username: "",
            password: "",
        });

        // 
    };
    */

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
        <Dialog open={isOpen} maxWidth="xs" onClose={handleClose}>

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