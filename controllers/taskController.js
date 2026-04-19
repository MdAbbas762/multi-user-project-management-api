const userModel = require('../models/userModel');
const projectModel = require('../models/projectModel');
const taskModel = require('../models/taskModel');

async function createTask(req, res, next) {
    const { name, description } = req.body;

    const projectId = req.params.projectId;
    const userId = req.user.id;

    try {
        const project = await projectModel.findOne({ _id: projectId });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found.'
            });
        }

        const authorizedProject = await projectModel.findOne({
            _id: projectId,
            $or: [
                { owner: userId },
                { members: userId }
            ]
        });

        if (!authorizedProject) {
            return res.status(403).json({
                success: false,
                message: 'Only the project owner or members can create tasks.'
            });
        }

        const task = await taskModel.create({
            name: name,
            description: description,
            assignedTo: userId,
            projectId: projectId
        });

        const user = await userModel.findOne({ _id: userId });

        return res.status(201).json({
            success: true,
            message: 'Task created successfully.',
            project: {
                id: project._id,
                title: project.title
            },
            task: {
                id: task._id,
                name: task.name,
                description: task.description,
                assignedTo: user.name
            }
        });

    } catch (error) {
        return next(error);
    }
}

async function getTasks(req, res, next) {
    const projectId = req.params.projectId;
    const userId = req.user.id;

    try {
        const project = await projectModel.findOne({ _id: projectId });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found.'
            });
        }

        const authorizedProject = await projectModel.findOne({
            _id: projectId,
            $or: [
                { owner: userId },
                { members: userId }
            ]
        });

        if (!authorizedProject) {
            return res.status(403).json({
                success: false,
                message: 'Only the project owner or members can view tasks.'
            });
        }

        const tasks = await taskModel.find({ projectId: projectId });

        if (tasks.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'No tasks found.',
                tasks: []
            });
        }

        const tasksData = await Promise.all(
            tasks.map(async (task) => {
                const user = await userModel.findOne({ _id: task.assignedTo });

                return {
                    id: task._id,
                    name: task.name,
                    description: task.description,
                    assignedTo: user.name,
                };
            })
        );

        return res.status(200).json({
            success: true,
            message: 'Tasks fetched successfully.',
            project: {
                id: project._id,
                title: project.title
            },
            tasks: tasksData
        });

    } catch (error) {
        return next(error);
    }
}

async function getTaskById(req, res, next) {
    const projectId = req.params.projectId;
    const taskId = req.params.taskId;
    const userId = req.user.id;

    try {
        const project = await projectModel.findOne({ _id: projectId });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found.'
            });
        }

        const authorizedProject = await projectModel.findOne({
            _id: projectId,
            $or: [
                { owner: userId },
                { members: userId }
            ]
        });

        if (!authorizedProject) {
            return res.status(403).json({
                success: false,
                message: 'Only the project owner or members can view tasks.'
            });
        }

        const task = await taskModel.findOne({ projectId: projectId, _id: taskId });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found.'
            });
        }

        const user = await userModel.findOne({ _id: task.assignedTo });

        return res.status(200).json({
            success: true,
            message: 'Task fetched successfully.',
            project: {
                id: project._id,
                title: project.title
            },
            task: {
                id: task._id,
                name: task.name,
                description: task.description,
                assignedTo: user.name
            }
        });

    } catch (error) {
        return next(error);
    }
}

async function updateTask(req, res, next) {
    const data = req.body;
    const projectId = req.params.projectId;
    const taskId = req.params.taskId;
    const userId = req.user.id;

    try {
        const project = await projectModel.findOne({ _id: projectId });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found.'
            });
        }

        const task = await taskModel.findOne({ _id: taskId, projectId: projectId });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found.'
            });
        }

        const ownerProject = await projectModel.findOne({ _id: projectId, owner: userId });

        const isAssignedUser = task.assignedTo.toString() === userId;

        if (!ownerProject && !isAssignedUser) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to update this task.'
            });
        }

        const updatedTask = await taskModel.findOneAndUpdate(
            {
                _id: taskId,
                projectId: projectId
            },
            data,
            {
                new: true,
                runValidators: true
            }
        );

        const assignedUser = await userModel.findOne({ _id: updatedTask.assignedTo });

        return res.status(200).json({
            success: true,
            message: 'Task updated successfully.',
            project: {
                id: project._id,
                title: project.title
            },
            task: {
                id: updatedTask._id,
                name: updatedTask.name,
                description: updatedTask.description,
                assignedTo: assignedUser.name
            }
        });

    } catch (error) {
        return next(error);
    }
}

async function deleteTask(req, res, next) {
    const projectId = req.params.projectId;
    const taskId = req.params.taskId;
    const userId = req.user.id;

    try {

        const project = await projectModel.findOne({ _id: projectId });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found.'
            });
        }

        const task = await taskModel.findOne({ _id: taskId, projectId: projectId });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found.'
            });
        }

        const ownerProject = await projectModel.findOne({ _id: projectId, owner: userId });

        const isAssignedUser = task.assignedTo.toString() === userId;

        if (!ownerProject && !isAssignedUser) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to delete this task.'
            });
        }

        const deletedTask = await taskModel.findOneAndDelete({ _id: taskId, projectId: projectId });

        const assignedUser = await userModel.findOne({ _id: deletedTask.assignedTo });

        return res.status(200).json({
            success: true,
            message: 'Task deleted successfully.',
            project: {
                id: project._id,
                title: project.title
            },
            task: {
                id: deletedTask._id,
                name: deletedTask.name,
                description: deletedTask.description,
                assignedTo: assignedUser.name
            }
        });

    } catch (error) {
        return next(error);
    }
}

module.exports = {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask
}