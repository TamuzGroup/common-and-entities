"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleRights = exports.roles = void 0;
const allRoles = Object.freeze({
    user: Object.freeze([]),
    admin: Object.freeze(["getUsers", "manageUsers"]),
});
exports.roles = Object.freeze(Object.keys(allRoles));
exports.roleRights = new Map(Object.entries(allRoles));
//# sourceMappingURL=roles.js.map