import argon2 from "argon2";
import { GraphQLDateTime } from "graphql-scalars";
import jwt from "jsonwebtoken";
import mongoose, { model } from "mongoose";
import dotenv from "dotenv";
import { requireRole } from "../../utils/requireRole.js";

import { AuthenticationError, ForbiddenError } from "apollo-server-express";
import User from "../../models/user.js";
import Consultation from "../../models/consultation.js";

const CONSULTANT_RESTRICTED = false; 



dotenv.config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const resolvers = {
  Query: {
    getUsers: async (_, __, { models, user }) => {
      if (!user || user.role !== "ADMIN") {
        throw new ForbiddenError("Access denied. Admins only.");
      }
      return await models.User.find();
    },
    
  },

  Mutation: {
    signup: async (
      _,
      { username, password, role, email, full_name },
      { models }
    ) => {
      if (!username || !password || !role) {
        throw new AuthenticationError("All fields are required");
      }
      const existingUser = await models.User.findOne({ username });
      if (existingUser) throw new AuthenticationError("Username already taken");
      const hashedPassword = await argon2.hash(password);
      const user = await models.User.create({
        username,
        email,
        full_name,
        password: hashedPassword,
        role,
      });
      const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET_KEY, {
        expiresIn: "7d",
      });
      return { token, user };
    },

    login: async (_, { username, password }, { models }) => {
      const user = await models.User.findOne({ username });
      if (!user || !(await argon2.verify(user.password, password))) {
        throw new AuthenticationError("Invalid credentials");
      }
      const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET_KEY, {
        expiresIn: "7d",
      });
      return { token, user };
    },
    
       createConsultation: async (
      _,
      { patientId, symptoms, diagnosis, prescription, followUpDate },
      { user }
    ) => {
      //  Ensure user has role
      requireRole(user, ["ADMIN", "CONSULTANT"]);

      console.log("createConsultation called by:", user.full_name, user.role);
      console.log("patientId:", patientId);

      //  Validate patientId
      if (!mongoose.Types.ObjectId.isValid(patientId)) {
        throw new Error("Invalid patient ID");
      }

      //  Find patient in User collection
      let patient;

      if (user.role === "ADMIN") {
        // Admin can access any patient
        patient = await User.findOne({ _id: patientId, role: "PATIENT" });
      } else if (user.role === "CONSULTANT") {
        if (CONSULTANT_RESTRICTED) {
          // Only patients this consultant created
          patient = await User.findOne({
            _id: patientId,
            role: "PATIENT",
            createdBy: user.id
          });
        } else {
          // Can access any patient
          patient = await User.findOne({ _id: patientId, role: "PATIENT" });
        }
      }

      if (!patient) {
        console.log("Patient not found for ID:", patientId);
        throw new Error("Patient not found");
      }

      //  Create consultation
      const consultation = new Consultation({
        patient: patient._id,
        consultant: user.id,
        symptoms,
        diagnosis,
        prescription,
        followUpDate
      });

      await consultation.save();

      // Populate related fields separately
      await consultation.populate("patient", "full_name email role");
      await consultation.populate("consultant", "full_name role");

      return consultation;
    },
  },
};

export default resolvers;
