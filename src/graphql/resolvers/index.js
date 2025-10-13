import argon2 from 'argon2';
import { GraphQLDateTime } from "graphql-scalars";
import jwt from 'jsonwebtoken';
import mongoose, { model } from 'mongoose';
import dotenv from 'dotenv';
import { AuthenticationError, ForbiddenError } from 'apollo-server-express';
import User from "../../models/user.js"; 
import user from '../../models/user.js';

dotenv.config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const resolvers = {
  Query: {
    getUsers: async (_, __, { models, user }) => {
      if (!user || user.role !== 'ADMIN') {
        throw new ForbiddenError('Access denied. Admins only.');
      }
      return await models.User.find();
    },
    getTests: async (_, __, { models }) => await models.Test.find(),
   
      },
  
  
  Mutation: {
    signup: async (_, { username, password, role, email, full_name }, { models }) => {
      if (!username || !password || !role) {
        throw new AuthenticationError("All fields are required");
      }
      const existingUser = await models.User.findOne({ username });
      if (existingUser) throw new AuthenticationError("Username already taken");
      const hashedPassword = await argon2.hash(password);
      const user = await models.User.create({ username, email, full_name, password: hashedPassword, role });
      const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET_KEY, { expiresIn: "7d" });
      return { token, user };
    },
    
    login: async (_, { username, password }, { models }) => {
      const user = await models.User.findOne({ username });
      if (!user || !(await argon2.verify(user.password, password))) {
        throw new AuthenticationError("Invalid credentials");
      }
      const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET_KEY, { expiresIn: "7d" });
      return { token, user };
    },
     createTest: async (_, {
      batch_number,
      sample_id, date,
      product,
      ph_level,
      tds_level,
      chlorine,
      turbidity,
      conductivity,
      temperature,
      microbioligy_test,
      chemical_test,
      physical_test,
      note}, { models, user }) => {
        if (!user || !["ADMIN", "LABORATORY"].includes(user.role)) {
  throw new ForbiddenError("Only admins or laboratory users can add tests");}
      return await models.Test.create({  batch_number,
      sample_id, date, product,  ph_level,  tds_level, chlorine, turbidity, conductivity,  temperature,  microbioligy_test, chemical_test, physical_test, note });
    },
   

    createProduction: async (_, { date, shift, product, planed_quantity, supervisor, note}, {models, user})=>{
       if (!user || user.role !== 'ADMIN') {
        throw new ForbiddenError('Access denied. Admins only.');
      }
      return await models.Production.create({ date, shift, product, planed_quantity, supervisor, note})
    }
   
    
      }
    
};

export default resolvers;
