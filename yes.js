const lostFoundForm = document.getElementById('lostFoundForm');
const itemList = document.getElementById('itemList');

// Add event listener for form submission
lostFoundForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form from refreshing page

    const itemName = document.getElementById('itemName').value;
    const itemDescription = document.getElementById('itemDescription').value;
    const itemType = document.getElementById('itemType').value;
    const isClaimed = document.getElementById('claimed').checked;
    const itemImage = document.getElementById('itemImage').files[0]; // Get the uploaded file

    // Create the new item HTML
    const newItem = document.createElement('li');
    newItem.classList.add(itemType === 'Lost' ? 'lost-item' : 'found-item');

    // Display uploaded image (if any)
    let itemImageHTML = '';
    if (itemImage) {
        const imageURL = URL.createObjectURL(itemImage);
        itemImageHTML = `<img src="${imageURL}" alt="${itemName}" class="item-image">`;
    }

    // Add content to the new item
    if (itemType === 'Found' && isClaimed) {
        newItem.classList.add('claimed');
        newItem.innerHTML = `
            <strong>${itemName}</strong> (Claimed)<br>
            ${itemDescription}<br>
            <em>Type: ${itemType}</em><br>
            <strong>Notification:</strong> This item has been claimed!<br>
            ${itemImageHTML}
        `;
    } else {
        newItem.innerHTML = `
            <strong>${itemName}</strong><br>
            ${itemDescription}<br>
            <em>Type: ${itemType}</em><br>
            ${itemImageHTML}
        `;
    }

    // Append the new item to the list
    itemList.appendChild(newItem);

    // Clear the form fields after submission
    document.getElementById('itemName').value = '';
    document.getElementById('itemDescription').value = '';
    document.getElementById('claimed').checked = false; // Uncheck the claimed checkbox
    document.getElementById('itemImage').value = ''; // Reset the image input
});
