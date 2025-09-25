from flask import Flask, request, jsonify
import joblib
import numpy as np
from flask_cors import CORS

app = Flask(__name__)

CORS(app)

# Load trained model and scaler
model = joblib.load("model/diabetes_rf_model.pkl")
scaler = joblib.load("model/scaler.pkl")

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Diabetes Prediction API is running!"})

@app.route("/predict", methods=["POST"])
def predict():
    try:
        # JSON input: {"features": [preg, glucose, bp, skin, insulin, bmi, dpf, age]}
        data = request.get_json()
        features = np.array(data["features"]).reshape(1, -1)

        # Scale input
        features_scaled = scaler.transform(features)

        # Prediction
        prediction = int(model.predict(features_scaled)[0])
        probability = float(model.predict_proba(features_scaled)[:,1][0])

        return jsonify({
            "prediction": prediction,   # 0 = No diabetes, 1 = Diabetes
            "probability": probability
        })

    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == "__main__":
    app.run(debug=True, port=9896)
