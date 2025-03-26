// tests/integration/questions.test.js
import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../../src/app.js";
import Question from "../../src/models/Question.js";

let mongoServer;

beforeAll(async () => {
  // Create in-memory MongoDB server
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  // Connect to the in-memory database
  await mongoose.connect(uri);
});

afterAll(async () => {
  // Disconnect and stop MongoDB server
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  // Clear the database before each test
  await Question.deleteMany({});
});

describe("Question API", () => {
  const sampleQuestion = {
    question: "What is the minimum voltage for batteries 1 & 2?",
    answer: "21.0 or 22.5 with the recharge procedure",
    category: "Pre-Departure Ground Operations",
    context: "Cold, dark flight deck, batteries 1 & 2 selected on.",
    questionNumber: 1,
  };

  describe("GET /api/v1/questions", () => {
    it("should return all questions", async () => {
      // Create some test questions
      await Question.create(sampleQuestion);
      await Question.create({
        ...sampleQuestion,
        question: "What is the procedure if the battery voltage is below 21.0?",
        answer: "Write it up, call maintenance.",
        questionNumber: 2,
      });

      // Make request
      const res = await request(app)
        .get("/api/v1/questions")
        .expect("Content-Type", /json/)
        .expect(200);

      // Assertions
      expect(res.body.status).toBe("success");
      expect(res.body.results).toBe(2);
      expect(res.body.data.questions).toHaveLength(2);
      expect(res.body.data.questions[0].question).toBe(sampleQuestion.question);
    });
  });

  describe("GET /api/v1/questions/:id", () => {
    it("should return a single question by ID", async () => {
      // Create test question
      const question = await Question.create(sampleQuestion);

      // Make request
      const res = await request(app)
        .get(`/api/v1/questions/${question._id}`)
        .expect("Content-Type", /json/)
        .expect(200);

      // Assertions
      expect(res.body.status).toBe("success");
      expect(res.body.data.question.question).toBe(sampleQuestion.question);
      expect(res.body.data.question._id).toBe(question._id.toString());
    });

    it("should return 404 if question not found", async () => {
      // Create fake ObjectId
      const nonExistentId = new mongoose.Types.ObjectId();

      // Make request
      const res = await request(app)
        .get(`/api/v1/questions/${nonExistentId}`)
        .expect("Content-Type", /json/)
        .expect(404);

      // Assertions
      expect(res.body.status).toBe("error");
      expect(res.body.error.code).toBe("ERR_NOT_FOUND");
    });
  });

  describe("POST /api/v1/questions", () => {
    it("should create a new question", async () => {
      // Make request
      const res = await request(app)
        .post("/api/v1/questions")
        .send(sampleQuestion)
        .expect("Content-Type", /json/)
        .expect(201);

      // Assertions
      expect(res.body.status).toBe("success");
      expect(res.body.data.question.question).toBe(sampleQuestion.question);

      // Check if actually saved to database
      const questionInDb = await Question.findById(res.body.data.question._id);
      expect(questionInDb).toBeTruthy();
      expect(questionInDb.question).toBe(sampleQuestion.question);
    });

    it("should return 400 if invalid data", async () => {
      // Make request with missing required field
      const res = await request(app)
        .post("/api/v1/questions")
        .send({
          answer: sampleQuestion.answer,
          category: sampleQuestion.category,
          context: sampleQuestion.context,
        })
        .expect("Content-Type", /json/)
        .expect(400);

      // Assertions
      expect(res.body.status).toBe("error");
      expect(res.body.error.code).toBe("ERR_VALIDATION");
    });
  });

  describe("PUT /api/v1/questions/:id", () => {
    it("should update a question", async () => {
      // Create test question
      const question = await Question.create(sampleQuestion);

      // Updated data
      const updatedData = {
        ...sampleQuestion,
        question: "Updated question text?",
        answer: "Updated answer.",
      };

      // Make request
      const res = await request(app)
        .put(`/api/v1/questions/${question._id}`)
        .send(updatedData)
        .expect("Content-Type", /json/)
        .expect(200);

      // Assertions
      expect(res.body.status).toBe("success");
      expect(res.body.data.question.question).toBe(updatedData.question);
      expect(res.body.data.question.answer).toBe(updatedData.answer);

      // Check if actually updated in database
      const questionInDb = await Question.findById(question._id);
      expect(questionInDb.question).toBe(updatedData.question);
      expect(questionInDb.answer).toBe(updatedData.answer);
    });

    it("should return 404 if question not found", async () => {
      // Create fake ObjectId
      const nonExistentId = new mongoose.Types.ObjectId();

      // Make request
      const res = await request(app)
        .put(`/api/v1/questions/${nonExistentId}`)
        .send(sampleQuestion)
        .expect("Content-Type", /json/)
        .expect(404);

      // Assertions
      expect(res.body.status).toBe("error");
      expect(res.body.error.code).toBe("ERR_NOT_FOUND");
    });
  });

  describe("DELETE /api/v1/questions/:id", () => {
    it("should delete a question", async () => {
      // Create test question
      const question = await Question.create(sampleQuestion);

      // Make request
      const res = await request(app)
        .delete(`/api/v1/questions/${question._id}`)
        .expect(204);

      // Check if actually deleted from database
      const questionInDb = await Question.findById(question._id);
      expect(questionInDb).toBeNull();
    });

    it("should return 404 if question not found", async () => {
      // Create fake ObjectId
      const nonExistentId = new mongoose.Types.ObjectId();

      // Make request
      const res = await request(app)
        .delete(`/api/v1/questions/${nonExistentId}`)
        .expect("Content-Type", /json/)
        .expect(404);

      // Assertions
      expect(res.body.status).toBe("error");
      expect(res.body.error.code).toBe("ERR_NOT_FOUND");
    });
  });
});
