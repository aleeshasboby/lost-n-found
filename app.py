from flask import Flask, render_template, request, jsonify
import os

app = Flask(__name__)

# Path for image uploads
UPLOAD_FOLDER = 'static/uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# List to store items
lost_items = []
found_items = []

# Function to check file extensions
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Route to show the home page
@app.route('/')
def index():
    return render_template('index.html')

# Route to post an item (lost or found)
@app.route('/post', methods=['GET', 'POST'])
def post_item():
    if request.method == 'POST':
        item_type = request.form['itemType']
        item_description = request.form['itemDescription']
        contact_info = request.form['contactInfo']
        item_image = request.files['itemImage']

        if item_image and allowed_file(item_image.filename):
            filename = item_image.filename
            item_image.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        else:
            filename = None

        item = {
            'description': item_description,
            'contact_info': contact_info,
            'image': filename
        }

        if item_type == 'lost':
            lost_items.append(item)
        else:
            found_items.append(item)

        return jsonify({"message": "Item posted successfully!"})

    return render_template('post_item.html')

# Route to display lost items
@app.route('/lost')
def lost():
    return render_template('items_list.html', title='Lost Items', items=lost_items)

# Route to display found items
@app.route('/found')
def found():
    return render_template('items_list.html', title='Found Items', items=found_items)

if __name__ == '__main__':
    app.run(debug=True)
