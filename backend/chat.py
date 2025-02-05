import os

# Set the TEAM_API_KEY using os.environ
os.environ["TEAM_API_KEY"] = "7e203dc23f1fb47b14abac3918c5ca382238f27e793342818046f3428066dc42"

from flask import Flask, request, jsonify
from aixplain.factories import ModelFactory
from flask_cors import CORS




app = Flask(__name__)
CORS(app, resources={r"/chatbot": {"origins": "http://localhost:3000"}})


# Instantiate the model directly
model = ModelFactory.get("640b517694bf816d35a59125")

@app.route('/chatbot', methods=['POST'])
def chatbot():
    user_input = request.json.get("message")
    
    # Get response from the model
    response = model.run({
        'text': user_input,
        'temperature': 0.7,
        'max_tokens': 150
    })
    
    return jsonify({"response": response['data']})

if __name__ == '__main__':
    app.run(debug=True,port=5001)