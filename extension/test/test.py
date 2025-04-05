from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/api/histories', methods=['POST'])
def histories():
    data = request.get_json()

    print(data)

    response = {
        "status": 200,
        "message": "add history successful"
    }

    return jsonify(response)


@app.route('/api/bookmarks/default', methods=['POST'])
def bookmarks_default():
    data = request.get_json()

    print(data)

    response = {
        "status": 200,
        "message": "bookmark successful",
        "id": 123456790
    }
    return jsonify(response)


app.run(port=5000)