// Global variables
var items = [];
var currentPage = 1;
var itemsPerPage = 10;
var currentUser = null;

// Initialize the application
function init() {
    loadItems();
    setupEventListeners();
}

// Load items from the API
function loadItems() {
    if (currentUser) {
        // Load items for specific user
        api.getItemsForUser(currentUser).then(function(data) {
            items = data;
            updateTable();
        }).catch(function(error) {
            console.error('Error loading items:', error);
            alert('Failed to load inventory. Please refresh the page.');
        });
    } else {
        // Show empty table for guests
        items = [];
        updateTable();
    }
}

// Update the inventory table
function updateTable() {
    var tbody = document.getElementById('inventoryTableBody');
    tbody.innerHTML = '';

    var startIndex = (currentPage - 1) * itemsPerPage;
    var endIndex = startIndex + itemsPerPage;
    var pageItems = items.slice(startIndex, endIndex);

    pageItems.forEach(function(item) {
        var row = document.createElement('tr');
        row.innerHTML = '<td>' + item.item_name + '</td>' +
                       '<td>' + item.brand + '</td>' +
                       '<td>' + item.date_added + '</td>' +
                       '<td>' + item.quantity + '</td>' +
                       '<td><button onclick="editItem(' + item.id + ')">Edit</button> ' +
                       '<button onclick="deleteItem(' + item.id + ')">Delete</button></td>';
        tbody.appendChild(row);
    });

    updatePagination();
}

// Update pagination
function updatePagination() {
    var totalPages = Math.ceil(items.length / itemsPerPage);
    document.getElementById('pageInfo').textContent = 'Page ' + currentPage + ' of ' + totalPages;
    document.getElementById('prevBtn').disabled = currentPage === 1;
    document.getElementById('nextBtn').disabled = currentPage === totalPages;
}

// Previous page
function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        updateTable();
    }
}

// Next page
function nextPage() {
    var totalPages = Math.ceil(items.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        updateTable();
    }
}

// Search functionality
function searchItems() {
    var searchTerm = document.getElementById('searchInput').value.toLowerCase();
    var filteredItems = items.filter(function(item) {
        return item.item_name.toLowerCase().includes(searchTerm) ||
               item.brand.toLowerCase().includes(searchTerm);
    });
    
    var tbody = document.getElementById('inventoryTableBody');
    tbody.innerHTML = '';

    filteredItems.forEach(function(item) {
        var row = document.createElement('tr');
        row.innerHTML = '<td>' + item.item_name + '</td>' +
                       '<td>' + item.brand + '</td>' +
                       '<td>' + item.date_added + '</td>' +
                       '<td>' + item.quantity + '</td>' +
                       '<td><button onclick="editItem(' + item.id + ')">Edit</button> ' +
                       '<button onclick="deleteItem(' + item.id + ')">Delete</button></td>';
        tbody.appendChild(row);
    });
}

// Show edit modal
function editItem(id) {
    if (!currentUser) {
        alert('Please login first to edit items');
        return;
    }
    
    fetch(`${API_BASE_URL}/users/${currentUser}/items/${id}`).then(function(response) {
        return response.json();
    }).then(function(item) {
        document.getElementById('editItemId').value = item.id;
        document.getElementById('editItemName').value = item.item_name;
        document.getElementById('editBrand').value = item.brand;
        document.getElementById('editDateAdded').value = item.date_added;
        document.getElementById('editQuantity').value = item.quantity;
        document.getElementById('editModal').style.display = 'block';
    }).catch(function(error) {
        console.error('Error loading item:', error);
        alert('Failed to load item details');
    });
}

// Close edit modal
function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
}

// Delete item
function deleteItem(id) {
    if (!currentUser) {
        alert('Please login first to delete items');
        return;
    }
    
    if (confirm('Are you sure you want to delete this item?')) {
        fetch(`${API_BASE_URL}/users/${currentUser}/items/${id}`, {
            method: 'DELETE',
        }).then(function(response) {
            return response.json();
        }).then(function() {
            loadItems();
        }).catch(function(error) {
            console.error('Error deleting item:', error);
            alert('Failed to delete item');
        });
    }
}

// Show login modal
function showLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
}

// Close login modal
function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
}

// Show register modal
function showRegisterModal() {
    document.getElementById('registerModal').style.display = 'block';
}

// Close register modal
function closeRegisterModal() {
    document.getElementById('registerModal').style.display = 'none';
}

// Logout function
function logout() {
    currentUser = null;
    document.getElementById('userName').textContent = 'Guest';
    document.getElementById('logoutBtn').style.display = 'none';
    document.getElementById('userWelcome').textContent = 'Welcome, ';
    loadItems(); // Reload items (will show empty for guest)
    alert('Logged out successfully!');
}

// Setup event listeners
function setupEventListeners() {
    // Add item form
    document.getElementById('addItemForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!currentUser) {
            alert('Please login first to add items');
            return;
        }
        
        var item = {
            id: Date.now(), // Simple ID generation
            item_name: document.getElementById('itemName').value,
            brand: document.getElementById('brand').value,
            date_added: document.getElementById('dateAdded').value,
            quantity: parseInt(document.getElementById('quantity').value)
        };

        // Use the user-specific endpoint
        fetch(`${API_BASE_URL}/users/${currentUser}/items/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(item),
        }).then(function(response) {
            return response.json();
        }).then(function() {
            document.getElementById('addItemForm').reset();
            loadItems();
        }).catch(function(error) {
            console.error('Error creating item:', error);
            alert('Failed to create item');
        });
    });

    // Edit form
    document.getElementById('editForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!currentUser) {
            alert('Please login first to edit items');
            return;
        }
        
        var itemId = document.getElementById('editItemId').value;
        var item = {
            id: parseInt(itemId),
            item_name: document.getElementById('editItemName').value,
            brand: document.getElementById('editBrand').value,
            date_added: document.getElementById('editDateAdded').value,
            quantity: parseInt(document.getElementById('editQuantity').value)
        };

        fetch(`${API_BASE_URL}/users/${currentUser}/items/${itemId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(item),
        }).then(function(response) {
            return response.json();
        }).then(function() {
            closeEditModal();
            loadItems();
        }).catch(function(error) {
            console.error('Error updating item:', error);
            alert('Failed to update item');
        });
    });

    // Login form
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        var username = document.getElementById('loginUsername').value;
        var password = document.getElementById('loginPassword').value;
        
        api.login(username, password).then(function(user) {
            if (user.error) {
                alert('Login failed: ' + user.error);
            } else {
                currentUser = user.user_id;
                document.getElementById('userName').textContent = user.name;
                document.getElementById('logoutBtn').style.display = 'inline-block';
                closeLoginModal();
                loadItems(); // Reload items for the logged-in user
            }
        }).catch(function(error) {
            console.error('Error logging in:', error);
            alert('Login failed');
        });
    });

    // Register form
    document.getElementById('registerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        var user = {
            user_id: document.getElementById('registerUserId').value,
            name: document.getElementById('registerName').value,
            password: document.getElementById('registerPassword').value
        };
        
        api.createUser(user).then(function(response) {
            if (response.message) {
                alert('User registered successfully! You can now login.');
                closeRegisterModal();
                document.getElementById('registerForm').reset();
                // Auto-login after registration
                currentUser = user.user_id;
                document.getElementById('userName').textContent = user.name;
                document.getElementById('logoutBtn').style.display = 'inline-block';
                loadItems(); // Reload items for the new user
            } else {
                alert('Registration failed');
            }
        }).catch(function(error) {
            console.error('Error registering user:', error);
            alert('Registration failed');
        });
    });

    // Search input
    document.getElementById('searchInput').addEventListener('input', searchItems);
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', init);

// Attach UI functions to the window object
window.showLoginModal = showLoginModal;
window.showRegisterModal = showRegisterModal;
window.logout = logout;
window.prevPage = prevPage;
window.nextPage = nextPage;
window.editItem = editItem;
window.deleteItem = deleteItem;
window.closeEditModal = closeEditModal;
window.closeLoginModal = closeLoginModal;
window.closeRegisterModal = closeRegisterModal; 