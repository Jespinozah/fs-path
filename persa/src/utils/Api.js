const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const api = async (endpoint, options = {}) => {
    const headers = {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
        ...options.headers,
    };

    const response = await fetch(`/api/v1${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Server response:", errorText); // Log the server response
        throw new Error(errorText || "API request failed");
    }

    return response.json();
};

export const get = (endpoint, options = {}) => api(endpoint, { ...options, method: "GET" });

export const post = (endpoint, body, options = {}) =>
    api(endpoint, { ...options, method: "POST", body: JSON.stringify(body) });

export const put = (endpoint, body, options = {}) =>
    api(endpoint, { ...options, method: "PUT", body: JSON.stringify(body) });

export const del = (endpoint, options = {}) => api(endpoint, { ...options, method: "DELETE" });