"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.plugin = void 0;
const CommandManager_1 = require("./CommandManager");
const ConsoleInput_1 = require("./ConsoleInput");
function plugin(bot) {
    // @ts-ignore
    bot.cmd = new CommandManager_1.CommandManager();
    // @ts-ignore
    if (plugin.allowConsoleInput)
        ConsoleInput_1.startConsoleInput(bot);
    // @ts-ignore
    setTimeout(() => bot.emit('cmd_ready'), 0);
}
exports.plugin = plugin;
