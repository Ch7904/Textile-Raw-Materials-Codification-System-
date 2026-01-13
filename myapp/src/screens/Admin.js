import React, { useState, useEffect } from 'react';
import DisplayData from '../components/Display';
import Navbar from '../components/Navbar'
export default function AddProduct() {
  const [levels, setLevels] = useState({});
  const [existingLevels, setExistingLevels] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/get-all-levels") // This route needs to return existing LEVEL 1-10 values
      .then(res => res.json())
      .then(data => setExistingLevels(data.levels || []))
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    setLevels({ ...levels, [e.target.name]: e.target.value });
  };
  const authToken = localStorage.getItem("authToken");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/api/add-product", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`
      },
      body: JSON.stringify({ levels })
    });

    const json = await response.json();
    if (json.success) {
      setMessage("✅ Product added successfully!");
      setLevels({});
    } else {
      setMessage("❌ Failed to add product.");
    }
  };

  return (
    <>
    <div><Navbar/></div>
      <div className="container mt-4">
        <h2>Add New Product</h2>
        <form onSubmit={handleSubmit}>
          {[...Array(10)].map((_, i) => {
            const level = i + 1;
            return (
              <div className="row mb-2" key={level}>
                <div className="col-md-6">
                  <label>LEVEL {level}</label>
                  <input
                    type="text"
                    className="form-control"
                    name={`LEVEL ${level}`}
                    value={levels[`LEVEL ${level}`] || ""}
                    onChange={handleChange}
                    list={`level${level}-options`}
                    placeholder={`Enter or choose LEVEL ${level}`}
                  />
                  <datalist id={`level${level}-options`}>
                    {(existingLevels[level] || []).map((opt, idx) => (
                      <option key={idx} value={opt} />
                    ))}
                  </datalist>
                </div>
                <div className="col-md-6">
                  <label>{level}_Code</label>
                  <input
                    type="text"
                    className="form-control"
                    name={`${level}_Code`}
                    value={levels[`${level}_Code`] || ""}
                    onChange={handleChange}
                    placeholder={`Enter code for LEVEL ${level}`}
                  />
                </div>
              </div>
            );
          })}
          <button type="submit" className="btn btn-primary">Add Product</button>
        </form>
        {message && <div className="mt-3 alert alert-info">{message}</div>}
      </div>
      <DisplayData setLevels={setLevels} />
    </>
  );
}
