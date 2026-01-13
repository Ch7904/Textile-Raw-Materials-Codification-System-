import React, { useState, useEffect } from 'react';
import DisplayData from './Display';

export default function Codification() {
  const [levels, setLevels] = useState({
    level1: "", level2: "", level3: "", level4: "", level5: "",
    level6: "", level7: "", level8: "", level9: ""
  });
  const [existingLevels, setExistingLevels] = useState({});
  const [resultCode, setResultCode] = useState("");
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [searchField, setSearchField] = useState("LEVEL 1");
  const [matchType, setMatchType] = useState("exact");

  useEffect(() => {
    fetch("http://localhost:5000/api/get-all-levels")
      .then(res => res.json())
      .then(data => setExistingLevels(data.levels || {}))
      .catch(err => console.error("Error fetching levels:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const levelArray = Object.values(levels).map(level =>
      level.trim() === "" ? "NA" : level
    );

    const response = await fetch("http://localhost:5000/api/generate-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ levels: levelArray })
    });

    const json = await response.json();
    if (json.success) {
      setResultCode(json.code);
      setError("");
    } else {
      setResultCode("");
      setError(json.message || "Failed to generate code");
    }
  };

  const handleSearch = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          field: searchField,
          value: searchTerm,
          matchType
        })
      });

      const data = await res.json();
      if (data.success) {
        setSearchResult(data.result);
        setError("");
      } else {
        setSearchResult(null);
        setError(data.message || "No matching data found");
      }
    } catch (err) {
      setError("Error while searching");
      setSearchResult(null);
    }
  };

  const onChange = (e) => {
    setLevels({ ...levels, [e.target.name]: e.target.value });
  };

  return (
    <>
      <div className='container'>
        <h2 className='my-4'>Generate Material Code</h2>
        <form onSubmit={handleSubmit}>
          {Array.from({ length: 9 }).map((_, idx) => {
            const levelKey = `level${idx + 1}`;
            const datalistId = `level${idx + 1}-options`;

            return (
              <div className="form-group mb-3" key={idx}>
                <label htmlFor={levelKey}>Level {idx + 1}</label>
                <input
                  type="text"
                  className="form-control"
                  id={levelKey}
                  name={levelKey}
                  value={levels[levelKey]}
                  onChange={onChange}
                  list={datalistId}
                  placeholder={`Enter or select Level ${idx + 1}`}
                />
                <datalist id={datalistId}>
                  {(existingLevels[idx + 1] || []).map((opt, i) => (
                    <option key={i} value={opt} />
                  ))}
                </datalist>
              </div>
            );
          })}
          <button type="submit" className="m-3 btn btn-success">Generate Code</button>
        </form>

        {resultCode && (
          <div className="alert alert-success mt-4">
            <strong>Generated Code:</strong> {resultCode}
          </div>
        )}

        <div className='my-5'>
          <h4>Search Material</h4>
          <div className="row g-2 mb-3">
            <div className="col-md-3">
              <select className="form-select" value={searchField} onChange={(e) => setSearchField(e.target.value)}>
                {Array.from({ length: 10 }).map((_, idx) => (
                  <option key={idx} value={`LEVEL ${idx + 1}`}>{`LEVEL ${idx + 1}`}</option>
                ))}
              </select>
            </div>

            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder={`Search ${searchField}`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="col-md-2">
              <select className="form-select" value={matchType} onChange={(e) => setMatchType(e.target.value)}>
                <option value="exact">Exact Match</option>
                <option value="partial">Partial Match</option>
              </select>
            </div>

            <div className="col-md-3">
              <button className="btn btn-primary w-100" type="button" onClick={handleSearch}>
                Search
              </button>
            </div>
          </div>

          {searchResult && (
            <div className="alert alert-info">
              <pre>{JSON.stringify(searchResult, null, 2)}</pre>
            </div>
          )}
        </div>

        {error && (
          <div className="alert alert-danger mt-4">
            <strong>Error:</strong> {error}
          </div>
        )}
      </div>

      <DisplayData setLevels={setLevels} />
    </>
  );
}
