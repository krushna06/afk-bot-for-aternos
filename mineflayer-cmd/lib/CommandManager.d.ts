import { Command } from './Command';
export declare type Callback = (err?: Error) => void;
export declare type CommandHandler = (sender: string, flags: any, args: string[], cb: Callback) => void;
export declare class CommandManager {
    private readonly commands;
    registerCommand(cmdName: string, handler: CommandHandler, help?: string): Command;
    run(sender: string, command: string, cb: Callback): void;
}
