import { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import StudentForm from '../components/StudentForm';
import StudentTable from '../components/StudentTable';
import {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentStats,
} from '../services/api';

const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState({ totalStudents: 0, departmentsCount: 0, finalYearStudents: 0 });
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [editingStudent, setEditingStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  const storedUser = JSON.parse(localStorage.getItem('user') || 'null');

  const fetchStats = useCallback(async () => {
    try {
      const res = await getStudentStats();
      setStats(res.data);
      setDepartments(res.data.departments || []);
    } catch (err) {
      console.error('Failed to fetch stats', err);
    }
  }, []);

  const fetchStudents = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const params = {};
      if (search) params.search = search;
      if (departmentFilter !== 'All') params.department = departmentFilter;

      const res = await getStudents(params);
      setStudents(res.data.students);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch students');
    } finally {
      setIsLoading(false);
    }
  }, [search, departmentFilter]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStudents();
    }, 300); // debounce search input
    return () => clearTimeout(timer);
  }, [fetchStudents]);

  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    setError('');
    try {
      if (editingStudent) {
        await updateStudent(editingStudent._id, formData);
      } else {
        await createStudent(formData);
      }
      setEditingStudent(null);
      setShowForm(false);
      await fetchStudents();
      await fetchStats();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save student');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingStudent(null);
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student record?')) return;
    setError('');
    try {
      await deleteStudent(id);
      await fetchStudents();
      await fetchStats();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete student');
    }
  };

  return (
    <div className="dashboard-page">
      <Navbar userName={storedUser?.name} />

      <main className="dashboard-content">
        <section className="stats-grid">
          <div className="stat-card">
            <span className="stat-icon">👥</span>
            <div>
              <p className="stat-value">{stats.totalStudents}</p>
              <p className="stat-label">Total Students</p>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">🏛️</span>
            <div>
              <p className="stat-value">{stats.departmentsCount}</p>
              <p className="stat-label">Departments</p>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">🎓</span>
            <div>
              <p className="stat-value">{stats.finalYearStudents}</p>
              <p className="stat-label">Final Year Students</p>
            </div>
          </div>
        </section>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="dashboard-toolbar">
          <div className="toolbar-filters">
            <input
              type="text"
              className="search-input"
              placeholder="Search by name or roll number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="filter-select"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              <option value="All">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {!showForm && (
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>
              + Add Student
            </button>
          )}
        </div>

        {showForm && (
          <StudentForm
            editingStudent={editingStudent}
            onSubmit={handleFormSubmit}
            onCancel={handleCancelEdit}
            isSubmitting={isSubmitting}
          />
        )}

        <section className="card table-card">
          <h3 className="section-title">All Students</h3>
          <StudentTable
            students={students}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isLoading={isLoading}
          />
        </section>
      </main>
    </div>
  );
};

export default Dashboard;