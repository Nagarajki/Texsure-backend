const { Sequelize } = require('sequelize');
const sequelize = require('../config/db');
const userModel = require('./userModel');

const companyModel = sequelize.define("company", {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    company_name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    city: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
    },
    updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
    },
    created_by: {
        type: Sequelize.STRING,
        defaultValue: "SYSTEM",
    },
    updated_by: {
        type: Sequelize.STRING,
        defaultValue: "SYSTEM",
    },
    is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    is_deleted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,

    }
},
    {
        tableName: "company",
        timestamps: false,
    });

companyModel.hasMany(userModel, { foreignKey: "company_id" });
userModel.belongsTo(companyModel, { foreignKey: "company_id" });

module.exports = companyModel;