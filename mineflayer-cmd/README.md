<h1 align="center">mineflayer-cmd</h1>
<p align="center"><i>A simple command manager and handler for Mineflayer plugins.</i></p>

<p align="center">
  <img src="https://github.com/TheDudeFromCI/mineflayer-cmd/workflows/Build/badge.svg" />
  <img src="https://img.shields.io/npm/v/mineflayer-cmd" />
  <img src="https://img.shields.io/github/repo-size/TheDudeFromCI/mineflayer-cmd" />
  <img src="https://img.shields.io/npm/dm/mineflayer-cmd" />
  <img src="https://img.shields.io/github/contributors/TheDudeFromCI/mineflayer-cmd" />
  <img src="https://img.shields.io/github/license/TheDudeFromCI/mineflayer-cmd" />
</p>

---

### Getting Started

This plugin is built using Node and can be installed using:
```bash
npm install --save mineflayer-cmd
```

### Simple Bot

Loading the plugin can be done the same as any other plugin. Commands can also be loaded at any time.

```js
// Create your bot
const mineflayer = require("mineflayer");
const bot = mineflayer.createBot({ username: "Player" });

// Load the cmd plugin
const cmd = require('mineflayer-cmd').plugin

cmd.allowConsoleInput = true // Optional config argument
bot.loadPlugin(cmd)

// Register your custom command handlers, if desired (plugins can load them too)
function sayCommand(sender, flags, args, cb) {

  let message = ''

  if (flags.showsender) message += sender + ": "
  if (flags.color) message += '&' + flags.color[0]

  message += args.join(' ')
  bot.chat(message)

  cb()
}

bot.once('cmd_ready', () => {
  bot.cmd.registerCommand('say', sayCommand) // Create a new command called 'say' and set the executor function
         .addFlag('color', 1) // Add a flag called 'color' that expects 1 input
         .addFlag('showsender', 0) // Add a flag called 'showsender' that expects 0 inputs
})

// And listen for command inputs from any source
// Let's listen for chat events that start with "!"
bot.on('chat', (username, message) => {
  if (message.startsWith('!')) {
    const command = message.substring(1)
    bot.cmd.run(username, command) // Run with the sender and the command itself
  }
})
```

### Documentation

[API](https://github.com/TheDudeFromCI/mineflayer-cmd/blob/master/docs/api.md)

[Examples](https://github.com/TheDudeFromCI/mineflayer-cmd/tree/master/examples)

### License

This project uses the [MIT](https://github.com/TheDudeFromCI/mineflayer-cmd/blob/master/LICENSE) license.

### Contributions

This project is accepting PRs and Issues. See something you think can be improved? Go for it! Any and all help is highly appreciated!

For larger changes, it is recommended to discuss these changes in the issues tab before writing any code. It's also preferred to make many smaller PRs than one large one, where applicable.
