const User = require('./userModel');
const Token = require('./tokenModel');

User.hasOne(Token)
Token.belongsTo(User)