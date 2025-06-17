// Global variables
let items = [];
let brands = new Set();

// Initialize the application
async function init() {
    try {
        await loadItems();
        setupEventListeners();
    } catch (error) {
        console.error('Failed to initialize:', error);
        alert('Failed to load inventory. Please refresh the page.');
    }
}

// Load items from the API
async function loadItems() {
    try {
        items = await api.getItems();
        updateTable();
        updateBrandFilter();
    } catch (error) {
        console.error('Error loading items:', error);
        throw error;
    }
}

// Update the inventory table
function updateTable(filteredItems = items) {
    const tbody = document.getElementById('inventoryTableBody');
    tbody.innerHTML = '';

    filteredItems.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.item_name}</td>
            <td>${item.brand}</td>
            <td>${item.date_added}</td>
            <td>${item.quantity}</td>
            <td>
                <button class="action-btn edit-btn" onclick="editItem(${item.id})">Edit</button>
                <button class="action-btn delete-btn" onclick="deleteItem(${item.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Update brand filter options
function updateBrandFilter() {
    const brandFilter = document.getElementById('brandFilter');
    brands = new Set(items.map(item => item.brand));
    
    // Clear existing options except "All Brands"
    brandFilter.innerHTML = '<option value="">All Brands</option>';
    
    // Add brand options
    brands.forEach(brand => {
        const option = document.createElement('option');
        option.value = brand;
        option.textContent = brand;
        brandFilter.appendChild(option);
    });
}

// Filter items based on search and brand filter
function filterItems() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const brandFilter = document.getElementById('brandFilter').value;

    const filteredItems = items.filter(item => {
        const matchesSearch = item.item_name.toLowerCase().includes(searchTerm) ||
                            item.brand.toLowerCase().includes(searchTerm);
        const matchesBrand = !brandFilter || item.brand === brandFilter;
        return matchesSearch && matchesBrand;
    });

    updateTable(filteredItems);
}

// Show add item form
function showAddItemForm() {
    document.getElementById('modalTitle').textContent = 'Add New Item';
    document.getElementById('itemForm').reset();
    document.getElementById('itemId').value = '';
    document.getElementById('itemModal').style.display = 'block';
}

// Show edit item form
async function editItem(id) {
    try {
        const item = await api.getItem(id);
        document.getElementById('modalTitle').textContent = 'Edit Item';
        document.getElementById('itemId').value = item.id;
        document.getElementById('itemName').value = item.item_name;
        document.getElementById('brand').value = item.brand;
        document.getElementById('dateAdded').value = item.date_added;
        document.getElementById('quantity').value = item.quantity;
        document.getElementById('itemModal').style.display = 'block';
    } catch (error) {
        console.error('Error loading item:', error);
        alert('Failed to load item details');
    }
}

// Close modal
function closeModal() {
    document.getElementById('itemModal').style.display = 'none';
}

// Delete item
async function deleteItem(id) {
    if (confirm('Are you sure you want to delete this item?')) {
        try {
            await api.deleteItem(id);
            await loadItems();
        } catch (error) {
            console.error('Error deleting item:', error);
            alert('Failed to delete item');
        }
    }
}

// Setup event listeners
function setupEventListeners() {
    // Form submit handler
    document.getElementById('itemForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const itemId = document.getElementById('itemId').value;
        const item = {
            item_name: document.getElementById('itemName').value,
            brand: document.getElementById('brand').value,
            date_added: document.getElementById('dateAdded').value,
            quantity: parseInt(document.getElementById('quantity').value)
        };

        try {
            if (itemId) {
                await api.updateItem(itemId, item);
            } else {
                await api.createItem(item);
            }
            closeModal();
            await loadItems();
        } catch (error) {
            console.error('Error saving item:', error);
            alert('Failed to save item');
        }
    });
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', init); 