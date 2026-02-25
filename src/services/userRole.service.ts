import { callApi } from "../api/api.util";

const BASE_URL = "user-roles";
const PRIVATE_KEY = "QOHSXRVIVFVABXSSFYQVSRFKK";

export interface UserRolePayload {
    user_role_id?: number;
    user_id: string;
    role_id: string;
}

export interface UserRoleResponse {
    user_role_id: string;
    user_id: string;
    role_id: string;
}

export const userRoleService = {
    // 🔹 Create
    create: async (payload: UserRolePayload) => {
        return callApi<{
            message: string;
            user_role_id: number;
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

    // 🔹 List All
    list: async (): Promise<UserRoleResponse[]> => {
        const response = await callApi<{
            items: UserRoleResponse[];
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

    // 🔹 Get By Id
    getById: async (id: string) => {
        return callApi<UserRoleResponse>({
            url: `${BASE_URL}/${id}`,
            method: "GET",
            requiresAuth: true,
            headers: {
                "X-Private-Key": PRIVATE_KEY,
            },
        });
    },

    // 🔹 Update
    update: async (id: string | number, payload: UserRolePayload) => {
        return callApi({
            url: `${BASE_URL}/${String(id)}`, // 🔥 force string
            method: "PUT",
            requiresAuth: true,
            data: payload,
            headers: {
                "X-Private-Key": PRIVATE_KEY,
            },
        });
    },
};