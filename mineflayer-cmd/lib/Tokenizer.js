"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractElements = exports.parseTokens = void 0;
function parseTokens(input) {
    const tokens = [];
    const regex = /([^\s"']+)|"([^"]*)"|'([^']*)'/g;
    let match;
    do {
        match = regex.exec(input);
        if (match)
            tokens.push(match[3] || match[2] || match[1]);
    } while (match);
    return tokens;
}
exports.parseTokens = parseTokens;
function extractElements(tokens, command) {
    const flags = {};
    const args = [];
    for (let i = 1; i < tokens.length; i++) {
        if (tokens[i].startsWith('--')) {
            const flagName = tokens[i].substring(2);
            const flagDef = command.flags.find(f => f.name === flagName);
            if (!flagDef)
                throw new Error(`Unknown flag '${flagName}'!`);
            const argCount = flagDef.argCount;
            if (i + argCount >= tokens.length)
                throw new Error(`${flagName} expects ${argCount} arguments. ${i + argCount - tokens.length + 1} provided.`);
            const flag = [];
            for (let j = i + 1; j <= i + argCount; j++)
                flag.push(tokens[j]);
            // @ts-ignore
            flags[flagName] = flag;
            i += argCount;
            continue;
        }
        args.push(tokens[i]);
    }
    return { flags, args };
}
exports.extractElements = extractElements;
