// src/api/validations/questionValidation.js
import { body, param } from "express-validator";

export const questionValidation = {
  createQuestion: [
    body("question")
      .trim()
      .notEmpty()
      .withMessage("Question text is required")
      .isLength({ min: 3, max: 1000 })
      .withMessage("Question must be between 3 and 1000 characters"),

    body("answer")
      .trim()
      .notEmpty()
      .withMessage("Answer is required")
      .isLength({ min: 1, max: 1000 })
      .withMessage("Answer must be between 1 and 1000 characters"),

    body("category").trim().notEmpty().withMessage("Category is required"),

    body("context").trim().notEmpty().withMessage("Context is required"),

    body("questionNumber")
      .isNumeric()
      .withMessage("Question number must be numeric"),
  ],

  updateQuestion: [
    param("id").isMongoId().withMessage("Invalid question ID format"),

    body("question")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Question text cannot be empty if provided")
      .isLength({ min: 3, max: 1000 })
      .withMessage("Question must be between 3 and 1000 characters"),

    body("answer")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Answer cannot be empty if provided")
      .isLength({ min: 1, max: 1000 })
      .withMessage("Answer must be between 1 and 1000 characters"),

    body("category")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Category cannot be empty if provided"),

    body("context")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Context cannot be empty if provided"),

    body("questionNumber")
      .optional()
      .isNumeric()
      .withMessage("Question number must be numeric if provided"),
  ],
};

// src/api/middlewares/validator.js
import { validationResult } from "express-validator";
import { AppError } from "../../utils/AppError.js";

export const validate = (validations) => {
  return async (req, res, next) => {
    try {
      // Run all validations
      await Promise.all(validations.map((validation) => validation.run(req)));

      // Check for validation errors
      const errors = validationResult(req);
      if (errors.isEmpty()) {
        return next();
      }

      // Format validation errors
      const formattedErrors = errors.array().map((err) => ({
        field: err.param,
        message: err.msg,
      }));

      // Throw validation error
      throw AppError.badRequest(
        "Validation failed",
        "ERR_VALIDATION",
        formattedErrors
      );
    } catch (error) {
      next(error);
    }
  };
};
