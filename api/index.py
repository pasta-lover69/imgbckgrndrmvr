from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from rembg import remove
from PIL import Image
import io

app = Flask(__name__)
CORS(app)

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "webp", "bmp"}


def allowed_file(filename: str) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route("/api/remove-bg", methods=["POST"])
def remove_background():
    if "image" not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    file = request.files["image"]

    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    if not allowed_file(file.filename):
        return jsonify({"error": f"Invalid file type. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"}), 400

    file_bytes = file.read()

    if len(file_bytes) > MAX_FILE_SIZE:
        return jsonify({"error": "File too large. Maximum size is 10MB"}), 400

    try:
        input_image = Image.open(io.BytesIO(file_bytes))

        output_bytes = remove(
            file_bytes,
            alpha_matting=True,
            alpha_matting_foreground_threshold=240,
            alpha_matting_background_threshold=10,
            alpha_matting_erode_size=10,
        )

        return send_file(
            io.BytesIO(output_bytes),
            mimetype="image/png",
            as_attachment=True,
            download_name="removed_bg.png",
        )

    except Exception as e:
        return jsonify({"error": f"Processing failed: {str(e)}"}), 500


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})
