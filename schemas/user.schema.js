const { z } = require('zod');
const mongoose = require('mongoose');

const registerSchema = z.object({
    name: z.string().trim().min(3).max(50),
    age: z.number().int().min(13).max(80),
    email: z.string().trim().email(),
    password: z.string().trim().min(8).max(100).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,30}$/),
    adminCode: z.string().trim().optional()
});

const loginSchema = z.object({
    email: z.string().trim().email(),
    password: z.string().trim().min(8).max(100).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,30}$/)
});

const deleteUserSchema = z.object({ 
    userId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val))
});

module.exports = {
    registerSchema,
    loginSchema,
    deleteUserSchema
};