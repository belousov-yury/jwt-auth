const sequelize = require('../db')
const {DataTypes, Model} = require('sequelize')

class Token  extends Model {}

Token.init({
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  userId: {type: DataTypes.INTEGER, required: true},
  isActivated: {type: DataTypes.BOOLEAN, default: false},
  refreshToken: {type: DataTypes.STRING, required: true}
}, {
  sequelize,
  modelName: 'Token'
})

module.exports = Token