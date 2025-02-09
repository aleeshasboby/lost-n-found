from flask import Flask, request, jsonify
import os

app = Flask(__name__)

# Directory to store uploaded images
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Enable the file upload extension
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# List to store the reported items (in place of a database for simplicity)
items = []

@app.route('/')
def index():
    return "Welcome to the Lost and Found API!"

# Route to handle the form submission
@app.route('/submit_item', methods=['POST'])
def submit_item():
    item_name = request.form.get('itemName')
    item_description = request.form.get('itemDescription')
    item_type = request.form.get('itemType')
    claimed = 'claimed' in request.form
    image = request.files.get('itemImage')

    # Save the image if it exists
    image_filename = None
    if image:
        image_filename = os.path.join(app.config['UPLOAD_FOLDER'], image.filename)
        image.save(image_filename)

    # Create a new item object
    new_item = {
        'name': item_name,
        'description': item_description,
        'type': item_type,
        'claimed': claimed,
        'image': image_filename
    }
    items.append(new_item)

    return jsonify({"message": "Item reported successfully!", "item": new_item}), 200

# Route to get all reported items
@app.route('/items', methods=['GET'])
def get_items():
    return jsonify({"items": items}), 200

if __name__ == '__main__':
    app.run(debug=True)
