from flask import Blueprint, request, jsonify
from app import db
from app.models.resource_model import resource_factory
from bson import ObjectId
import PyPDF2

resource_bp = Blueprint("resources", __name__)

@resource_bp.route("/", methods=["GET"])
def get_resources():
    resources = list(db.resources.find())
    for res in resources:
        res["_id"] = str(res["_id"])
        if res.get("project") and res["project"].get("id"):
            res["project"]["id"] = str(res["project"]["id"])
    return jsonify(resources), 200

@resource_bp.route("/<resource_id>", methods=["GET"])
def get_resource(resource_id):
    res = db.resources.find_one({"_id": ObjectId(resource_id)})
    if not res:
        return jsonify({"error": "Resource not found"}), 404
    res["_id"] = str(res["_id"])
    if res.get("project") and res["project"].get("id"):
        res["project"]["id"] = str(res["project"]["id"])
    return jsonify(res), 200

@resource_bp.route("/", methods=["POST"])
def create_resource():
    data = request.json
    resource_doc = resource_factory(data)
    db.resources.insert_one(resource_doc)
    resource_doc["_id"] = str(resource_doc["_id"])
    if resource_doc.get("project") and resource_doc["project"].get("id"):
        resource_doc["project"]["id"] = str(resource_doc["project"]["id"])
    return jsonify(resource_doc), 201

@resource_bp.route("/<resource_id>", methods=["PUT"])
def update_resource(resource_id):
    data = request.json
    db.resources.update_one({"_id": ObjectId(resource_id)}, {"$set": data})
    updated_res = db.resources.find_one({"_id": ObjectId(resource_id)})
    updated_res["_id"] = str(updated_res["_id"])
    if updated_res.get("project") and updated_res["project"].get("id"):
        updated_res["project"]["id"] = str(updated_res["project"]["id"])
    return jsonify(updated_res), 200

@resource_bp.route("/<resource_id>", methods=["DELETE"])
def delete_resource(resource_id):
    db.resources.delete_one({"_id": ObjectId(resource_id)})
    return jsonify({"message": "Resource deleted"}), 200

@resource_bp.route("/upload", methods=["POST"])
def upload_resources():
    print("Uploading resources")
    print(request.files)

    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400
    
    file = request.files['file']
    filename = file.filename.lower()

    resources_list = []

    try:
        if filename.endswith(".csv"):
            df = pd.read_csv(file)
            for _, row in df.iterrows():
                exp_val = row.get("experience", 0)
                experience = int(exp_val) if str(exp_val).isdigit() else 0
                allocated = str(row.get("allocated", "False")).lower() in ["true", "1", "yes"]

                resources_list.append({
                    "id": str(row.get("id", "")) or None,
                    "name": row.get("name", ""),
                    "role": row.get("role", ""),
                    "experience": experience,
                    "allocated": allocated,
                    "project": {"id": str(row.get("project_id", "")), "name": row.get("project_name", "")} if row.get("project_id") else None
                })

        elif filename.endswith((".xls", ".xlsx")):
            df = pd.read_excel(file)
            for _, row in df.iterrows():
                exp_val = row.get("experience", 0)
                experience = int(exp_val) if str(exp_val).isdigit() else 0
                allocated = str(row.get("allocated", "False")).lower() in ["true", "1", "yes"]

                resources_list.append({
                    "id": str(row.get("id", "")) or None,
                    "name": row.get("name", ""),
                    "role": row.get("role", ""),
                    "experience": experience,
                    "allocated": allocated,
                    "project": {"id": str(row.get("project_id", "")), "name": row.get("project_name", "")} if row.get("project_id") else None
                })

        elif filename.endswith(".pdf"):
            pdf_reader = PyPDF2.PdfReader(file)
            text_data = ""
            for page in pdf_reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text_data += page_text + "\n"

            lines = text_data.strip().split("\n")
            for line in lines:
                if not line.strip() or "name" in line.lower():
                    continue
                if "," in line:
                    parts = [p.strip() for p in line.split(",")]
                elif "\t" in line:
                    parts = [p.strip() for p in line.split("\t")]
                else:
                    parts = line.split()

                try:
                    experience = int(parts[3]) if len(parts) > 3 and parts[3].isdigit() else 0
                    allocated = parts[4].lower() in ["true", "1", "yes"] if len(parts) > 4 else False
                    project = {"id": parts[5], "name": parts[6]} if len(parts) > 6 else None

                    resources_list.append({
                        "id": parts[0] if len(parts) > 0 else None,
                        "name": parts[1] if len(parts) > 1 else "",
                        "role": parts[2] if len(parts) > 2 else "",
                        "experience": experience,
                        "allocated": allocated,
                        "project": project
                    })
                except Exception as e:
                    print(f"Skipping line due to error: {line}, error: {e}")

        else:
            return jsonify({"error": "Unsupported file type"}), 400

        for res in resources_list:
            if res.get("id"):
                existing = db.resources.find_one({"_id": res["id"]})
                if existing:
                    db.resources.update_one({"_id": res["id"]}, {"$set": resource_factory(res)})
                else:
                    res_doc = resource_factory(res)
                    res_doc["_id"] = res["id"]
                    db.resources.insert_one(res_doc)
            else:
                db.resources.insert_one(resource_factory(res))

        print(resources_list)
        return jsonify({"message": f"{len(resources_list)} resources uploaded successfully!"}), 200

    except Exception as e:
        print("Error uploading resources:", e)
        return jsonify({"error": str(e)}), 500
