const { z } = require('zod');
const mongoose = require('mongoose');

const createProjectSchema = z.object({
    title: z.string().trim().min(3).max(100),
    description: z.string().trim().min(10).max(1000)
});

const projectRetrievalSchema = z.object({
  projectId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val))
});

const addMemberParamsSchema = z.object({ 
    projectId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val))
});

const addMemberBodySchema = z.object({ 
    memberId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val))
});

const removeMemberSchema = z.object({ 
    projectId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val)),
    memberId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val))
});

const deleteProjectSchema = z.object({ 
    projectId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val))
});

module.exports = {
    createProjectSchema,
    projectRetrievalSchema,
    addMemberBodySchema,
    addMemberParamsSchema,
    removeMemberSchema,
    deleteProjectSchema
};