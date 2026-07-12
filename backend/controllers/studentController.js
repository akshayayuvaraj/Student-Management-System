import Student from "../models/Student.js";

/**
 * @route   POST /api/students
 * @desc    Create a new student record
 * @access  Private
 */
const createStudent = async (req, res) => {
  try {
    const { name, rollNumber, department, year, email } = req.body;

    if (!name || !rollNumber || !department || !year || !email) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingStudent = await Student.findOne({
      $or: [{ rollNumber }, { email: email.toLowerCase() }],
    });

    if (existingStudent) {
      return res
        .status(409)
        .json({ message: 'A student with this roll number or email already exists' });
    }

    const student = await Student.create({
      name,
      rollNumber,
      department,
      year,
      email,
      createdBy: req.user ? req.user._id : undefined,
    });

    return res.status(201).json({ message: 'Student created successfully', student });
  } catch (error) {
    console.error('Create student error:', error.message);
    return res.status(500).json({ message: 'Server error while creating student' });
  }
};

/**
 * @route   GET /api/students
 * @desc    Get all students (supports optional search & department filter query params)
 * @access  Private
 * @query   search - matches against name or rollNumber (case-insensitive)
 * @query   department - exact department filter
 */
const getStudents = async (req, res) => {
  try {
    const { search, department } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { rollNumber: { $regex: search, $options: 'i' } },
      ];
    }

    if (department && department !== 'All') {
      query.department = department;
    }

    const students = await Student.find(query).sort({ createdAt: -1 });

    return res.status(200).json({ count: students.length, students });
  } catch (error) {
    console.error('Get students error:', error.message);
    return res.status(500).json({ message: 'Server error while fetching students' });
  }
};

/**
 * @route   GET /api/students/:id
 * @desc    Get a single student by id
 * @access  Private
 */
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    return res.status(200).json({ student });
  } catch (error) {
    console.error('Get student error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid student id' });
    }
    return res.status(500).json({ message: 'Server error while fetching student' });
  }
};

/**
 * @route   PUT /api/students/:id
 * @desc    Update an existing student record
 * @access  Private
 */
const updateStudent = async (req, res) => {
  try {
    const { name, rollNumber, department, year, email } = req.body;

    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // If rollNumber or email are being changed, ensure no collision with other records
    if (rollNumber && rollNumber !== student.rollNumber) {
      const duplicateRoll = await Student.findOne({ rollNumber });
      if (duplicateRoll) {
        return res.status(409).json({ message: 'Roll number already in use' });
      }
    }

    if (email && email.toLowerCase() !== student.email) {
      const duplicateEmail = await Student.findOne({ email: email.toLowerCase() });
      if (duplicateEmail) {
        return res.status(409).json({ message: 'Email already in use' });
      }
    }

    student.name = name ?? student.name;
    student.rollNumber = rollNumber ?? student.rollNumber;
    student.department = department ?? student.department;
    student.year = year ?? student.year;
    student.email = email ?? student.email;

    const updatedStudent = await student.save();

    return res.status(200).json({ message: 'Student updated successfully', student: updatedStudent });
  } catch (error) {
    console.error('Update student error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid student id' });
    }
    return res.status(500).json({ message: 'Server error while updating student' });
  }
};

/**
 * @route   DELETE /api/students/:id
 * @desc    Delete a student record
 * @access  Private
 */
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    await student.deleteOne();

    return res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Delete student error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid student id' });
    }
    return res.status(500).json({ message: 'Server error while deleting student' });
  }
};

/**
 * @route   GET /api/students/stats/summary
 * @desc    Get dashboard statistics: total students, department count, final year count
 * @access  Private
 */
const getStudentStats = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const departments = await Student.distinct('department');
    const finalYearStudents = await Student.countDocuments({ year: 4 });

    return res.status(200).json({
      totalStudents,
      departmentsCount: departments.length,
      finalYearStudents,
      departments,
    });
  } catch (error) {
    console.error('Get stats error:', error.message);
    return res.status(500).json({ message: 'Server error while fetching statistics' });
  }
};

export {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getStudentStats,
};