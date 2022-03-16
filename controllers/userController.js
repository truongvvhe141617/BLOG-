const User = require('../models/User');
const bcrypt = require('bcrypt');
const Post = require('../models/Post')

//Update user
exports.updateUser = async(req, res, next) => {
    const id = req.params.id;
    if(req.body.userId === id) {
        if(req.body.password) {
            const salt = await bcrypt.genSalt(12);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }
        try {
        //   const updateUser = await User.findByIdAndUpdate(req.params.id, {
        //     $set: req.body,
        //   }, {
        //       new : true
        //   })
            const updateUser = await User.findByIdAndUpdate(id, req.body, {
                new : true
            })
          res.status(200).json(updateUser);
        } catch (error) {
            res.status(500).json(error);
        }
    }else {
        res.status(401).json("You can update only one your account!");
    }
}

//DELETE USER

exports.deleteUser = async(req, res, next) => {
    if (req.body.userId === req.params.id) {
        try {
          const user = await User.findById(req.params.id);
          try {
            await Post.deleteMany({ username: user.username });
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json("User has been deleted...");
          } catch (err) {
            res.status(500).json(err);
          }
        } catch (err) {
          res.status(404).json("User not found!");
        }
      } else {
        res.status(401).json("You can delete only your account!");
      }
}

//GET USER BY ID 

exports.getUserById = async(req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, ...others } = user._doc;
        res.status(200).json(others);
      } catch (err) {
        res.status(500).json(err);
      }
    }