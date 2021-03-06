import { CommandHandler } from "./CommandManager";
export declare class Command {
    readonly name: string;
    readonly handler: CommandHandler;
    readonly help: string;
    readonly flags: Flag[];
    constructor(name: string, handler: CommandHandler, help: string);
    addFlag(name: string, argCount: number): Command;
}
interface Flag {
    name: string;
    argCount: number;
}
export {};
