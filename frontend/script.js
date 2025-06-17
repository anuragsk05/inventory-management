let items = [];
let currentPage = 1;
let itemsPerPage = 10;

// Load items from server
function loadItems() {
    fetch('http://localhost:8000/items/')
        .then(response => response.json())
        .then(data => {
            items = data;
            showItems();
        })
        .catch(error => {
            console.log('Error:', error);
        });
}

// Show items in table
function showItems() {
    const tbody = document.getElementById('inventoryTableBody');
    tbody.innerHTML = '';

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageItems = items.slice(startIndex, endIndex);

    for (let i = 0; i < pageItems.length; i++) {
        const item = pageItems[i];
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.item_name}</td>
            <td>${item.brand}</td>
            <td>${item.date_added}</td>
            <td>${item.quantity}</td>
            <td>
                <button onclick="editItem(${item.id})">Edit</button>
                <button onclick="deleteItem(${item.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    }

    updatePagination();
}

function updatePagination() {
    const totalPages = Math.ceil(items.length / itemsPerPage);
    document.getElementById('pageInfo').textContent = `Page ${currentPage} of ${totalPages}`;
    
    document.getElementById('prevBtn').disabled = currentPage === 1;
    document.getElementById('nextBtn').disabled = currentPage === totalPages;
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        showItems();
    }
}

function nextPage() {
    const totalPages = Math.ceil(items.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        showItems();
    }
}

// Search function
function searchItems() {
    var searchText = document.getElementById('searchInput').value.toLowerCase();
    
    if (searchText === '') {
        loadItems();
        return;
    }
    
    var filteredItems = [];
    
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.item_name.toLowerCase().indexOf(searchText) !== -1 || 
            item.brand.toLowerCase().indexOf(searchText) !== -1) {
            filteredItems.push(item);
        }
    }
    
    items = filteredItems;
    currentPage = 1;
    showItems();
}

// Add new item
document.getElementById('addItemForm').onsubmit = function(e) {
    e.preventDefault();
    
    var newItem = {
        id: Math.floor(Math.random() * 10000),
        item_name: document.getElementById('itemName').value,
        brand: document.getElementById('brand').value,
        date_added: document.getElementById('dateAdded').value,
        quantity: parseInt(document.getElementById('quantity').value)
    };
    
    fetch('http://localhost:8000/items/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem)
    })
    .then(function() {
        document.getElementById('addItemForm').reset();
        loadItems();
    });
};

// Edit item
function editItem(id) {
    fetch('http://localhost:8000/items/' + id)
        .then(function(response) {
            return response.json();
        })
        .then(function(item) {
            document.getElementById('editItemId').value = item.id;
            document.getElementById('editItemName').value = item.item_name;
            document.getElementById('editBrand').value = item.brand;
            document.getElementById('editDateAdded').value = item.date_added;
            document.getElementById('editQuantity').value = item.quantity;
            
            document.getElementById('editModal').style.display = 'block';
        });
}

// Close edit modal
function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
}

// Save edited item
document.getElementById('editForm').onsubmit = function(e) {
    e.preventDefault();
    
    var id = document.getElementById('editItemId').value;
    var updatedItem = {
        id: parseInt(id),
        item_name: document.getElementById('editItemName').value,
        brand: document.getElementById('editBrand').value,
        date_added: document.getElementById('editDateAdded').value,
        quantity: parseInt(document.getElementById('editQuantity').value)
    };
    
    fetch('http://localhost:8000/items/' + id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedItem)
    })
    .then(function() {
        closeEditModal();
        loadItems();
    });
};

// Delete item
function deleteItem(id) {
    if (confirm('Delete this item?')) {
        fetch('http://localhost:8000/items/' + id, {
            method: 'DELETE'
        })
        .then(function() {
            loadItems();
        });
    }
}

// Add search event listener
document.getElementById('searchInput').addEventListener('keyup', searchItems);

// Load items when page opens
loadItems(); 