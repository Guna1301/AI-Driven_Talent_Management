from flask import Blueprint, request, jsonify
from .. import db
from app.models.project_model import project_factory
from bson import ObjectId

project_bp = Blueprint("projects", __name__)

@project_bp.route("/", methods=["GET"])
def get_projects():
    print("Fetching all projects")
    projects = list(db.projects.find())
    print(projects)
    for proj in projects:
        proj["_id"] = str(proj["_id"])
        for member in proj.get("members", []):
            member["id"] = str(member["id"])
    return jsonify(projects), 200

@project_bp.route("/<project_id>", methods=["GET"])
def get_project(project_id):
    proj = db.projects.find_one({"_id": ObjectId(project_id)})
    if not proj:
        return jsonify({"error": "Project not found"}), 404
    proj["_id"] = str(proj["_id"])
    for member in proj.get("members", []):
        member["id"] = str(member["id"])
    return jsonify(proj), 200

@project_bp.route("/", methods=["POST"])
def create_project():
    data = request.json
    project_doc = project_factory(data)
    db.projects.insert_one(project_doc)
    project_doc["_id"] = str(project_doc["_id"])
    for member in project_doc.get("members", []):
        member["id"] = str(member["id"])
    return jsonify(project_doc), 201

@project_bp.route("/<project_id>", methods=["PUT"])
def update_project(project_id):
    data = request.json
    db.projects.update_one({"_id": ObjectId(project_id)}, {"$set": data})
    updated_proj = db.projects.find_one({"_id": ObjectId(project_id)})
    updated_proj["_id"] = str(updated_proj["_id"])
    return jsonify(updated_proj), 200

@project_bp.route("/<project_id>", methods=["DELETE"])
def delete_project(project_id):
    db.projects.delete_one({"_id": ObjectId(project_id)})
    return jsonify({"message": "Project deleted"}), 200


@project_bp.route("/project-upload", methods=["POST"])
def upload_project_file():
   
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    filename = file.filename.lower()
    print("Uploaded file:", file)
    projects_to_insert = []

    try:
        if filename.endswith(".csv"):
            df = pd.read_csv(file)
            for _, row in df.iterrows():
                project_data = row.to_dict()
                if "members" in project_data and isinstance(project_data["members"], str):
                    project_data["members"] = json.loads(project_data["members"])
                projects_to_insert.append(project_factory(project_data))

        elif filename.endswith((".xls", ".xlsx")):
            df = pd.read_excel(file)
            for _, row in df.iterrows():
                project_data = row.to_dict()
                if "members" in project_data and isinstance(project_data["members"], str):
                    project_data["members"] = json.loads(project_data["members"])
                projects_to_insert.append(project_factory(project_data))

        elif filename.endswith(".pdf"):
            with pdfplumber.open(file) as pdf:
                for page in pdf.pages:
                    text = page.extract_text()
                    for line in text.split("\n"):
                        try:
                            data = json.loads(line)
                            projects_to_insert.append(project_factory(data))
                        except json.JSONDecodeError:
                            continue
        else:
            return jsonify({"error": "Unsupported file type"}), 400

        if projects_to_insert:
            result = db.projects.insert_many(projects_to_insert)
            inserted_ids = [str(_id) for _id in result.inserted_ids]
            return jsonify({"message": "Projects uploaded successfully", "inserted_ids": inserted_ids}), 201
        else:
            return jsonify({"error": "No valid projects found in the file"}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500
