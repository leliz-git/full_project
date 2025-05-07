const User = require("../models/Users")
const bcrypt= require('bcrypt')
const jwt = require('jsonwebtoken')



const updateUser = async (req, res) => {
    try {
        const { _id, name, username, email, phone, password } = req.body;

        // בדיקה אם ה-ID קיים
        if (!_id) {
            console.log("1");
            return res.status(400).json({ message: 'id is required' });
        }

        // שליפת המשתמש לפי ID
        const user = await User.findById(_id).exec();
        if (!user) {
            console.log("2");
            return res.status(404).json({ message: 'User not found' });
        }

        // בדיקה אם שם המשתמש שונה
        if (username && user.username !== username) {
            const duplicate = await User.findOne({ username: username }).lean();
            if (duplicate) {
                return res.status(409).json({ message: "Duplicate username" });
            }
        }

        // עדכון פרטי המשתמש
        if (name) user.name = name;
        if (username) user.username = username;
        if (email) user.email = email;
        if (phone) user.phone = phone;

        // הצפנת סיסמה אם סופקה
        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }

        // שמירת המשתמש המעודכן
        const updatedUser = await user.save();

        // ✅ יצירת טוקן חדש עם הפרטים המעודכנים
        const token = jwt.sign(
            {
                id: updatedUser._id,
                name: updatedUser.name,
                username: updatedUser.username,
                email: updatedUser.email
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1h' }
        );

        // שליפת כל המשתמשים לאחר העדכון
        const users = await User.find().lean();

        // ✅ מחזיר גם את רשימת המשתמשים וגם את הטוקן החדש
        return res.json({ users, token });

    } catch (error) {
        console.error('Error updating user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const updateRole = async (req, res) => {
    const { _id} = req.body
    
    // const hashedPwd = await bcrypt.hash(password, 10)
    // await getUserById(_id)

    if (!_id) {
        return res.status(400).json({ message: 'id is required' })
    }
    const user = await User.findById(_id).exec()
    if (!user) {
        return res.status(400).json({ message: 'User not found1' })
    }
   
   

   user.roles="Seller"
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
    const { _id } = req.params

    const user = await User.findById(_id).lean()

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

module.exports = { updateUser, deleteUser, getUserById, getAllUsers, updateRole }