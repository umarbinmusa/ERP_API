import mongoose from 'mongoose';
import User from './user';
import Test from './test';
import production from './production';

const models = { User, Test, Production }; 

export default models;
