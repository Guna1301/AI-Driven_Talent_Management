from bson import ObjectId

def project_factory(data):
    return {
        "name": data["name"],
        "domain": data["domain"],
        "budget": data["budget"],
        "deadline": data["deadline"],
        "teamSize": data["teamSize"],
        "description": data["description"],
        "status": data["status"],
        "priority": data.get("priority", "Medium"),
        "members": [
            {
                "id": None,  
                "name": m["name"],
                "role": m["role"]
            } for m in data.get("members", [])
        ]
    }
