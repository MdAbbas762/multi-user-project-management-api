const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const dataValidator = require('../middleware/dataValidatorMiddleware');
const { createProject, getProjects, getProjectById, addMember, removeMember, deleteProject } = require('../controllers/projectController');
const { createProjectSchema, projectRetrievalSchema, addMemberBodySchema, addMemberParamsSchema, removeMemberSchema, deleteProjectSchema } = require('../schemas/project.schema');

const router = express.Router();

router.post('/', authMiddleware, dataValidator({ body: createProjectSchema }), createProject);
router.get('/', authMiddleware, getProjects);
router.get('/:projectId', authMiddleware, dataValidator({ params: projectRetrievalSchema }), getProjectById);
router.patch('/:projectId/members', authMiddleware, dataValidator({ body: addMemberBodySchema, params: addMemberParamsSchema }), addMember);
router.delete('/:projectId/members/:memberId', authMiddleware, dataValidator({ params: removeMemberSchema }), removeMember);
router.delete('/:projectId', authMiddleware, dataValidator({ params: deleteProjectSchema }), deleteProject);

module.exports = router;