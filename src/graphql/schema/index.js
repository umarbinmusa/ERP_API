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
    category: String
    description: String
    price: Float!
    stock: Int!
    createdBy: User
    createdAt: String
    updatedAt: String
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
    type Appointment {
  id: ID!
  patient: User!
  consultant: User!
  reason: String!
  appointmentDate: String!
  status: String!
  createdAt: String!
}

input CreateAppointmentInput {
  consultantId: ID!
  reason: String!
  appointmentDate: String!
}
  


 



  


  input PrescriptionInput {
    herbName: String
    dosage: String
    frequency: String
    duration: String
  }

  input CreateDrugInput {
    name: String!
    category: String
    description: String
    price: Float!
    stock: Int
  }
  input BuyDrugInput {
    drugId: ID!
    quantity: Int!
  }
  input UpdateAppointmentStatusInput {
  appointmentId: ID!
  status: String!
}


  type DrugPurchase {
    id: ID!
    user: User!
    drug: Drug!
    quantity: Int!
    unitPrice: Float!
    totalPrice: Float!
    createdAt: String
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
    getDrugs: [Drug!]!
    getDrug(id: ID!): Drug
    getPatients: [User!]!
    myConsultations: [Consultation!]!
     consultationById(id: ID!): Consultation
  myPatients: [User!]!
   getMyAppointments: [Appointment!]!
  getConsultations: [Consultation!]!
   getConsultantAppointments: [Appointment]
   getAppointments: [Appointment!]!
   myAppointments: [Appointment!]!
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
    createAppointment(input: CreateAppointmentInput!): Appointment!
    updateAppointmentStatus(input: UpdateAppointmentStatusInput!): Appointment



    createConsultation(
      patientId: ID!
      symptoms: String!
      diagnosis: String!
      prescription: [PrescriptionInput]
      followUpDate: String
    ): Consultation
    createDrug(input: CreateDrugInput!): Drug!
    buyDrug(input: BuyDrugInput!): DrugPurchase!
  }
`;
