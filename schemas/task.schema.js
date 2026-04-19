const { z } = require('zod');
const mongoose = require('mongoose');

const createTaskBodySchema = z.object({
    name: z.string().trim().min(3).max(100),
    description: z.string().trim().min(10).max(1000)
});

const createTaskParamsSchema = z.object({
    projectId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val))
});

const taskRetrievalSchema = z.object({
  projectId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val))
});

const taskByIdRetrievalSchema = z.object({ 
    projectId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val)),
    taskId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val))
});

const updateTaskBodySchema = z.object({ 
    name: z.string().trim().min(3).max(100).optional(),
    description: z.string().trim().min(10).max(1000).optional()
});

const updateTaskParamsSchema = z.object({ 
    projectId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val)),
    taskId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val))
});

const deleteTaskSchema = z.object({ 
    projectId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val)),
    taskId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val))
});

module.exports = {
    createTaskBodySchema,
    createTaskParamsSchema,
    taskRetrievalSchema,
    taskByIdRetrievalSchema,
    updateTaskBodySchema,
    updateTaskParamsSchema,
    deleteTaskSchema
};