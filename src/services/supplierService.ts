import { callApi } from "../api/api.util";

const BASE_URL = "supplier/config";
const PRIVATE_KEY = "QOHSXRVIVFVABXSSFYQVSRFKK";

export interface Supplier {
    supplier_id: string;
    supplier_name: string;
    file_type: string;
    preprocessing_required: "Y" | "N";
    pii_masking: "Y" | "N";
    master_prompt: string;
    supplier_prompt: string;
    status: "ACTIVE" | "INACTIVE";
}

export type SupplierPayload = Omit<Supplier, "supplier_id"> & {
    supplier_id?: string;
};

export const supplierService = {
    // 🔹 Create
    create: async (payload: SupplierPayload) => {
        return callApi<{ message: string; supplier_id: string }>({
            url: BASE_URL,
            method: "POST",
            requiresAuth: true,
            data: payload,
            headers: { "X-Private-Key": PRIVATE_KEY },
        });
    },

    // 🔹 List
    // 🔹 List
    list: async (): Promise<Supplier[]> => {
        const response = await callApi<Supplier[]>({
            url: BASE_URL,
            method: "GET",
            requiresAuth: true,
            headers: { "X-Private-Key": PRIVATE_KEY },
        });

        return response ?? [];
    },

    // 🔹 Get By ID
    getById: async (id: string): Promise<Supplier> => {
        return callApi<Supplier>({
            url: `${BASE_URL}/${id}`,
            method: "GET",
            requiresAuth: true,
            headers: { "X-Private-Key": PRIVATE_KEY },
        });
    },

    // 🔹 Update (Partial Allowed ✅)
    update: async (id: string, payload: Partial<SupplierPayload>) => {
        return callApi({
            url: `${BASE_URL}/${id}`,
            method: "PUT", // change to PATCH if backend supports partial
            requiresAuth: true,
            data: payload,
            headers: { "X-Private-Key": PRIVATE_KEY },
        });
    },
};