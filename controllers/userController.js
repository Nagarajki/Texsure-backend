const UserModel = require("../models/userModel");
const bcrypt = require('bcrypt');
const { encrypt } = require("../utils/encrypt");
const roles = require("../models/rolesModel");

const getUsers = async (req, res, next) => {
    try {
        const { id, role_id, company_id: cId } = req.user;
        let userResponse;
        if (role_id === 1000) {
            userResponse = await UserModel.findAll({
                where: { is_deleted: false }, include: [{
                    model: roles,
                    attributes: ['role_id', 'name'], // Only include 'role_id' and 'name' fields
                }]
            });
        } else if (role_id === 2000) {
            userResponse = await UserModel.findAll({
                where: { company_id: cId, is_deleted: false },
                include: [{
                    model: roles,
                    attributes: ['role_id', 'name'], // Only include 'role_id' and 'name' fields
                }]
            });
        }
        const encryptData = await encrypt(userResponse)
        res.status(200).json({
            error: false,
            message: "Users fetched successfully",
            data: userResponse
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
            users = await UserModel.findOne({
                where: {
                    id: id, is_deleted: false
                },
                include: [{
                    model: roles,
                    attributes: ['role_id', 'name'], // Only include 'role_id' and 'name' fields
                }]
            });
            encryptData = await encrypt(users)
        } else if (user_id * 1 === id * 1) {
            users = await UserModel.findOne({
                where: {
                    id: user_id
                }
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
            data: users
        })
    } catch (error) {
        console.log(error);
    }
}

const updateUser = async (req, res) => {
    try {
        let { name: user_name, role_id: u_role } = req.user;
        let { id, name, email, phone, password, company_id, sites_id, role_id, is_active } = req.body;
        email = email.toLowerCase();

        const user = await UserModel.findOne({ where: { id, is_deleted: false } });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        let useData = {
            name, email, phone, password, company_id, sites_id, role_id, is_active, updated_at: new Date(), updated_by: user_name
        }
        if (u_role === 1000) {
            useData.email = email;
            useData.phone = phone;
        } else {
            useData.email = user?.email;
        }

        // Encrypt password
        if (password) {
            const salt = await bcrypt.genSalt(10);
            useData.password = await bcrypt.hash(password, salt);
        }

        const updatedUser = await UserModel.update(
            useData,
            { where: { id } }
        );

        // const updatedUser = await UserModel.findOne({ where: { id } });

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
        const user = await UserModel.findOne({ where: { id: user_id, is_deleted: false } });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const destroyUser = await UserModel.destroy(
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