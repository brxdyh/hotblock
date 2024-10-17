from flask import Flask, render_template, request, jsonify
import json
import os

app = Flask(__name__)

# loads existing markers from json file
def load_markers():
    if os.path.exists('map.geojson'):
        with open('map.geojson', 'r') as f:
            return json.load(f).get('features', [])
    return []

# saves updated markers to json file
def save_markers(markers):
    geojson_data = {
        "type": "FeatureCollection",
        "features": markers
    }
    with open('map.geojson', 'w') as f:
        json.dump(geojson_data, f, index=4)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/add_marker', methods=['POST'])
def add_marker():
    data = request.get_json()

    markers = load_markers()

    # adds new marker to the in-memory limit
    # can be saved in file or DB
    new_marker = {
        "type": "Feature",
        "properties": {
            "name": data['name'],
            "lastSeen": data['lastSeen']
        },
        "geometry": {
            "type": "Point",
            "coordinates": data['coordinates']
        }
    }
    markers.append(new_marker)

    save_markers(markers)

    return jsonify({"status": "success", "marker": new_marker}), 200

if __name__ == '__main__':
    app.run(debug=True)