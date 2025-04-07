const roles = require("../models/rolesModel");
const { encrypt } = require("../utils/encrypt");
const companyModel = require('../models/companyModel');

const getCompanies = async (req, res, next) => {
    try {
        const { role_id, company_id } = req.user;
        let companyResponse;
        if (role_id === 1000) {
            companyResponse = await companyModel.findAll({
                where: { is_deleted: false }
            });
        } else {
            companyResponse = await companyModel.findAll({
                where: { company_id, is_deleted: false }
            });
        }
        const encryptData = await encrypt(companyResponse)
        res.status(200).json({
            error: false,
            message: "Company fetched successfully",
            data: encryptData
        })
    } catch (error) {
        next(error)
        console.log(error);
    }
}
const getCompanyById = async (req, res, next) => {
    try {
        const { company_id: cId, role_id } = req.user;
        let { id } = req.params;
        let encryptData;
        let comapny;
        if (role_id === 1000) {
            comapny = await companyModel.findOne({
                where: {
                    company_id: id, is_deleted: false
                },
                include: [{
                    model: roles,
                    attributes: ['role_id', 'name'], // Only include 'role_id' and 'name' fields
                }]
            });
            encryptData = await encrypt(comapny)
        } else if (cId * 1 === id * 1) {
            comapny = await companyModel.findOne({
                where: {
                    company_id: id
                }
            });
            encryptData = await encrypt(comapny)
        } else {
            return res.status(404).json({
                error: false,
                message: "You cannot access other Company Details",
                data: {}
            })
        }
        return res.status(200).json({
            error: false,
            message: "Company fetched successfully",
            data: encryptData
        })
    } catch (error) {
        console.log(error);
        next(error)
    }
}

const updateCompany = async (req, res, next) => {
    try {
        let { first_name: user_name } = req.user;
        let { company_id, company_name, city, is_active } = req.body;

        const company = await companyModel.findOne({ where: { company_id, is_deleted: false } });

        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }
        if (company?.company_name !== company_name) {
            const existCompany = await companyModel.findOne({ where: { company_name, is_deleted: false } });
            if (existCompany) {
                return res.status(404).json({ message: "Company Name already Used" });
            }
        }
        let useData = {
            company_name, city, is_active, updated_at: new Date(), updated_by: user_name
        }

        const updatedCompany = await companyModel.update(
            useData,
            { where: { company_id } }
        );

        res.status(200).json({
            error: false,
            message: "Company updated",
            data: updatedCompany,
        });
    } catch (err) {
        console.log("error", err);
        next(err)
    }
};

let deleteCompany = async (req, res, next) => {
    try {
        let { user_id } = req.query;
        const user = await companyModel.findOne({ where: { id: user_id, is_deleted: false } });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const destroyUser = await companyModel.destroy(
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
    getCompanies,
    getCompanyById,
    updateCompany,
    deleteCompany
}