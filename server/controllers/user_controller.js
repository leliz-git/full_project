const User = require("../models/Users")
const bcrypt= require('bcrypt')


const updateUser = async (req, res) => {
    const { _id, name, username, email, phone, password } = req.body
    
    const hashedPwd = await bcrypt.hash(password, 10)
    // await getUserById(_id)

    if (!_id) {
        return res.status(400).json({ message: 'id is required' })
    }
    const user = await User.findById(_id).exec()
    if (!user) {
        return res.status(400).json({ message: 'User not found1' })
    }
   
    if (user.username != username) {
        const duplicate = await User.findOne({ username: username }).lean()
        if (duplicate) {
            return res.status(409).json({ message: "Duplicate username" })
        }
    }

    user.name = name
    user.username = username
    user.email = email
    user.phone = phone
    user.password = hashedPwd
    const updatedUser = await user.save()
    const users = await User.find().lean()
    res.json(users)
}

const deleteUser = async (req, res) => {
    const { _id } = req.body

    const user = await User.findById(_id).exec()
    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }
    const result = await user.deleteOne()
    const users = await User.find().lean()
    res.json(users)
}

const getUserById = async (req, res) => {
    const { id } = req.params

    const user = await User.findById(id).lean()

    if (!user) {
        return res.status(400).json({ message: 'No user found' })
    }
    res.json(user)
}

const getAllUsers = async (req, res) => {

    const users = await User.find().sort({ name: 1 }).lean()

    if (!users?.length) {
        return res.status(400).json({ message: 'No users found' })
    }
    res.json(users)
}

module.exports = { updateUser, deleteUser, getUserById, getAllUsers }