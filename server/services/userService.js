const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const mailService = require('./mailService')
const TokenService = require('./tokenService')
const UserDto = require('../dtos/userDto')
const ApiError = require('../exceptions/apiError');

class UserService {
  async registration(email, password) {
    const candidate = await User.findOne({where: {email}})
    if (candidate) {
      throw ApiError.BadRequest(`Пользователь с таким email ${email} уже существует.`)
    }

    const hashPassword = await bcrypt.hash(password, 3)
    const activationLink = await uuid.v4()

    const user = await User.create({email, password: hashPassword, activationLink})
    await mailService.sendActivationMail(email, `${process.env.API_URL}api/activate/${activationLink}`)

    const userDto = new UserDto(user)
    const tokens = TokenService.generateTokens({...userDto})
    await TokenService.saveToken(userDto.id, tokens.refreshToken)

    return {...tokens, user: userDto}
  }

  async activate(activationLink) {
    const user = await User.findOne({where: {activationLink}})
    if(!user) {
      throw ApiError.BadRequest('Неккоректная ссылка активации')
    }
    user.isActivated = true
    await user.save()
  }

  async login(email, password) {
    const user = await User.findOne({where: {email}})
    if(!user) {
      throw ApiError.BadRequest('Пользователь с таким email не был найден')
    }

    const isPassEquals = await bcrypt.compare(password, user.password)

    if(!isPassEquals) {
      throw ApiError.BadRequest('Неверный пароль')
    }

    const userDto = new UserDto(user)
    const tokens = TokenService.generateTokens({...userDto})
    await TokenService.saveToken(userDto.id, tokens.refreshToken)

    return {...tokens, user: userDto}
  }
  async logout(refreshToken) {
    const token = TokenService.removeToken(refreshToken)
    return token
  }

  async refresh(refreshToken) {
    if(!refreshToken) {
      throw ApiError.UnauthorizedError()
    }
    const userData = TokenService.validateRefreshToken(refreshToken)
    const tokenFromDb = await TokenService.findToken(refreshToken)

    if(!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError()
    }

    const user = await User.findOne({where: {id: userData.id}})
    const userDto = new UserDto(user)
    const tokens = TokenService.generateTokens({...userDto})
    await TokenService.saveToken(userDto.id, tokens.refreshToken)

    return {...tokens, user: userDto}
  }

  async getAllUsers() {
    const users = User.findAll()
    return users
  }
}

module.exports = new UserService()