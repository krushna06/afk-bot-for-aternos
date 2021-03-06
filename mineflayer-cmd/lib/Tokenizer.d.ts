import { Command } from './Command';
interface CommandElements {
    flags: any;
    args: string[];
}
export declare function parseTokens(input: string): string[];
export declare function extractElements(tokens: string[], command: Command): CommandElements;
export {};
