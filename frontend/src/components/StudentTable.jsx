const StudentTable = ({ students, onEdit, onDelete, isLoading }) => {
  if (isLoading) {
    return (
      <div className="table-state">
        <div className="spinner" />
        <p>Loading students...</p>
      </div>
    );
  }

  if (!students || students.length === 0) {
    return (
      <div className="table-state">
        <p>No students found. Try adjusting your search or filters, or add a new student.</p>
      </div>
    );
  }

  const yearLabel = (year) => {
    const map = { 1: '1st Year', 2: '2nd Year', 3: '3rd Year', 4: '4th Year' };
    return map[year] || year;
  };

  return (
    <div className="table-wrapper">
      <table className="student-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Roll Number</th>
            <th>Department</th>
            <th>Year</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student._id}>
              <td data-label="Name">{student.name}</td>
              <td data-label="Roll Number">{student.rollNumber}</td>
              <td data-label="Department">
                <span className="badge">{student.department}</span>
              </td>
              <td data-label="Year">{yearLabel(student.year)}</td>
              <td data-label="Email">{student.email}</td>
              <td data-label="Actions">
                <div className="action-buttons">
                  <button className="btn btn-edit" onClick={() => onEdit(student)}>
                    Edit
                  </button>
                  <button className="btn btn-delete" onClick={() => onDelete(student._id)}>
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentTable;