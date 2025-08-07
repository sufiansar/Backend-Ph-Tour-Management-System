"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Isactive = exports.Role = void 0;
var Role;
(function (Role) {
    Role["SUPER_ADMIN"] = "SUPER_ADMIN";
    Role["ADMIN"] = "ADMIN";
    Role["USER"] = "USER";
    Role["GUIDE"] = "GUIDE";
})(Role || (exports.Role = Role = {}));
var Isactive;
(function (Isactive) {
    Isactive["ACTIVE"] = "ACTIVE";
    Isactive["INACTIVE"] = "INACTIVE";
    Isactive["BLOCKED"] = "BLOCKED";
})(Isactive || (exports.Isactive = Isactive = {}));
