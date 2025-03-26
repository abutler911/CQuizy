// tests/unit/services/questionService.test.js
import mongoose from "mongoose";
import questionService from "../../../src/api/services/questionService.js";
import Question from "../../../src/models/Question.js";

// Mock the Question model
jest.mock("../../../src/models/Question.js");

describe("Question Service", () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllQuestions", () => {
    it("should return all questions", async () => {
      // Mock data
      const mockQuestions = [
        { _id: "id1", question: "Question 1", answer: "Answer 1" },
        { _id: "id2", question: "Question 2", answer: "Answer 2" },
      ];

      // Setup mock
      Question.find.mockResolvedValue(mockQuestions);

      // Execute
      const result = await questionService.getAllQuestions();

      // Assert
      expect(Question.find).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockQuestions);
      expect(result.length).toBe(2);
    });

    it("should handle empty results", async () => {
      // Setup mock
      Question.find.mockResolvedValue([]);

      // Execute
      const result = await questionService.getAllQuestions();

      // Assert
      expect(Question.find).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });

    it("should propagate errors", async () => {
      // Setup mock to throw error
      const error = new Error("Database error");
      Question.find.mockRejectedValue(error);

      // Execute and assert
      await expect(questionService.getAllQuestions()).rejects.toThrow(
        "Database error"
      );
      expect(Question.find).toHaveBeenCalledTimes(1);
    });
  });

  describe("getQuestionById", () => {
    it("should return a question by ID", async () => {
      // Mock data
      const mockId = new mongoose.Types.ObjectId().toString();
      const mockQuestion = {
        _id: mockId,
        question: "Test question?",
        answer: "Test answer",
      };

      // Setup mock
      Question.findById.mockResolvedValue(mockQuestion);

      // Execute
      const result = await questionService.getQuestionById(mockId);

      // Assert
      expect(Question.findById).toHaveBeenCalledTimes(1);
      expect(Question.findById).toHaveBeenCalledWith(mockId);
      expect(result).toEqual(mockQuestion);
    });

    it("should return null if question not found", async () => {
      // Mock data
      const mockId = new mongoose.Types.ObjectId().toString();

      // Setup mock
      Question.findById.mockResolvedValue(null);

      // Execute
      const result = await questionService.getQuestionById(mockId);

      // Assert
      expect(Question.findById).toHaveBeenCalledTimes(1);
      expect(Question.findById).toHaveBeenCalledWith(mockId);
      expect(result).toBeNull();
    });

    it("should propagate errors", async () => {
      // Mock data
      const mockId = new mongoose.Types.ObjectId().toString();

      // Setup mock to throw error
      const error = new Error("Database error");
      Question.findById.mockRejectedValue(error);

      // Execute and assert
      await expect(questionService.getQuestionById(mockId)).rejects.toThrow(
        "Database error"
      );
      expect(Question.findById).toHaveBeenCalledTimes(1);
      expect(Question.findById).toHaveBeenCalledWith(mockId);
    });
  });

  describe("createQuestion", () => {
    it("should create and return a new question", async () => {
      // Mock data
      const mockQuestionData = {
        question: "New test question?",
        answer: "New test answer",
        category: "Test category",
        context: "Test context",
        questionNumber: 1,
      };

      const savedQuestion = {
        _id: new mongoose.Types.ObjectId().toString(),
        ...mockQuestionData,
      };

      // Setup mocks
      const mockSave = jest.fn().mockResolvedValue(savedQuestion);
      Question.mockImplementation(() => ({
        save: mockSave,
      }));

      // Execute
      const result = await questionService.createQuestion(mockQuestionData);

      // Assert
      expect(Question).toHaveBeenCalledTimes(1);
      expect(Question).toHaveBeenCalledWith(mockQuestionData);
      expect(mockSave).toHaveBeenCalledTimes(1);
      expect(result).toEqual(savedQuestion);
    });

    it("should propagate validation errors", async () => {
      // Mock data
      const mockQuestionData = {
        // Missing required fields
        question: "New test question?",
      };

      // Setup mocks
      const validationError = new Error("Validation failed");
      validationError.name = "ValidationError";

      const mockSave = jest.fn().mockRejectedValue(validationError);
      Question.mockImplementation(() => ({
        save: mockSave,
      }));

      // Execute and assert
      await expect(
        questionService.createQuestion(mockQuestionData)
      ).rejects.toThrow("Validation failed");
      expect(Question).toHaveBeenCalledTimes(1);
      expect(mockSave).toHaveBeenCalledTimes(1);
    });
  });

  // Add more tests for updateQuestion and deleteQuestion methods...
});
