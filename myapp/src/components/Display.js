import React, { useEffect, useState } from 'react';

export default function DisplayData() {
  const [stockData, setStockData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [editLevels, setEditLevels] = useState({});
  const isLoggedIn = !!localStorage.getItem("authToken");

  const fetchStockData = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/stockData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const json = await response.json();
      setStockData(json[0]); // Assuming [global.stock_item]
      setLoading(false);
    } catch (err) {
      console.error("❌ Error fetching stock data:", err);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this item?");
    if (!confirmDelete) return;

    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("❌ You must be logged in to delete.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/delete-product/${id}`, {
        method: "DELETE",
        headers: {
          "auth-token": token
        }
      });

      const result = await res.json();

      if (result.success) {
        alert("✅ Product deleted successfully");
        setStockData(prev => prev.filter(item => item._id !== id));
      } else {
        alert("❌ Failed to delete product");
      }
    } catch (error) {
      console.error("❌ Error deleting item:", error);
    }
  };

  const handleUpdate = async (e, id) => {
    e.preventDefault();

    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("❌ You must be logged in to update.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/update-product/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ levels: editLevels })
      });

      const result = await response.json();
      if (result.success) {
        alert("✅ Product updated successfully");
        setEditingItem(null);
        fetchStockData(); // refresh data
      } else {
        alert("❌ Failed to update product");
      }
    } catch (error) {
      console.error("❌ Error updating item:", error);
    }
  };


  useEffect(() => {
    fetchStockData();
  }, []);

  // Pagination logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = stockData.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(stockData.length / rowsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const isFirstColumn = (key) => key.toLowerCase() === "_id";

  return (
    <div className="container mt-4">
      <h2>Stock Items</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <table className="table table-dark table-striped">
            <thead>
              <tr>
                {currentRows.length > 0 &&
                  Object.keys(currentRows[0])
                    .filter((key) => !isFirstColumn(key))
                    .map((key) => (
                      <th key={key}>{key}</th>
                    ))}
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {currentRows.map((item, index) => (
                <React.Fragment key={item._id}>
                  <tr key={index}>
                    {Object.entries(item)
                      .filter(([key]) => !isFirstColumn(key))
                      .map(([_, val], idx) => (
                        <td key={idx}>{val}</td>
                      ))}
                    <td>
                      {isLoggedIn && (
                        <>
                          <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item._id)}>
                            Delete
                          </button>
                          <button className='btn btn-sm btn-warning ms-2' onClick={() => {
                            setEditingItem(item._id);
                            setEditLevels(item);
                          }}>
                            Edit
                          </button>
                        </>
                      )}
                    </td>

                  </tr>
                  {editingItem === item._id && (
                    <tr className="bg-light text-dark">
                      <td colSpan={Object.keys(item).length}>
                        <form onSubmit={(e) => handleUpdate(e, item._id)}>
                          {Object.entries(item)
                            .filter(([key]) => !isFirstColumn(key))
                            .map(([key], idx) => (
                              <div className="mb-2" key={idx}>
                                <label>{key}</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={editLevels[key] || ""}
                                  onChange={(e) =>
                                    setEditLevels({ ...editLevels, [key]: e.target.value })
                                  }
                                />
                              </div>
                            ))}
                          <button type="submit" className="btn btn-success me-2">Update</button>
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => setEditingItem(null)}
                          >
                            Cancel
                          </button>
                        </form>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>

          <div className="d-flex justify-content-between align-items-center mt-3">
            <button
              onClick={handlePrevious}
              className="btn btn-secondary"
              disabled={currentPage === 1}
            >
              ◀ Previous
            </button>
            <span className="text-white">Page {currentPage} of {totalPages}</span>
            <button
              onClick={handleNext}
              className="btn btn-secondary"
              disabled={currentPage === totalPages}
            >
              Next ▶
            </button>
          </div>
        </>
      )}
    </div>
  );
}
