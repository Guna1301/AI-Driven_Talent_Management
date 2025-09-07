import re
from flask import Blueprint, request, jsonify, current_app as app
from bson import ObjectId
from .. import db
import requests



allocation_bp = Blueprint("allocate", __name__)

gemini_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
api_key = "AIzaSyBEqNJKPPDh0Tbcjtf4gXD02nWQ_KpK_6I"

def calculate_score(resource, job_description):
    resource_info = f"Name: {resource['name']}\nRole: {resource['role']}\nSkills: {', '.join(resource.get('skills', []))}\nExperience: {resource.get('experience', 0)} years"
    prompt = f"Evaluate how well this resource fits the job description.\n\nResource:\n{resource_info}\n\nJob Description:\n{job_description}\n\nOn a scale from 0 to 100, how suitable is this resource for the job?"

    payload = {
        "prompt": prompt,
        "max_tokens": 10  
    }
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    try:
        response = requests.post(gemini_url, json=payload, headers=headers)
        response.raise_for_status()
        response_data = response.json()
        text = response_data.get("candidates", [{}])[0].get("content", "").strip()
        
        import re
        match = re.search(r'\d+', text)
        if match:
            score = int(match.group())
            return score
        else:
            app.logger.warning(f"Unable to parse score from Gemini response: {text}")
            return 0  
    except Exception as e:
        app.logger.error(f"Gemini API error: {str(e)}")
        fallback_score = 0
        job_text = job_description.lower()
        for skill in resource.get("skills", []):
            if skill.lower() in job_text:
                fallback_score += 10
        role = resource.get("role", "").lower()
        if role and role in job_text:
            fallback_score += 5
        experience = resource.get("experience", 0)
        fallback_score += min(experience, 5)
        return fallback_score


@allocation_bp.route("/assign", methods=["POST"])
def assign_resource():
    data = request.json
    project_id = data.get("project_id")
    message = data.get("message", "")
    quantity = data.get("quantity", 1) 
    role_filter = data.get("role", None)  

    if project_id:
        project = db.projects.find_one({"_id": ObjectId(project_id)})
        if not project:
            return jsonify({"error": "Project not found"}), 404
        job_description = project.get("job_description", "")
        project_name = project.get("name", "the project")
    else:
        job_description = message
        project_name = "the project"

    candidates = list(db.resources.find({"allocated": False}))
    if role_filter:
        candidates = [r for r in candidates if r["role"].lower() == role_filter.lower()]

    if not candidates:
        return jsonify({"error": "No available resources"}), 400

    scored_resources = []
    for resource in candidates:
        score = calculate_score(resource, job_description)
        scored_resources.append((resource, score))

    scored_resources.sort(key=lambda x: x[1], reverse=True)

    selected_resources = [res for res, score in scored_resources[:quantity] if score > 0]

    if not selected_resources:
        return jsonify({"error": "No suitable resources found"}), 400

    assigned_names = []
    for res in selected_resources:
        db.resources.update_one(
            {"_id": res["_id"]},
            {"$set": {
                "allocated": True,
                "project": {"id": str(project["_id"]) if project_id else None, "name": project_name}
            }}
        )
        if project_id:
            db.projects.update_one(
                {"_id": project["_id"]},
                {"$push": {"members": {
                    "id": str(res["_id"]),
                    "name": res["name"],
                    "role": res["role"]
                }}}
            )
        assigned_names.append(res["name"])

    return jsonify({
        "result": f"{', '.join(assigned_names)} assigned to {project_name}",
        "count": len(assigned_names)
    }), 200


@allocation_bp.route("/reassign", methods=["POST"])
def reassign_resource():
    data = request.json
    project_id = data.get("project_id")

    project = db.projects.find_one({"_id": ObjectId(project_id)})
    if not project:
        return jsonify({"error": "Project not found"}), 404

    job_description = project.get("job_description", "")

    candidates = list(db.resources.find({
        "$or": [
            {"allocated": False},
            {"allocated": True, "project.id": {"$ne": project["_id"]}}
        ]
    }))
    if not candidates:
        return jsonify({"error": "No available resources"}), 400

    scored_resources = []
    for resource in candidates:
        score = calculate_score(resource, job_description)
        scored_resources.append((resource, score))

    scored_resources.sort(key=lambda x: x[1], reverse=True)

    best_resource, best_score = scored_resources[0]
    if best_score == 0:
        return jsonify({"error": "No suitable resource found"}), 400

    old_project_id = best_resource.get("project", {}).get("id")
    if old_project_id:
        db.projects.update_one(
            {"_id": ObjectId(old_project_id)},
            {"$pull": {"members": {"id": best_resource["_id"]}}}
        )

    db.resources.update_one(
        {"_id": best_resource["_id"]},
        {"$set": {"allocated": True, "project": {"id": project["_id"], "name": project["name"]}}}
    )
    db.projects.update_one(
        {"_id": project["_id"]},
        {"$push": {"members": {"id": best_resource["_id"], "name": best_resource["name"], "role": best_resource["role"]}}}
    )

    return jsonify({
        "message": f"{best_resource['name']} reassigned to {project['name']}",
        "score": best_score
    }), 200
