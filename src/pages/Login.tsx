import { useState } from "react";
import {
    Box,
    Button,
    Checkbox,
    Container,
    FormControlLabel,
    Paper,
    TextField,
    Typography,
    InputAdornment,
    Link,
    Snackbar,
    Alert,
    Divider,
} from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import MicrosoftIcon from "@mui/icons-material/DesktopWindows";
import { useNavigate } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import { generateToken } from "../api/api.auth";
import { loginRequest } from "../auth/msalConfig"; // 👈 ADD

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [openError, setOpenError] = useState(false);

    const navigate = useNavigate();
    const { instance } = useMsal(); // 👈 MSAL

    // Email regex
    const isValidEmail = (email: string) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    /* ======================
       NORMAL LOGIN (TEMP)
    ====================== */
    const handleLogin = async () => {
        if (!email.trim()) {
            setErrorMsg("Email is mandatory");
            setOpenError(true);
            return;
        }

        if (!isValidEmail(email)) {
            setErrorMsg("Please enter a valid email address");
            setOpenError(true);
            return;
        }

        if (!password.trim()) {
            setErrorMsg("Password is mandatory");
            setOpenError(true);
            return;
        }

        try {
            // 🔥 Call backend login API
            const res = await generateToken();
            localStorage.setItem("app_token", res.token);

            navigate("/landing-omi");
        } catch (error) {
            setErrorMsg("Login failed. Please try again.");
            setOpenError(true);
        }
    };
    /* ======================
       AZURE AD SSO LOGIN
    ====================== */
    const handleSSOLogin = async () => {
        try {
            const response = await instance.loginPopup(loginRequest);

            const idToken = response.idToken;

            // Send Azure token to backend
            const res = await fetch("/api/auth/sso-login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: idToken }),
            });

            if (!res.ok) throw new Error("SSO failed");

            const data = await res.json();
            localStorage.setItem("app_token", data.jwt);

            navigate("/landing-omi");
        } catch (error) {
            setErrorMsg("SSO login failed");
            setOpenError(true);
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background: "linear-gradient(180deg, #eef3fb 0%, #f8fbff 100%)",
                display: "flex",
                alignItems: "flex-start",   // 👈 pull upward
                justifyContent: "center",
                pt: 3,                      // 👈 tweak this (4–8 ideal)
            }}
        >
            <Box
                sx={{
                    transform: "scale(0.8)",
                    transformOrigin: "top center",  // 👈 important change
                    width: "100%",
                }}
            >

                <Container
                    maxWidth="sm"
                    sx={{
                        "& .MuiTypography-root": {
                            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                        },
                        "& .MuiButton-root": {
                            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                        },
                        "& .MuiInputBase-root": {
                            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                            fontSize: 14,
                        },
                    }}
                >

                    {/* Header */}
                    <Box textAlign="center" mb={2}>
                        <Box
                            component="img"
                            src={"../images/omron-logo-Dashboard-tp.png"}
                            alt="Omron"
                            sx={{ height: 75, objectFit: "contain" }}
                        />
                    </Box>

                    <Box textAlign="center" mb={1}>
                        <Typography variant="body2" color="text.secondary">
                            Sign in to your account
                        </Typography>
                    </Box>

                    {/* Login Card */}
                    <Paper elevation={6} sx={{ p: 4, borderRadius: 3 }}>
                        <Typography
                            fontSize={18}
                            fontWeight={600}
                            textAlign="center"
                            mb={3}
                        >
                            Login
                        </Typography>

                        {/* ===== SSO BUTTON ===== */}
                        <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<MicrosoftIcon />}
                            onClick={handleSSOLogin}
                            sx={{
                                mt: 2,
                                py: 1.2,
                                borderRadius: 2,
                                textTransform: "none",
                                fontWeight: 600,
                            }}
                        >
                            Sign in with Microsoft
                        </Button>

                        <Divider sx={{ my: 2 }}>OR</Divider>

                        {/* ===== NORMAL LOGIN (OPTIONAL) ===== */}
                        <TextField
                            fullWidth
                            placeholder="Enter your email"
                            margin="normal"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonOutlineIcon color="action" />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <TextField
                            fullWidth
                            placeholder="Enter your password"
                            type="password"
                            margin="normal"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockOutlinedIcon color="action" />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            mt={1}
                        >
                            {/* <Link underline="hover" fontSize={13}>
                            Forgot password?
                        </Link> */}

                            <FormControlLabel
                                control={<Checkbox size="small" />}
                                label={<Typography fontSize={13}>Remember me</Typography>}
                            />
                        </Box>

                        <Button
                            fullWidth
                            variant="contained"
                            onClick={handleLogin}
                            sx={{
                                mt: 3,
                                py: 1.2,
                                borderRadius: 2,
                                background: "#005eb8",
                                fontWeight: 600,
                                textTransform: "none",
                            }}
                        >
                            Login
                        </Button>
                    </Paper>

                    {/* Footer */}
                    <Typography textAlign="center" fontSize={12} color="text.secondary" mt={4}>
                        © 2026 Omron. All rights reserved.
                    </Typography>

                    {/* Error Snackbar */}
                    <Snackbar
                        open={openError}
                        autoHideDuration={3000}
                        onClose={() => setOpenError(false)}
                        anchorOrigin={{ vertical: "top", horizontal: "right" }}
                    >
                        <Alert
                            severity="error"
                            variant="filled"
                            onClose={() => setOpenError(false)}
                            sx={{ fontSize: 14, fontWeight: 500 }}
                        >
                            {errorMsg}
                        </Alert>
                    </Snackbar>
                </Container>
            </Box>
        </Box>
    );
};

export default Login;
