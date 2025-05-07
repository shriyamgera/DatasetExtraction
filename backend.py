import base64
from flask import Flask, request, jsonify
import os
from main import process_file

app = Flask(__name__)
UPLOAD_FOLDER = 'uploads'
OUTPUT_FOLDER = 'outputs'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

@app.route('/upload_base64', methods=['POST'])
def upload_base64():
    try:
        data = request.get_json()
        if not data or 'filename' not in data or 'data' not in data:
            return jsonify({'error': 'Missing filename or data'}), 400

        # Decode base64 and save to uploads
        file_data = base64.b64decode(data['data'])
        filename = data['filename']
        input_path = os.path.join(UPLOAD_FOLDER, filename)

        with open(input_path, 'wb') as f:
            f.write(file_data)

        # Process the file
        csv_files = process_file(input_path)
        print("csv_files", csv_files)

        # Convert output CSVs to base64
        base64_outputs = []
        for path in csv_files:
            if path == None:
                continue
            print("path", path)
            with open(path, 'rb') as f:
                encoded = base64.b64encode(f.read()).decode('utf-8')
                base64_outputs.append({
                    'filename': os.path.basename(path),
                    'data': encoded
                })

        return jsonify({
            'message': 'File processed successfully',
            'outputs': base64_outputs
        })

    except Exception as e:
        # Optional: Log full traceback for debugging
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    print(" Flask server is running at: http://127.0.0.1:5000")
    app.run(debug=True)
