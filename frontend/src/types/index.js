// TypeScript interfaces converted to JSDoc comments for better IDE support

/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} name
 * @property {string} email
 * @property {'admin'|'user'} role
 */

/**
 * @typedef {Object} Question
 * @property {number} id
 * @property {string} question
 * @property {string[]} options
 * @property {number} correctAnswer
 * @property {'beginner'|'intermediate'|'advanced'} level
 * @property {'grammar'|'vocabulary'|'reading'|'listening'} category
 */

/**
 * @typedef {Object} Test
 * @property {number} id
 * @property {string} title
 * @property {number} questions
 * @property {number} duration
 * @property {'beginner'|'intermediate'|'advanced'} level
 */

/**
 * @typedef {Object} TestResult
 * @property {number} totalQuestions
 * @property {number} correctAnswers
 * @property {number} score
 * @property {number} timeSpent
 */

/**
 * @typedef {Object.<number, number>} UserAnswers
 */

/**
 * @typedef {Object} TestHistory
 * @property {number} id
 * @property {number} userId
 * @property {string} userName
 * @property {number} testId
 * @property {string} testTitle
 * @property {number} score
 * @property {number} correctAnswers
 * @property {number} totalQuestions
 * @property {number} timeSpent
 * @property {string} completedAt
 */

export {}
