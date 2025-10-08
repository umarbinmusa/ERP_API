import { gql } from "apollo-server-express";

export default gql`
schema {
  query: Query
  mutation: Mutation
}

type User {
  id: ID!
  username: String!
  role: String! # Either "ADMIN" or "CASHIER"
}
   type Test {
    id: ID!
    batch_number: String
    sample_id: String
    date: String
    product: String
    ph_level: String
    tds_level: String
    chlorine: String
    turbidity: String
    conductivity: String
    temperature: String
    microbioligy_test: String
    chemical_test: String
    physical_test: String
    note: String
  }
    scalar Date
    type Production{
    id: ID!
    date: Date!
    shift: String
    product: String
    planed_quantity: String
    supervisor: String
    note: String
    }

     type Product {
    id: ID!
    name: String!
  }
 
type AuthPayload {
  token: String!
  user: User!
}


type Query {
  getUsers: [User!]! # Admin Only
  getTests: [Test!]!
  
}

type Mutation {
  signup(username: String!, password: String!, role: String!): AuthPayload!
  login(username: String!, password: String!): AuthPayload!
   createTest(
      batch_number: String
      sample_id: String
      product: ID!
      ph_level: String
      tds_level: String
      chlorine: String
      turbidity: String
      conductivity: String
      temperature: String
      microbioligy_test: String
      chemical_test: String
      physical_test: String
      note: String
    ): Test
    createProduction(
    date: Date
    shift: String
    product: String
    planed_quantity: String
    supervisor: String
    note: String
    ): Production
  }

   

`;
