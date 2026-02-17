export const getAuthToken = async () => {
  try {
    const response = await fetch(
      "https://mzx9xifx1h.execute-api.ap-southeast-1.amazonaws.com/dev/auth/token",
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
      throw new Error("Failed to fetch token");
    }

    const data = await response.json();

    // Save token in localStorage
    localStorage.setItem("access_token", data.access_token);

    return data.access_token;
  } catch (error) {
    console.error("Auth Error:", error);
    throw error;
  }
};
