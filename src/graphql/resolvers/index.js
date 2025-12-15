import argon2 from "argon2";
import { GraphQLDateTime } from "graphql-scalars";
import jwt from "jsonwebtoken";
import mongoose, { model } from "mongoose";
import dotenv from "dotenv";
import { requireRole } from "../../utils/requireRole.js";

import { AuthenticationError, ForbiddenError } from "apollo-server-express";
import User from "../../models/user.js";
import Consultation from "../../models/consultation.js";
import Drug from "../../models/drug.js";
import DrugPurchase from "../../models/drugPurchase.js";

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
    getDrugs: async () => {
      return await Drug.find().sort({ createdAt: -1 });
    },
    getPatients: async (_, __, { user }) => {
      requireRole(user, ["ADMIN", "CONSULTANT"]);

      return await User.find({ role: "PATIENT" }).sort({
        createdAt: -1
      });
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

      
      await consultation.populate("patient", "full_name email role");
      await consultation.populate("consultant", "full_name role");

      return consultation;
    },
     createDrug: async (_, { input }, { user }) => {
      
      requireRole(user, ["ADMIN"]);

      const { name, category, description, price, stock } = input;

      
      if (price < 0) {
        throw new Error("Price cannot be negative");
      }

      if (stock < 0) {
        throw new Error("Stock cannot be negative");
      }

   
      const drug = new Drug({
        name,
        category,
        description,
        price,
        stock,
        createdBy: user.id
      });

      await drug.save();

   
      await drug.populate("createdBy", "full_name role");

      return drug;
    },
    buyDrug: async (_, { input }, { user }) => {
      // 1️⃣ Only PATIENT can buy drugs
      requireRole(user, ["PATIENT"]);

      const { drugId, quantity } = input;

      // 2️⃣ Validate inputs
      if (!mongoose.Types.ObjectId.isValid(drugId)) {
        throw new Error("Invalid drug ID");
      }

      if (quantity <= 0) {
        throw new Error("Quantity must be greater than zero");
      }

      // 3️⃣ Find drug
      const drug = await Drug.findById(drugId);

      if (!drug) {
        throw new Error("Drug not found");
      }

      // 4️⃣ Check stock
      if (drug.stock < quantity) {
        throw new Error("Insufficient stock");
      }

      // 5️⃣ Calculate prices
      const unitPrice = drug.price;
      const totalPrice = unitPrice * quantity;

     
      drug.stock -= quantity;
      await drug.save();

    
      const purchase = new DrugPurchase({
        user: user.id,
        drug: drug._id,
        quantity,
        unitPrice,
        totalPrice
      });

      await purchase.save();

      
      
      await purchase.populate("user", "full_name email role");
      await purchase.populate("drug", "name price");

      return purchase;
    }
  
  },
};

export default resolvers;
