// API endpoints
const API_BASE_URL = 'http://localhost:8000';

// API functions
const api = {
    // Get all items
    async getItems() {
        const response = await fetch(`${API_BASE_URL}/items`);
        return response.json();
    },

    // Get single item
    async getItem(id) {
        const response = await fetch(`${API_BASE_URL}/items/${id}`);
        return response.json();
    },

    // Create new item
    async createItem(item) {
        const response = await fetch(`${API_BASE_URL}/items`, {
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
        const response = await fetch(`${API_BASE_URL}/items/${id}`, {
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
        const response = await fetch(`${API_BASE_URL}/items/${id}`, {
            method: 'DELETE',
        });
        return response.json();
    }
}; 