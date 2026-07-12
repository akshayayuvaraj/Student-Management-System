import { useState, useEffect } from "react";

const emptyForm = {
  name: "",
  rollNumber: "",
  department: "",
  year: "",
  email: "",
};

const StudentForm = ({
  editingStudent,
  onSubmit,
  onCancel,
  isSubmitting,
}) => {
  const [formData, setFormData] = useState(emptyForm);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editingStudent) {
      setFormData({
        name: editingStudent.name || "",
        rollNumber: editingStudent.rollNumber || "",
        department: editingStudent.department || "",
        year: editingStudent.year || "",
        email: editingStudent.email || "",
      });
    } else {
      setFormData(emptyForm);
    }
  }, [editingStudent]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.rollNumber ||
      !formData.department ||
      !formData.year ||
      !formData.email
    ) {
      setError("Please fill all fields");
      return;
    }

    setError("");

    onSubmit({
      ...formData,
      year: Number(formData.year),
    });
  };

  return (
    <div className="student-form-card">
      <h3 className="form-title">
        {editingStudent ? "✏️ Update Student" : "➕ Add New Student"}
      </h3>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>Student Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter student name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Roll Number</label>
            <input
              type="text"
              name="rollNumber"
              placeholder="Enter roll number"
              value={formData.rollNumber}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Department</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
            >
              <option value="">Select Department</option>
              <option value="CSE">Computer Science</option>
              <option value="IT">Information Technology</option>
              <option value="AIDS">Artificial Intelligence & DS</option>
              <option value="ECE">Electronics & Communication</option>
              <option value="EEE">Electrical & Electronics</option>
              <option value="MECH">Mechanical Engineering</option>
            </select>
          </div>

          <div className="form-group">
            <label>Year</label>
            <select
              name="year"
              value={formData.year}
              onChange={handleChange}
            >
              <option value="">Select Year</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">Final Year</option>
            </select>
          </div>

          <div className="form-group form-group-full">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter email address"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Saving..."
              : editingStudent
              ? "Update Student"
              : "Add Student"}
          </button>

          {editingStudent && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default StudentForm;