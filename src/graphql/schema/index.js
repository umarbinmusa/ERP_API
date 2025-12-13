import { gql } from "apollo-server-express";

export default gql`
  schema {
    query: Query
    mutation: Mutation
  }

  type User {
    id: ID!
    username: String!
    email: String
    full_name: String
    password: String!
    role: String!
    permissions: [String]
    isActive: Boolean
    createdAt: String
    lastLogin: String
  }
  type Patient {
    id: ID!
    name: String!
    age: Int
    phone: String
    history: [String]
    createdAt: Date
  }

  type Drug {
    id: ID!
    name: String!
    description: String
    unitPrice: Float
    stock: Int
    createdAt: Date
  }
type Prescription {
  herbName: String
  dosage: String
  frequency: String
  duration: String
}

type Consultation {
  id: ID!
  patient: Patient
  consultant: User
  symptoms: String
  diagnosis: String
  prescription: [Prescription]
  followUpDate: String
  createdAt: String
}

input PrescriptionInput {
  herbName: String
  dosage: String
  frequency: String
  duration: String
}

  

  
  type Order {
    id: ID!
    customer: String
  }

  scalar Date
  

  
  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    getUsers: [User!]! # Admin Only
   
  }

  type Mutation {
    signup(
      username: String!
      email: String!
      full_name: String!
      password: String!
      role: String!
    ): AuthPayload!
    login(username: String!, password: String!): AuthPayload!
    
    
    
    addDrug(
      name: String!
      description: String
      unitPrice: Float
      stock: Int
    ): Drug
    updateDrug(
      id: ID!
      name: String
      description: String
      unitPrice: Float
      stock: Int
    ): Drug
    deleteDrug(id: ID!): Boolean
     createConsultation(
    patientId: ID!
    symptoms: String!
    diagnosis: String!
    prescription: [PrescriptionInput]
    followUpDate: String
  ): Consultation
  
    
}
`;
