from flask import Blueprint, request, jsonify
import requests
from .. import db
from flask import current_app as app
import os
import re

chat_bp = Blueprint("chat", __name__)

def extract_keywords(message):
    trigger_words = ['allocate', 'project', 'role', 'skills', 'number', 'details']
    return [word for word in trigger_words if word in message.lower()]

def parse_allocation_request(message):
    pattern = r'allocate\s+(\d+)\s+([a-zA-Z\s/]+?)\s+to\s+(.+)'
    match = re.search(pattern, message, re.IGNORECASE)
    if match:
        count = int(match.group(1))
        role = match.group(2).strip()
        project = match.group(3).strip()
        return count, role, project
    return 1, None, None  

@chat_bp.route("/chat-message", methods=["POST"])
def chat_message():
    data = request.get_json()
    user_message = data.get("message", "")

    keywords = extract_keywords(user_message)
    app.logger.info(f"Extracted keywords: {keywords}")

    count, role, project_name = parse_allocation_request(user_message)
    allocation_payload = {
        "message": user_message,
        "count": count,
        "role": role,
        "project_name": project_name
    }

    allocate_url = "http://127.0.0.1:5000/assign"
    try:
        allocation_res = requests.post(allocate_url, json=allocation_payload)
        allocation_data = allocation_res.json()
        allocation_result = allocation_data.get("result", allocation_data.get("error", "No allocation found."))
    except Exception as e:
        allocation_result = f"Error calling allocation service: {str(e)}"

    final_message = call_gemini_api(user_message, allocation_result, count)

    return jsonify({"message": final_message})

def call_gemini_api(user_message, allocation_result, count):
    gemini_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
    api_key = os.getenv("GEMINI_API_KEY") 

    if not api_key:
        app.logger.error("Gemini API key is missing!")
        return allocation_result

    prompt = (
        f"User message: '{user_message}'\n"
        f"Allocation result: '{allocation_result}'\n"
        f"Assigned quantity: {count}\n\n"
        "Write a friendly, human-readable response summarizing this information."
    )

    payload = {
        "prompt": prompt,
        "max_tokens": 150
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
        return text if text else allocation_result
    except Exception as e:
        app.logger.error(f"Gemini API error: {str(e)}")
        return allocation_result
