from flask import Flask, request, jsonify, send_from_directory
import os

app = Flask(__name__)

# Directory to store uploaded files (images)
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Enable the file upload extension
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# List to hold reported items (used in place of a database)
reported_items = []

@app.route('/')
def index():
    return "Welcome to the Lost & Found API!"

@app.route('/submit_item', methods=['POST'])
def submit_item():
    # Get form data
    item_name = request.form.get('itemName')
    item_description = request.form.get('itemDescription')
    item_type = request.form.get('itemType')
    claimed = 'claimed' in request.form
    item_image = request.files.get('itemImage')

    # Save the image if it's uploaded
    image_filename = None
    if item_image:
        image_filename = os.path.join(app.config['UPLOAD_FOLDER'], item_image.filename)
        item_image.save(image_filename)

    # Create a new item object to store the reported item
    new_item = {
        'name': item_name,
        'description': item_description,
        'type': item_type,
        'claimed': claimed,
        'image': image_filename
    }
    reported_items.append(new_item)

    return jsonify({"message": "Item reported successfully!", "item": new_item}), 200

@app.route('/items', methods=['GET'])
def get_items():
    # Return the list of reported items as a JSON response
    return jsonify({"items": reported_items}), 200

# Endpoint to serve uploaded images
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
    app.run(debug=True)
