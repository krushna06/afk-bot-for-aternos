"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = void 0;
class Command {
    constructor(name, handler, help) {
        this.help = "";
        this.flags = [];
        this.name = name;
        this.handler = handler;
        this.help = help;
    }
    addFlag(name, argCount) {
        this.flags.push({ name, argCount });
        return this;
    }
}
exports.Command = Command;
