const { Sequelize } = require("sequelize");
const sequelize = require("../config/db");

const userModel = sequelize.define(
    "user",
    {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        first_name : {
            type: Sequelize.STRING,
            allowNull: false,
        },
        last_name  : {
            type: Sequelize.STRING,
            allowNull: false,
        },
        email_id: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
        },
        otp: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        company_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        role_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 5000,
        },
        created_at: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW,
        },
        created_by: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: "System",
        },
        updated_at: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW,
        },
        updated_by: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: "System",
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
        },
    },
    {
        tableName: "users",
        timestamps: false,
    }
);

module.exports = userModel;
