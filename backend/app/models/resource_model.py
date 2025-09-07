from bson import ObjectId

def resource_factory(data):
    return {
        "name": data["name"],
        "role": data["role"],
        "experience": data.get("experience", 0),
        "skills": data.get("skills", []),
        "allocated": data.get("allocated", False),
        "project": data.get("project", None),
        "customId": data.get("id")  
    }
