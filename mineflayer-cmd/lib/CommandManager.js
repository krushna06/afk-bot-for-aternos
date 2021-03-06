"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandManager = void 0;
const Command_1 = require("./Command");
const Tokenizer_1 = require("./Tokenizer");
class CommandManager {
    constructor() {
        this.commands = [];
    }
    registerCommand(cmdName, handler, help = "") {
        const command = new Command_1.Command(cmdName, handler, help);
        this.commands.push(command);
        return command;
    }
    run(sender, command, cb) {
        const tokens = Tokenizer_1.parseTokens(command);
        if (tokens.length === 0) {
            cb(new Error("Cannot parse empty string!"));
            return;
        }
        const cmd = this.commands.find(c => c.name === tokens[0]);
        if (!cmd) {
            cb(new Error("Command not found!"));
            return;
        }
        try {
            const { flags, args } = Tokenizer_1.extractElements(tokens, cmd);
            cmd.handler(sender, flags, args, cb);
        }
        catch (err) {
            cb(err);
        }
    }
}
exports.CommandManager = CommandManager;
