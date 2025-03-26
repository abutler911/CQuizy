// src/api/services/questionService.js
import Question from "../../models/Question.js";

export default {
  /**
   * Get all questions
   * @returns {Promise<Array>} Questions array
   */
  getAllQuestions: async () => {
    return Question.find();
  },

  /**
   * Get question by ID
   * @param {string} id - Question ID
   * @returns {Promise<Object>} Question object
   */
  getQuestionById: async (id) => {
    return Question.findById(id);
  },

  /**
   * Create a new question
   * @param {Object} questionData - Question data
   * @returns {Promise<Object>} Created question
   */
  createQuestion: async (questionData) => {
    const newQuestion = new Question(questionData);
    return newQuestion.save();
  },

  /**
   * Update a question
   * @param {string} id - Question ID
   * @param {Object} questionData - Updated question data
   * @returns {Promise<Object>} Updated question
   */
  updateQuestion: async (id, questionData) => {
    return Question.findByIdAndUpdate(id, questionData, {
      new: true,
      runValidators: true,
    });
  },

  /**
   * Delete a question
   * @param {string} id - Question ID
   * @returns {Promise<Object>} Deleted question or null
   */
  deleteQuestion: async (id) => {
    return Question.findByIdAndDelete(id);
  },
};
