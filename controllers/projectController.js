const userModel = require('../models/userModel');
const projectModel = require('../models/projectModel');
const taskModel = require('../models/taskModel');

async function createProject(req, res, next) {
    const { title, description } = req.body;
    const ownerId = req.user.id;

    try {
        const project = await projectModel.create({
            owner: ownerId,
            title: title,
            description: description
        });

        const owner = await userModel.findOne({ _id: ownerId });

        return res.status(201).json({
            success: true,
            message: 'Project created successfully.',
            project: {
                id: project._id,
                title: project.title,
                description: project.description,
                owner: owner.name
            }
        });

    } catch (error) {
        return next(error);
    }
}

async function getProjects(req, res, next) {
    const userId = req.user.id;

    try {
        const ownedProjects = await projectModel.find({ owner: userId });
        const memberProjects = await projectModel.find({ members: userId });

        if (ownedProjects.length === 0 && memberProjects.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'No projects found.',
                ownedProjects: [],
                memberProjects: []
            });
        }

        const ownedProjectsData = await Promise.all(
            ownedProjects.map(async (project) => {
                const owner = await userModel.findOne({ _id: project.owner });

                return {
                    id: project._id,
                    title: project.title,
                    description: project.description,
                    owner: owner.name
                };
            })
        );

        const memberProjectsData = await Promise.all(
            memberProjects.map(async (project) => {
                const owner = await userModel.findOne({ _id: project.owner });

                return {
                    id: project._id,
                    title: project.title,
                    description: project.description,
                    owner: owner.name
                };
            })
        );

        return res.status(200).json({
            success: true,
            message: 'Projects fetched successfully.',
            ownedProjects: ownedProjectsData,
            memberProjects: memberProjectsData
        });

    } catch (error) {
        return next(error);
    }
}

async function getProjectById(req, res, next) {
    const projectId = req.params.projectId;
    const userId = req.user.id;

    try {
        const project = await projectModel.findOne({
            _id: projectId,
            $or: [
                { owner: userId },
                { members: userId }
            ]
        });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found.'
            });
        }

        const owner = await userModel.findOne({ _id: project.owner });

        return res.status(200).json({
            success: true,
            message: 'Project fetched successfully.',
            project: {
                id: project._id,
                title: project.title,
                description: project.description,
                owner: owner.name
            }
        });

    } catch (error) {
        return next(error);
    }
}

async function addMember(req, res, next) {
    const projectId = req.params.projectId;
    const memberId = req.body.memberId;
    const ownerId = req.user.id;

    try {
        const project = await projectModel.findOne({ _id: projectId });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found.'
            });
        }

        const ownedProject = await projectModel.findOne({ _id: projectId, owner: ownerId });

        if (!ownedProject) {
            return res.status(403).json({
                success: false,
                message: 'Only the project owner can add members.'
            });
        }

        const targetUser = await userModel.findOne({ _id: memberId });

        if (!targetUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found.'
            });
        }

        if (memberId === project.owner.toString()) {
            return res.status(409).json({
                success: false,
                message: 'Project owner cannot be added as a member.'
            });
        }

        const isMember = project.members.map(member => member.toString()).includes(memberId);

        if (isMember) {
            return res.status(409).json({
                success: false,
                message: 'User is already a member of this project.'
            });
        }

        const updatedProject = await projectModel.findOneAndUpdate(
            {
                _id: projectId,
                owner: ownerId
            },
            {
                $push: {
                    members: memberId
                }
            },
            {
                new: true,
                runValidators: true
            }
        );

        const owner = await userModel.findOne({ _id: project.owner });

        return res.status(200).json({
            success: true,
            message: 'Member added to project successfully.',
            project: {
                id: updatedProject._id,
                title: updatedProject.title,
                owner: owner.name
            },
            addedMember: {
                id: targetUser._id,
                name: targetUser.name
            }
        });

    } catch (error) {
        return next(error);
    }
}

async function removeMember(req, res, next) {
    const projectId = req.params.projectId;
    const memberId = req.params.memberId;
    const ownerId = req.user.id;

    try {
        const project = await projectModel.findOne({ _id: projectId });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found.'
            });
        }

        const ownedProject = await projectModel.findOne({ _id: projectId, owner: ownerId });

        if (!ownedProject) {
            return res.status(403).json({
                success: false,
                message: 'Only the project owner can remove members.'
            });
        }

        const targetUser = await userModel.findOne({ _id: memberId });

        if (!targetUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found.'
            });
        }

        const members = project.members.map(member => member.toString());

        if (!members.includes(memberId)) {
            return res.status(409).json({
                success: false,
                message: 'User is not a member of this project.'
            });
        }

        const updatedProject = await projectModel.findOneAndUpdate(
            {
                _id: projectId,
                owner: ownerId
            },
            {
                $pull: {
                    members: memberId
                }
            },
            {
                new: true,
                runValidators: true
            }
        );

        const owner = await userModel.findOne({ _id: project.owner });

        return res.status(200).json({
            success: true,
            message: 'Member removed from project successfully.',
            project: {
                id: updatedProject._id,
                title: updatedProject.title,
                owner: owner.name
            },
            removedMember: {
                id: targetUser._id,
                name: targetUser.name
            }
        });

    } catch (error) {
        return next(error);
    }
}

async function deleteProject(req, res, next) {
    const projectId = req.params.projectId;
    const ownerId = req.user.id;

    try {
        const project = await projectModel.findOne({ _id: projectId });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found.'
            });
        }

        const ownedProject = await projectModel.findOne({ _id: projectId, owner: ownerId });

        if (!ownedProject) {
            return res.status(403).json({
                success: false,
                message: 'Only the project owner can delete a project.'
            });
        }

        await taskModel.deleteMany({ projectId: projectId });
        const deletedProject = await projectModel.findOneAndDelete({ _id: projectId });

        const owner = await userModel.findOne({ _id: project.owner });

        return res.status(200).json({
            success: true,
            message: 'Project deleted successfully.',
            deletedProject: {
                id: deletedProject._id,
                title: deletedProject.title,
                description: deletedProject.description,
                owner: owner.name
            }
        });

    } catch (error) {
        next(error);
    }
}

module.exports = {
    createProject,
    getProjects,
    getProjectById,
    addMember,
    removeMember,
    deleteProject
};