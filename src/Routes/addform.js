import React from "react";

function AddForm() {
    return (
        <div className="add-form-container">
        <h1>Add New Item</h1>
        <form action="/add" method="POST">
            <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input type="text" id="name" name="name" required />
            </div>
            <div className="form-group">
                <label htmlFor="description">Description:</label>
                <textarea id="description" name="description" required></textarea>
            </div>
            <div className="form-group">
                <label htmlFor="startDate">Start Date:</label>
                <input type="date" id="startDate" name="startDate" required />
            </div>
            <div className="form-group">
                <label htmlFor="endDate">End Date:</label>
                <input type="date" id="endDate" name="endDate" required />
            </div>
            <button type="submit">Add Item</button>
        </form>
        </div>
    );
    }
export default AddForm;