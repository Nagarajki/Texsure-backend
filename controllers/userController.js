const roles = require("../models/rolesModel");
const { encrypt } = require("../utils/encrypt");
const userModel = require('../models/userModel');
const companyModel = require("../models/companyModel");

const getUsers = async (req, res, next) => {
    try {
        const { id, role_id, company_id: cId } = req.user;
        let userResponse;
        if (role_id === 1000) {
            userResponse = await userModel.findAll({
                where: { is_deleted: false }, include: [{
                    model: roles,
                    attributes: ['role_id', 'name'], // Only include 'role_id' and 'name' fields
                }, { model: companyModel }]
            });
        } else if (role_id === 2000) {
            userResponse = await userModel.findAll({
                where: { company_id: cId, is_deleted: false },
                include: [{
                    model: roles,
                    attributes: ['role_id', 'name'], // Only include 'role_id' and 'name' fields
                }, { model: companyModel }]
            });
        } else if (role_id === 5000) {
            userResponse = await userModel.findAll({
                where: { id, is_deleted: false },
                include: [{
                    model: roles,
                    attributes: ['role_id', 'name'], // Only include 'role_id' and 'name' fields
                }, { model: companyModel }]
            });
        }
        const encryptData = await encrypt(userResponse)
        res.status(200).json({
            error: false,
            message: "Users fetched successfully",
            data: encryptData
        })
    } catch (error) {
        console.log(error);
    }
}
const getUserById = async (req, res, next) => {
    try {
        const { id: user_id, role_id } = req.user;
        let { id } = req.params;
        let encryptData;
        let users;
        if (role_id === 1000) {
            users = await userModel.findOne({
                where: {
                    id: id, is_deleted: false
                },
                include: [{
                    model: roles,
                    attributes: ['role_id', 'name'], // Only include 'role_id' and 'name' fields
                }, { model: companyModel }]
            });
            encryptData = await encrypt(users)
        } else if (user_id * 1 === id * 1) {
            users = await userModel.findOne({
                where: {
                    id: user_id
                }, include: [{
                    model: roles,
                    attributes: ['role_id', 'name'], // Only include 'role_id' and 'name' fields
                }, { model: companyModel }]
            });
            encryptData = await encrypt(users)
        } else {
            return res.status(404).json({
                error: false,
                message: "You cannot access other User Details",
                data: {}
            })
        }
        return res.status(200).json({
            error: false,
            message: "Users fetched successfully",
            data: encryptData
        })
    } catch (error) {
        console.log(error);
    }
}

const updateUser = async (req, res) => {
    try {
        let { first_name: user_name, role_id: u_role } = req.user;
        let { id, first_name, last_name, email_id, company_id, role_id, is_active } = req.body;
        if (email_id) email_id = email_id.toLowerCase();

        const user = await userModel.findOne({ where: { id, is_deleted: false } });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user?.email_id !== email_id) {
            const existUser = await userModel.findOne({ where: { email_id, is_deleted: false } });
            if (existUser) {
                return res.status(404).json({ message: "Emial already Used" });
            }
        }

        let useData = {
            first_name, last_name, email_id, company_id, role_id, is_active, updated_at: new Date(), updated_by: user_name
        }

        const updatedUser = await userModel.update(
            useData,
            { where: { id } }
        );

        // const updatedUser = await userModel.findOne({ where: { id } });

        res.status(200).json({
            error: false,
            message: "User updated",
            data: updatedUser,
        });
    } catch (err) {
        console.log("error", err);
        res.status(500).json({ error: true, message: err.message });
    }
};

let deleteUser = async (req, res, next) => {
    try {
        let { user_id } = req.query;
        const user = await userModel.findOne({ where: { id: user_id, is_deleted: false } });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const destroyUser = await userModel.destroy(
            { where: { id: user_id } }
        );
        res.status(201).json({
            error: false,
            message: "User deleted",
            data: destroyUser
        })
    } catch (error) {

    }
}

module.exports = {
    getUsers,
    getUserById,
    updateUser,
    deleteUser
}