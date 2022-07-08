const sequelize = require('../db')
const {DataTypes, Model} = require('sequelize')

class User  extends Model {}

User.init({
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  email: {type: DataTypes.STRING, unique: true},
  password: {type: DataTypes.STRING},
  isActivated: {type: DataTypes.BOOLEAN, default: false},
  activationLink: {type: DataTypes.STRING},
}, {
  sequelize,
  modelName: 'User'
})

module.exports = User
