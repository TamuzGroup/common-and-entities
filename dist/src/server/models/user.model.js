"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validator_1 = __importDefault(require("validator"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const moment_1 = __importDefault(require("moment"));
const roles_1 = require("../config/roles");
const paginate_plugin_1 = __importDefault(require("./plugins/paginate.plugin"));
const toJSON_plugin_1 = __importDefault(require("./plugins/toJSON.plugin"));
const logger_util_1 = __importDefault(require("../utils/logger.util"));
const config_1 = __importDefault(require("../config/config"));
const mongooseInstance_1 = require("../mongooseInstance");
const mongooseInstance = mongooseInstance_1.getMongooseInstance();
const userSchema = new mongooseInstance.Schema({
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
        validate(value) {
            if (!validator_1.default.isEmail(value)) {
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
        validate(value) {
            if (!validator_1.default.isLength(value, { min: 9, max: 9 })) {
                throw new Error("Invalid id number");
            }
        },
    },
    otp: {
        passcode: {
            type: String,
            private: true,
        },
        created: {
            type: Date,
            private: true,
        },
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8,
        validate(value) {
            if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
                throw new Error("Password must contain at least one letter and one number");
            }
        },
        private: true, // used by the toJSON plugin
    },
    role: {
        type: String,
        enum: roles_1.roles,
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
}, {
    timestamps: true,
});
// add plugin that converts mongoose to json
userSchema.plugin(toJSON_plugin_1.default);
userSchema.plugin(paginate_plugin_1.default);
userSchema.static({
    /**
     * Check if email is taken
     * @param {string} email - The user's email
     * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
     * @returns {Promise<boolean>}
     */
    async isEmailTaken(email, excludeUserId) {
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
    async isPasswordMatch(password) {
        return bcryptjs_1.default.compare(password, this.password);
    },
    async isOtpPasscodeMatch(passcode) {
        const otpCreation = this.otp.created;
        if (moment_1.default()
            .subtract(config_1.default.otpExpirationInMinutes, "minutes")
            .isAfter(moment_1.default(otpCreation))) {
            logger_util_1.default.info(`OTP expired for user ${this.id}`);
            throw new Error();
        }
        return bcryptjs_1.default.compare(passcode, this.otp.passcode);
    },
});
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcryptjs_1.default.hash(this.password, 8);
    }
    if (this.isModified("otp")) {
        this.otp.passcode = await bcryptjs_1.default.hash(this.otp.passcode, 8);
    }
    next();
});
/**
 * IUser model typed IUserModel instance
 */
const UserModel = mongooseInstance.model("User", userSchema);
exports.default = UserModel;
//# sourceMappingURL=user.model.js.map