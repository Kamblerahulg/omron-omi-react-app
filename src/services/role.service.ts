import { callApi } from "../api/api.util";

const ROLE_URL =
    "https://vmog6qwktg.execute-api.ap-southeast-1.amazonaws.com/stage/roles";

export interface Role {
    role_id: string;
    role_name: string;
}

export const roleService = {
    list: async (): Promise<Role[]> => {
        const response = await callApi<{
            items: Role[];
        }>({
            url: ROLE_URL,
            method: "GET",
            requiresAuth: true,
        });

        return response?.items ?? [];
    },
};