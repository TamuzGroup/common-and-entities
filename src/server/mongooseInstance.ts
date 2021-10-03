import { Mongoose } from "mongoose";

let mongooseInstance: Mongoose;

export const setMongooseInstance = (instance: Mongoose): void => {
  mongooseInstance = instance;
};

export const getMongooseInstance = (): Mongoose => {
  if (!mongooseInstance) throw new Error("Mongoose instance is undefined");

  return mongooseInstance;
};
