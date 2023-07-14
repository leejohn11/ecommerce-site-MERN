import { compare } from "bcrypt";
import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from '../models/userModel.js';
import JWT from 'jsonwebtoken';

export const registerController = async (req, res) => {
    try {
      const { name, email, password, phone, address, answer } = req.body;
      //validations
      if (!name) {
        return res.send({ message: "Name is Required" });
      }
      if (!email) {
        return res.send({ message: "Email is Required" });
      }
      if (!password) {
        return res.send({ message: "Password is Required" });
      }
      if (!phone) {
        return res.send({ message: "Phone no is Required" });
      }
      if (!address) {
        return res.send({ message: "Address is Required" });
      }
      //check user
      const exisitingUser = await userModel.findOne({ email });
      //exisiting user
      if (exisitingUser) {
        return res.status(200).send({
          success: false,
          message: "Already Register please login",
        });
      }
      //register user
      const hashedPassword = await hashPassword(password);
      //save
      const user = await new userModel({
        name,
        email,
        phone,
        address,
        password: hashedPassword
      }).save();
  
      res.status(201).send({
        success: true,
        message: "User Register Successfully",
        user,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error in Registeration",
        error
      });
    }
  };

export const loginController= async(req,res)=>{
  try {
    const{email,password}=req.body
    if(!email||!password){
      return res.status(404).send({
        success:false,
        message:"enter email or pass",
        
      });
    }
    const user=await userModel.findOne({email})
    if(!user){
      return res.status(404).send({
        success:false,
        message:"email not registered",
        
      });
    }
    const match= await comparePassword(password,user.password)
    if(!match){
      return res.status(200).send({
        success:false,
        message:"invalid password",
        
      });
    }

    const token = await JWT.sign({_id:user._id}, process.env.JWT_SECRET, {
      expiresIn:"7d",
    });
    res.status(200).send({
      success:true,
      message:"success login",
      user:{
        _id:user._id,
        name:user.name
      },
      token,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success:false,
      message:"error in login",
      error
    })
  }
};

export const testController = (req, res) => {
  try {
    res.send("Protected Routes");
  } catch (error) {
    console.log(error);
    res.send({ error });
  }
};