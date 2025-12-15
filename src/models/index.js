import mongoose from 'mongoose';
import User from './user';
import Test from './test';
import Production from './production';
import Drug from './drug';
import Branch from './branch';
import Patient from './patient';
import Order from './order';Drug
import DrugPurchase from './drugPurchase'; 

const models = { User, Test, Production, Drug, Branch, Patient, Order ,DrugPurchase }; 

export default models;
