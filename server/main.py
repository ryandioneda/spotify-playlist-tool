from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__) #create app instance
cors = CORS(app, origins='*')


@app.route("/api/users", methods=['GET'])
def users():
    return jsonify(
        {
            "users": [
                'hello',
                'flynn',
                'tron',
            ]
        }
    )

if __name__ == "__main__":
    app.run(debug=True, port=8000)