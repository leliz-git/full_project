const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require("../models/Users")
const login = async (req, res) => {
    const {username, password } = req.body
    if (!username || !password ) {
        return res.status(400).json({ message: 'All fields are required' })
    }
    const foundUser = await User.findOne({ username }).lean()
    if (!foundUser) {
        return res.status(401).json({ message: 'Unauthorized' })
    }
    const match = await bcrypt.compare(password, foundUser.password)
    if (!match) return res.status(401).json({ message: 'Unauthorized' })
    //res.send("Logged In")

    const userInfo = {
        _id: foundUser._id, name: foundUser.name,
        roles: foundUser.roles, username: foundUser.username
    }
    const accessToken = jwt.sign(userInfo,process.env.ACCESS_TOKEN_SECRET)
    res.json({ accessToken: accessToken, user:userInfo })
}

const register = async (req, res) => {
    const { roles, username, password, name, email, phone } = req.body
    if (!username || !password || !email) {
        return res.status(400).json({ message: 'All fields are required' })
    }
    const duplicate = await User.findOne({ username: username }).lean()
    if (duplicate) {
        return res.status(409).json({ message: "Duplicate username" })
    }
    const hashedPwd = await bcrypt.hash(password, 10)
    const userObject = { roles, name, email, username, phone, password: hashedPwd }
    const user = await User.create(userObject)
    if (user) {
        return res.status(201).json({
            message: `New user ${user.username} created`
        })
    } else {
        return res.status(400).json({ message: 'Invalid user received' })
    }
}


const Broker_register = async (req, res) => {
    const { username, password, name, email, phone } = req.body
    if (!username || !password || !email) {
        return res.status(400).json({ message: 'All fields are required' })
    }
    const duplicate = await User.findOne({ username: username }).lean()
    if (duplicate) {
        return res.status(409).json({ message: "Duplicate username" })
    }
    const hashedPwd = await bcrypt.hash(password, 10)
    const userObject = { roles:"Broker", name, email, username, phone, password: hashedPwd }
    const user = await User.create(userObject)
    if (user) {
        return res.status(201).json({
            message: `New broker ${user.username} created`
        })
    } else {
        return res.status(400).json({ message: 'Invalid broker received' })
    }
}
module.exports = { login, register,Broker_register }
