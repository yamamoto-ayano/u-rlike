from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/api/histories', methods=['POST'])
def nya():
    data = request.get_json()

    print(data)

    response = {
        status: 200,
        message: "add history successful"
    }

    return jsonify(response)


app.run(port=5000)