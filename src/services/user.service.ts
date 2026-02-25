// services/user.service.ts
import { callApi } from "../api/api.util";

const BASE_URL = "users";
const PRIVATE_KEY = "QOHSXRVIVFVABXSSFYQVSRFKK";

export interface CreateUserPayload {
    user_id: string;
    username: string;
    password: string;
    email: string;
    status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
}

export interface UserResponse {
    user_id: string;
    username: string;
    email: string;
    status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
}

export const userService = {
    // ✅ Create User
    create: async (payload: CreateUserPayload) => {
        return callApi<{
            message: string;
            user_id: string;
        }>({
            url: BASE_URL,
            method: "POST",
            requiresAuth: true,
            data: payload,
            headers: {
                "X-Private-Key": PRIVATE_KEY,
            },
        });
    },

    // ✅ Get Single User
    getById: async (userId: string) => {
        return callApi<UserResponse>({
            url: `${BASE_URL}/${userId}`,
            method: "GET",
            requiresAuth: true,
            headers: {
                "X-Private-Key": PRIVATE_KEY,
            },
        });
    },

    // ✅ List All Users
    list: async (): Promise<UserResponse[]> => {
        const response = await callApi<{
            items: UserResponse[];
        }>({
            url: BASE_URL,
            method: "GET",
            requiresAuth: true,
            headers: {
                "X-Private-Key": PRIVATE_KEY,
            },
        });

        return response?.items ?? [];
    },
    updateStatus: async (
        userId: string,
        status: "ACTIVE" | "INACTIVE" | "SUSPENDED"
    ) => {
        return callApi({
            url: `${BASE_URL}/${userId}`,
            method: "PUT",
            requiresAuth: true,
            data: { status },
            headers: {
                "X-Private-Key": PRIVATE_KEY,
            },
        });
    },
};