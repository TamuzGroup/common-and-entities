import {
  AnyObject,
  Document,
  EnforceDocument,
  LeanDocument,
  Model,
  QueryWithHelpers,
  Types,
  _AllowStringsForIds,
} from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import moment from "moment";
import { roles, RoleNames } from "../config/roles";
import paginate, { PaginationFunc } from "./plugins/paginate.plugin";
import toJSON from "./plugins/toJSON.plugin";
import logger from "../utils/logger.util";
import config from "../config/config";
import { getMongooseInstance } from "../mongooseInstance";

const mongooseInstance = getMongooseInstance();

export interface IUser {
  name: {
    first: string;
    last: string;
  };
  email: string;
  password: string;
  idNumber: string;
  dateOfBirth: Date;
  role: RoleNames;
  isEmailVerified: boolean;
  phoneNumber: string;
  otp: {
    passcode: string;
    created: Date;
  };
}

/**
 * Methods of the Mongoose DB IUser objects.
 */
export interface IUserMethods {
  isPasswordMatch: (password: string) => Promise<boolean>; // eslint-disable-line no-unused-vars
  isOtpPasscodeMatch: (passcode: string) => Promise<boolean>;
}

/**
 * Moogoose DB IUser model type with methods.
 */
/* eslint-disable no-unused-vars */
export interface IUserModel
  extends Model<IUser, Record<string, never>, IUserMethods> {
  isEmailTaken: (
    email: string,
    excludeUserId?: string | Types.ObjectId
  ) => Promise<boolean>;
  paginate?: PaginationFunc<IUser, IUserMethods>;
}
/* eslint-enable no-unused-vars */

/**
 * Mongoose DB IUser document type with methods.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type IUserDoc = IUser &
  Document<Record<string, any>, Record<string, never>, IUser> &
  IUserMethods;

/**
 * Mongoose DB Query IUser return type.
 */
export type IUserQueryWithHelper = QueryWithHelpers<
  EnforceDocument<IUser, IUserMethods> | null,
  EnforceDocument<IUser, IUserMethods>,
  Record<string, never>,
  IUser
>;

/**
 * Moogoose DB general IUser parameter type.
 */
export type IUserLeanDoc =
  | IUser
  | _AllowStringsForIds<LeanDocument<IUser>>
  | AnyObject;

const userSchema = new mongooseInstance.Schema<IUser, IUserModel>(
  {
    name: {
      first: {
        type: String,
        required: true,
        trim: true,
      },
      last: {
        type: String,
        required: true,
        trim: true,
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value: string) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email");
        }
      },
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    idNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate(value: string) {
        if (!validator.isLength(value, { min: 9, max: 9 })) {
          throw new Error("Invalid id number");
        }
      },
    },
    otp: {
      passcode: {
        type: String,
      },
      created: {
        type: Date,
      },
      private: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value: string) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error(
            "Password must contain at least one letter and one number"
          );
        }
      },
      private: true, // used by the toJSON plugin
    },
    role: {
      type: String,
      enum: roles,
      default: "user",
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
    },
    address: {
      city: String,
      street: String,
      streetNum: String,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

userSchema.static({
  /**
   * Check if email is taken
   * @param {string} email - The user's email
   * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
   * @returns {Promise<boolean>}
   */
  async isEmailTaken(
    email: string,
    excludeUserId?: Types.ObjectId
  ): Promise<boolean> {
    const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
    return !!user;
  },
});

userSchema.method({
  /**
   * Check if password matches the user's password
   * @param {string} password
   * @returns {Promise<boolean>}
   */
  async isPasswordMatch(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  },

  async isOtpPasscodeMatch(passcode: string): Promise<boolean> {
    const otpCreation = this.otp.created;

    if (
      moment()
        .subtract(config.otpExpirationInMinutes, "minutes")
        .isAfter(moment(otpCreation))
    ) {
      logger.info(`OTP expired for user ${this.id}`);
      throw new Error();
    }

    return bcrypt.compare(passcode, this.otp.passcode);
  },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }

  if (this.isModified("otp")) {
    this.otp.passcode = await bcrypt.hash(this.otp.passcode, 8);
  }
  next();
});

/**
 * IUser model typed IUserModel instance
 */

const UserModel: IUserModel = mongooseInstance.model<IUser, IUserModel>(
  "User",
  userSchema
);

export default UserModel;
