import express from "express";
import {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentStats,
} from "../controllers/studentController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Dashboard Statistics
router.get("/stats/summary", protect, getStudentStats);

// Get all students & Create student
router
  .route("/")
  .get(protect, getStudents)
  .post(protect, createStudent);

// Get one student, Update student, Delete student
router
  .route("/:id")
  .get(protect, getStudentById)
  .put(protect, updateStudent)
  .delete(protect, deleteStudent);

export default router;