import { body, validationResult } from 'express-validator';

export const transactionValidationRules = [
  body('amount')
    .exists()
    .withMessage('Amount is required')
    .isDecimal()
    .withMessage('Amount must be a number'),
  body('description')
    .exists()
    .withMessage('Description is required')
    .isString(),
  body('category').exists().withMessage('Category is required').isString(),
];

export const ollamaChatRequest = [
  body('message').exists().withMessage('Message is required').isString(),
];

export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next();
};
