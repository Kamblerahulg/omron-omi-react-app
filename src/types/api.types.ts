export interface ApiRequestConfig {
  url: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  data?: any;
  params?: any;
  requiresAuth?: boolean; // 🔥 controls headers dynamically
}
