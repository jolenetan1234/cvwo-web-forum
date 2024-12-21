import { LockOutlined } from "@mui/icons-material";
import { Avatar, Box, Button, Checkbox, Container, FormControlLabel, Grid2, Link, Paper, Stack, TextField, Typography } from "@mui/material";

export default function LoginForm(): JSX.Element {
    const handleSubmit = (): void => {

    }

    const fields = [
        {
            placeholder: "Username",
            required: true,
        }, {
            placeholder: "Password",
            required: true,
            type: "password",
        }
    ]

    return (
        <Container maxWidth="xs" >
            <Paper elevation={8} sx={{p: 2}}>
                <Avatar sx={{ 
                    mx: "auto",
                    bgcolor: "secondary.main",
                 }}>
                    <LockOutlined />
                </Avatar>
                <Typography 
                variant="h6" 
                sx={{
                    textAlign: "center"
                }}>
                    Sign In
                </Typography>

                {/* form component  */}
                <Box
                onSubmit={handleSubmit}
                >
                    {fields.map(field => (
                        <TextField
                        fullWidth
                        placeholder={field.placeholder}
                        required={field.required}
                        sx={{ mb: 2 }}
                        autoFocus
                        {...(field.type ? { type: field.type } : {})} // Conditionally add the type attribute
                        />
                    ))}

                    <FormControlLabel
                    control={<Checkbox value="remember" color="secondary"/>}
                    label="Remember me"
                    />

                    <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    >
                        Sign In
                    </Button>

                    <Stack sx={{ mt: 2, textAlign: "center" }}>
                        <Typography>No account?</Typography>
                        <Link href="" color="#0000EE">Create one!</Link>
                    </Stack>
                </Box>

            </Paper>
        </Container>
    )
}