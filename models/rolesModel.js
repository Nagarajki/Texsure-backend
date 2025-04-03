const { Sequelize } = require('sequelize');
const sequelize = require('../config/db');
const userModel = require('./userModel');


const roles = sequelize.define("roles", {
    role_id: {
        type: Sequelize.INTEGER,
        autoIncrement: false,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
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
        tableName: "ems_roles",
        timestamps: false,
    });

roles.hasMany(userModel, { foreignKey: "role_id" });
userModel.belongsTo(roles, { foreignKey: "role_id" });

module.exports = roles;