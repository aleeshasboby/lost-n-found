// Get references to form and item list
const form = document.getElementById('lostFoundForm');
const itemList = document.getElementById('itemList');

// Function to load items from localStorage
function loadItems() {
    try {
        // Get items from localStorage (if any)
        const items = JSON.parse(localStorage.getItem('items')) || [];

        // Clear the current list
        itemList.innerHTML = '';

        // Loop through items and display them
        items.forEach(item => {
            const li = document.createElement('li');
            li.classList.add(item.type === 'Found' ? 'found-item' : 'lost-item');  // Add different styling based on item type

            let itemContent = `
                <strong>${item.name}</strong> - ${item.description} (${item.type})
            `;
            
            if (item.claimed) {
                const claimedTag = document.createElement('span');
                claimedTag.textContent = ' - Claimed';
                claimedTag.style.color = 'black';
                li.appendChild(claimedTag);
            }

            // Display the image if present (if item has an image)
            if (item.image) {
                const img = document.createElement('img');
                img.src = item.image;
                img.alt = item.name;
                img.classList.add('item-image');
                li.appendChild(img);
            }

            // Optional: Add a delete button to remove the item
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('delete-button');
            deleteButton.addEventListener('click', () => deleteItem(item.name));
            li.appendChild(deleteButton);

            itemList.appendChild(li);
        });
    } catch (error) {
        console.error('Error loading items from localStorage:', error);
    }
}

// Function to delete an item
function deleteItem(itemName) {
    try {
        // Retrieve existing items from localStorage
        const items = JSON.parse(localStorage.getItem('items')) || [];
        
        // Filter out the deleted item
        const updatedItems = items.filter(item => item.name !== itemName);

        // Save the updated items list to localStorage
        localStorage.setItem('items', JSON.stringify(updatedItems));

        // Reload the items to update the display
        loadItems();
    } catch (error) {
        console.error('Error deleting item:', error);
    }
}

// Function to handle form submission
form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Get values from form fields
    const name = document.getElementById('itemName').value;
    const description = document.getElementById('itemDescription').value;
    const type = document.getElementById('itemType').value;
    const claimed = document.getElementById('claimed').checked;
    const imageInput = document.getElementById('itemImage').files[0]; // Get the uploaded file (if any)

    // Create an object for the new item
    const newItem = {
        name,
        description,
        type,
        claimed
    };

    // Handle image upload (if any)
    if (imageInput) {
        const reader = new FileReader();
        reader.onloadend = function() {
            newItem.image = reader.result; // Store the base64 string of the image
            saveItem(newItem); // Save the item after image is loaded
        };
        reader.readAsDataURL(imageInput); // Convert image to base64
    } else {
        saveItem(newItem); // Save without image if none was uploaded
    }
});

// Save item to localStorage and update the list
function saveItem(item) {
    try {
        // Retrieve existing items from localStorage
        const items = JSON.parse(localStorage.getItem('items')) || [];

        // Add the new item to the list
        items.push(item);

        // Save the updated items list to localStorage
        localStorage.setItem('items', JSON.stringify(items));

        // Clear the form fields
        form.reset();

        // Reload the items to update the display
        loadItems();
    } catch (error) {
        console.error('Error saving item to localStorage:', error);
    }
}

// Initial load of items
loadItems();
