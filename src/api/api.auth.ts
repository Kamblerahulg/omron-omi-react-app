// src/api/api.auth.ts

import { setToken } from "../utils/cookies";

export const generateToken = async () => {
    try {
        const response = await fetch(
            "https://7gh3rz55ge.execute-api.ap-southeast-1.amazonaws.com/stage/auth/token",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    client_id: "myclientid",
                    client_secret: "mysecret",
                }),
            }
        );

        if (!response.ok) {
            throw new Error("Failed to generate token");
        }

        const data = await response.json();

        // Save token
        // localStorage.setItem("access_token", data.access_token);
        setToken(data.access_token)
        return data;
    } catch (error) {
        console.error("Token generation error:", error);
        throw error;
    }
};
