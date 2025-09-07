import sys
import os

# Add project root to sys.path so 'app' package is found
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app
from app.models.project_model import project_factory
from app.models.resource_model import resource_factory
from seed.dummy_data import dummyProjects, dummyResources

app = create_app()

with app.app_context():
    from app import db 

    db.projects.delete_many({})
    db.resources.delete_many({})

    for proj in dummyProjects:
        db.projects.insert_one(project_factory(proj))

    for res in dummyResources:
        db.resources.insert_one(resource_factory(res))

print("Dummy data inserted successfully!")
