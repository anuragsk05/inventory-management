// API endpoints
const API_BASE_URL = 'http://localhost:8000';

// API functions
const api = {
    // Get all items (simple version)
    async getItems() {
        const response = await fetch(`${API_BASE_URL}/items/`);
        return response.json();
    },

    // Get all items (user-specific version)
    getItemsForUser(userId) {
        return fetch(`${API_BASE_URL}/users/${userId}/items/`)
            .then(response => response.json());
    },

    // Get single item
    async getItem(id) {
        const response = await fetch(`${API_BASE_URL}/users/${currentUser}/items/${id}`);
        return response.json();
    },

    // Create new item
    async createItem(item) {
        const response = await fetch(`${API_BASE_URL}/users/${currentUser}/items/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(item),
        });
        return response.json();
    },

    // Update item
    async updateItem(id, item) {
        const response = await fetch(`${API_BASE_URL}/users/${currentUser}/items/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(item),
        });
        return response.json();
    },

    // Delete item
    async deleteItem(id) {
        const response = await fetch(`${API_BASE_URL}/users/${currentUser}/items/${id}`, {
            method: 'DELETE',
        });
        return response.json();
    },

    // Login
    async login(username, password) {
        const response = await fetch(`${API_BASE_URL}/users/${username}/`, {
            method: 'GET',
        });
        return response.json();
    },

    // Logout
    async logout(username) {
        const response = await fetch(`${API_BASE_URL}/users/${username}/`, {
            method: 'DELETE',
        });
        return response.json();
    },

    // Create user
    async createUser(user) {
        const response = await fetch(`${API_BASE_URL}/users/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });
        return response.json();
    },

    // Update user
    async updateUser(username, user) {
        const response = await fetch(`${API_BASE_URL}/users/${username}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });
        return response.json();
    },

    // Delete user
    async deleteUser(username) {
        const response = await fetch(`${API_BASE_URL}/users/${username}/`, {
            method: 'DELETE',
        });
        return response.json();
    }
}; 