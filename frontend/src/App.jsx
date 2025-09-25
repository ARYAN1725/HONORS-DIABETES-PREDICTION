import { useState } from "react";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    preg: "",
    glucose: "",
    bp: "",
    skin: "",
    insulin: "",
    bmi: "",
    dpf: "",
    age: "",
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const features = Object.values(formData).map(Number);

    try {
      const response = await fetch("http://127.0.0.1:9896/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ features }),
      });

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="app-container">
      <div className="card">
        <h1 className="title">Diabetes Prediction</h1>
        <form className="form" onSubmit={handleSubmit}>
          <input
            type="number"
            name="preg"
            placeholder="Pregnancies (count)"
            value={formData.preg}
            onChange={handleChange}
          />
          <input
            type="number"
            name="glucose"
            placeholder="Glucose (mg/dL)"
            value={formData.glucose}
            onChange={handleChange}
          />
          <input
            type="number"
            name="bp"
            placeholder="Blood Pressure (mm Hg)"
            value={formData.bp}
            onChange={handleChange}
          />
          <input
            type="number"
            name="skin"
            placeholder="Skin Thickness (mm)"
            value={formData.skin}
            onChange={handleChange}
          />
          <input
            type="number"
            name="insulin"
            placeholder="Insulin (µU/mL)"
            value={formData.insulin}
            onChange={handleChange}
          />
          <input
            type="number"
            step="0.1"
            name="bmi"
            placeholder="BMI (kg/m²)"
            value={formData.bmi}
            onChange={handleChange}
          />
          <input
            type="number"
            step="0.01"
            name="dpf"
            placeholder="Diabetes Pedigree Function (index)"
            value={formData.dpf}
            onChange={handleChange}
          />
          <input
            type="number"
            name="age"
            placeholder="Age (years)"
            value={formData.age}
            onChange={handleChange}
          />

          <button type="submit" className="btn">Predict</button>
        </form>

        {result && (
          <div className="result">
            <h2>Result</h2>
            <p>
              Prediction:{" "}
              <span className={result.prediction === 1 ? "positive" : "negative"}>
                {result.prediction === 1 ? "Diabetes" : "No Diabetes"}
              </span>
            </p>
            <p>Probability: {result.probability.toFixed(2)}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
