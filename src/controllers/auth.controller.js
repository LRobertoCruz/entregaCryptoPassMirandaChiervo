import bcrypt from 'bcryptjs';
import { createAccessToken } from '../libs/jwt.js';

import User from '../models/user.model.js';

export const register = async (req, res) => {
    const { email, password, username, first_name, last_name, role, age } = req.body;

    try {
        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashPassword,
            first_name,
            last_name,
            role: role || 'user',
            age,
        });

        const userSave = await newUser.save();
        const token = await createAccessToken({ id: userSave._id });

        res.cookie('token', token);

        res.json({
            id: userSave._id,
            username: userSave.username,
            email: userSave.email,
            first_name: userSave.first_name,
            last_name: userSave.last_name,
            role: userSave.role,
            age: userSave.age,
            createdAt: userSave.createdAt,
            updatedAt: userSave.updatedAt,
        });
        console.log("Usuario Registrado");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const userFound = await User.findOne({email});

        if(!userFound) return res.status(400).json({message: "User not found"});

        const isMatch = await bcrypt.compare(password, userFound.password);

        if(!isMatch) return res.status(400).json({message: "Incorrect password"});

        const token = await createAccessToken({id: userFound._id})

        res.cookie('token', token);

        res.json({
            id: userFound._id,
            username: userFound.username,
            email: userFound.email,
            createdAt: userFound.createdAt,
            updatedAt: userFound.updatedAt,
        });
        console.log("Usuario Registrado");
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const logout = (req, res) => {
    res.cookie('token', "", {
        expires: new Date(0)
    });
    return res.sendStatus(200);
}

export const profile = (req, res) => {
    res.send('profile');
}
