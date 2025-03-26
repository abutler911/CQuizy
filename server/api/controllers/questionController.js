// src/api/controllers/questionController.js
import { AppError } from "../../utils/AppError.js";
import questionService from "../services/questionService.js";

export const getAllQuestions = async (req, res, next) => {
  try {
    const questions = await questionService.getAllQuestions();
    res.status(200).json({
      status: "success",
      results: questions.length,
      data: {
        questions,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getQuestionById = async (req, res, next) => {
  try {
    const question = await questionService.getQuestionById(req.params.id);

    if (!question) {
      return next(AppError.notFound("Question not found"));
    }

    res.status(200).json({
      status: "success",
      data: {
        question,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createQuestion = async (req, res, next) => {
  try {
    const newQuestion = await questionService.createQuestion(req.body);

    res.status(201).json({
      status: "success",
      data: {
        question: newQuestion,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateQuestion = async (req, res, next) => {
  try {
    const updatedQuestion = await questionService.updateQuestion(
      req.params.id,
      req.body
    );

    if (!updatedQuestion) {
      return next(AppError.notFound("Question not found"));
    }

    res.status(200).json({
      status: "success",
      data: {
        question: updatedQuestion,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteQuestion = async (req, res, next) => {
  try {
    const deleted = await questionService.deleteQuestion(req.params.id);

    if (!deleted) {
      return next(AppError.notFound("Question not found"));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

// src/api/routes/v1/questionRoutes.js
import express from "express";
import {
  getAllQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from "../../controllers/questionController.js";
import { validate } from "../../middlewares/validator.js";
import { questionValidation } from "../../validations/questionValidation.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/questions:
 *   get:
 *     summary: Get all questions
 *     tags: [Questions]
 *     responses:
 *       200:
 *         description: List of all questions
 */
router.get("/", getAllQuestions);

/**
 * @swagger
 * /api/v1/questions/{id}:
 *   get:
 *     summary: Get a question by ID
 *     tags: [Questions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Question details
 *       404:
 *         description: Question not found
 */
router.get("/:id", getQuestionById);

/**
 * @swagger
 * /api/v1/questions:
 *   post:
 *     summary: Create a new question
 *     tags: [Questions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Question created successfully
 *       400:
 *         description: Invalid input
 */
router.post("/", validate(questionValidation.createQuestion), createQuestion);

/**
 * @swagger
 * /api/v1/questions/{id}:
 *   put:
 *     summary: Update a question
 *     tags: [Questions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Question updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Question not found
 */
router.put("/:id", validate(questionValidation.updateQuestion), updateQuestion);

/**
 * @swagger
 * /api/v1/questions/{id}:
 *   delete:
 *     summary: Delete a question
 *     tags: [Questions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Question deleted successfully
 *       404:
 *         description: Question not found
 */
router.delete("/:id", deleteQuestion);

export default router;
