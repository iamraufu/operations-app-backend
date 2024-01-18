const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const UserModel = require('../models/UserModel');
const mongoose = require("mongoose");

// Register a new user
const register = async (req, res) => {
      try {
            const { email } = req.body
            let userExist = Boolean(await UserModel.findOne({ email }))

            if (!userExist) {
                  const salt = await bcrypt.genSalt(10);
                  const passwordHash = await bcrypt.hash(req.body.password, salt);

                  let user = await UserModel.create(
                        {
                              ...req.body,
                              password: passwordHash
                        }
                  );

                  return res.status(201).send(
                        {
                              status: true,
                              message: "User created successfully!",
                              token: jwt.sign({
                                    name: user.name,
                                    email: user.email,
                                    role: user.role,
                              }, process.env.JWT)
                        })
            }
            else {
                  return res.status(409).send({
                        status: false,
                        message: `User exist with ${email}`
                  })
            }
      }
      catch (err) {
            res.send({
                  status: false,
                  message: `Error in registration : ${err}`
            })
      }
}

// User Login
const login = async (req, res) => {
      const { email, password } = req.body
      const user = await UserModel.findOne({ email })
      const userExist = Boolean(await UserModel.findOne({ email }))

      if (!userExist) {
            return res.status(401).json({
                  status: false,
                  message: `User doesn't exist`
            })
      }

      const isPasswordValid = await bcrypt.compare(password, user.password)

      if (!user || !isPasswordValid) {
            return res.status(401).json({
                  status: false,
                  message: "Invalid email or password"
            })
      }
      else {
            let token = jwt.sign(
                  {
                        email: user.email,
                        name: user.name,
                        role: user.role
                  },
                  process.env.JWT,
                  {
                        expiresIn: '7d'
                  });

            res.send({
                  status: true,
                  message: "User logged in successfully!",
                  token: `Bearer ${token}`,
                  user,
            });
      }
}

// GET all users
const users = async (req, res) => {
      try {
            const allUsers = await UserModel.find({ isDeleted: false })

            res.status(200).json({
                  status: true,
                  users: allUsers
            })
      }
      catch (err) {
            res.status(500).json({
                  status: false,
                  message: `${err}`
            })
      }
}

// GET all deleted users
const deletedUsers = async (req, res) => {
      try {
            const allUsers = await UserModel.find({ isDeleted: true })

            res.status(200).json({
                  status: true,
                  users: allUsers
            })
      }
      catch (err) {
            res.status(500).json({
                  status: false,
                  message: `${err}`
            })
      }
}

// GET all user preferences
const userPreferences = async (req, res) => {

      try {
            await UserModel.find({}, 'role hasPermission').exec()
                .then(users => {
                    const userRolesAndPermissions = {
                        roles: [...new Set(users.map(user => user.role))],
                        permissions: [...new Set(users.reduce((acc, user) => acc.concat(user.hasPermission), []))]
                    };

                    res.status(200).json({
                        status: true,
                        preferences: userRolesAndPermissions
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        status: false,
                        message: `${err}`
                    });
                });
        
        } catch (err) {
            res.status(500).json({
                status: false,
                message: `${err}`
            });
        }
        
}

// GET user by Id
const user = async (req, res) => {

      const { id } = req.params

      if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({
                  status: false,
                  message: `User Id Incorrect`
            })
      }

      try {
            const singleUser = await UserModel.findById(id)

            res.status(200).json({
                  status: true,
                  user: singleUser
            })
      }
      catch (err) {
            res.status(500).json({
                  status: false,
                  message: `${err}`
            })
      }
}

// Update user by Id
const update = async (req, res) => {

      const { id } = req.params
      let userDetails = {}

      if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({
                  status: false,
                  message: `User Id incorrect`
            })
      }

      if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(req.body.password, salt);

            userDetails = {
                  ...req.body,
                  password: passwordHash,
                  updatedAt: new Date()
            }
      }
      else {
            userDetails = {
                  ...req.body,
                  updatedAt: new Date()
            }
      }

      try {
            let updatedUser = await UserModel.findByIdAndUpdate(id, userDetails, { new: true, runValidators: true })

            res.status(201).json({
                  status: true,
                  user: updatedUser
            })
      }
      catch (err) {
            res.status(500).json({
                  status: false,
                  message: `${err}`
            })
      }
}

module.exports = {
      register,
      login,
      users,
      deletedUsers,
      userPreferences,
      user,
      update
}