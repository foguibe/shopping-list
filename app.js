const form = document.getElementById('shopping-form');
const itemInput = document.getElementById('item-input');
const categorySelect = document.getElementById('category-select');
const searchInput = document.getElementById('search-input');
const shoppingList = document.getElementById('shopping-list');
const filterCategory = document.getElementById('filter-category');
const filterDateFrom = document.getElementById('filter-date-from');
const filterDateTo = document.getElementById('filter-date-to');
const paginationControls = document.getElementById('pagination-controls');

const itemsPerPage = 5;
let currentPage = 1;

document.addEventListener('DOMContentLoaded', loadItems);

form.addEventListener('submit', addItem);

function loadItems() {
    const items = getItemsFromStorage();
    renderPagination(items);
    displayPage(items, currentPage);
}

function addItem(e) {
    e.preventDefault();
    
    const newItem = itemInput.value.trim();
    const category = categorySelect.value;
    const dateAdded = new Date().toLocaleString();

    if (newItem === '') {
        alert('Please add an item');
        return;
    }

    const itemData = {
        name: newItem,
        category: category,
        date: dateAdded // Store both date and time
    };

    const items = getItemsFromStorage();
    items.push(itemData);
    localStorage.setItem('shoppingList', JSON.stringify(items));

    renderPagination(items);
    displayPage(items, currentPage);
    itemInput.value = '';
}


function addItemToDOM(itemData, index) {
    const row = document.createElement('tr');

    const noCell = document.createElement('td');
    noCell.textContent = index;
    row.appendChild(noCell);

    const itemCell = document.createElement('td');
    itemCell.textContent = itemData.name;
    row.appendChild(itemCell);

    const categoryCell = document.createElement('td');
    categoryCell.textContent = itemData.category;
    row.appendChild(categoryCell);

    const dateCell = document.createElement('td');
    dateCell.textContent = itemData.date;
    row.appendChild(dateCell);

    const actionsCell = document.createElement('td');

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.classList.add('edit');
    editBtn.addEventListener('click', () => editItem(itemData, row, index));
    actionsCell.appendChild(editBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete');
    deleteBtn.addEventListener('click', () => deleteItem(row, itemData.name));
    actionsCell.appendChild(deleteBtn);

    row.appendChild(actionsCell);
    shoppingList.appendChild(row);
}

function editItem(itemData, row, index) {
    const updatedItem = prompt('Update the item:', itemData.name);
    const updatedCategory = prompt('Update the category:', itemData.category);

    if (updatedItem !== null && updatedItem.trim() !== '' && updatedCategory !== null && updatedCategory.trim() !== '') {
        const items = getItemsFromStorage();
        items[index - 1].name = updatedItem;
        items[index - 1].category = updatedCategory;
        localStorage.setItem('shoppingList', JSON.stringify(items));

        row.children[1].textContent = updatedItem;
        row.children[2].textContent = updatedCategory;
    }
}

function deleteItem(row, itemName) {
    if (confirm('Are you sure you want to delete this item?')) {
        row.remove();
        removeItemFromStorage(itemName);
    }
}

function removeItemFromStorage(itemName) {
    let items = getItemsFromStorage();
    items = items.filter(item => item.name !== itemName);
    localStorage.setItem('shoppingList', JSON.stringify(items));

    renderPagination(items);
    displayPage(items, currentPage);
}

function getItemsFromStorage() {
    let items;
    if (localStorage.getItem('shoppingList') === null) {
        items = [];
    } else {
        items = JSON.parse(localStorage.getItem('shoppingList'));
    }
    return items;
}

function searchItems() {
    const searchText = searchInput.value.toLowerCase();
    const items = getItemsFromStorage();

    const filteredItems = items.filter(item => item.name.toLowerCase().includes(searchText));
    renderPagination(filteredItems);
    displayPage(filteredItems, currentPage);
}

function filterItems() {
    const selectedCategory = filterCategory.value;
    const dateFrom = filterDateFrom.value;
    const dateTo = filterDateTo.value;

    const items = getItemsFromStorage();
    
    let filteredItems = items;

    if (selectedCategory !== 'all') {
        filteredItems = filteredItems.filter(item => item.category === selectedCategory);
    }

    if (dateFrom) {
        filteredItems = filteredItems.filter(item => new Date(item.date) >= new Date(dateFrom));
    }

    if (dateTo) {
        filteredItems = filteredItems.filter(item => new Date(item.date) <= new Date(dateTo));
    }

    renderPagination(filteredItems);
    displayPage(filteredItems, currentPage);
}

function renderPagination(items) {
    paginationControls.innerHTML = '';
    const pageCount = Math.ceil(items.length / itemsPerPage);

    for (let i = 1; i <= pageCount; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.classList.add('pagination-button');
        button.addEventListener('click', () => changePage(i, items));
        paginationControls.appendChild(button);
    }
}

function changePage(pageNumber, items) {
    currentPage = pageNumber;
    displayPage(items, currentPage);
}

function displayPage(items, page) {
    shoppingList.innerHTML = '';

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = page * itemsPerPage;
    const itemsToDisplay = items.slice(startIndex, endIndex);

    itemsToDisplay.forEach((item, index) => addItemToDOM(item, startIndex + index + 1));
}
