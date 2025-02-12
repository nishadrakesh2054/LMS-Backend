const { DataTypes } = require("sequelize");
const { sequelize } = require("../DataBase/seqDB");

const Auth = sequelize.define("Auth", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  roles: {
    type: DataTypes.ENUM(
      "admin",
      "teacher",
      "student",
      "librarian",
      "HR",
      "counselor"
    ),
    allowNull: false,
    defaultValue: "student",
  },
},{
    timestamps: false,
  
});

module.exports = Auth;
