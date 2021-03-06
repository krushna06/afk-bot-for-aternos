# mineflayer-blockfinder

A library to help your mineflayer bot find blocks in the 3D world.

See [mineflayer](https://github.com/PrismarineJS/mineflayer).

## Usage

```js
var mineflayer = require('mineflayer');
var blockFinderPlugin = require('mineflayer-blockfinder')(mineflayer);
var bot = mineflayer.createBot({username: 'Player'});

// Install the plugin
blockFinderPlugin(bot);

// Sample usage
bot.once('spawn', function() {
  bot.findBlock({
    point: bot.entity.position,
    matching: 56,
    maxDistance: 256,
    count: 1,
  }, function(err, blocks) {
    if (err) {
      return bot.chat('Error trying to find Diamond Ore: ' + err);
      bot.quit('quitting');
      return;
    }
    if (blocks.length) {
      bot.chat('I found a Diamond Ore block at ' + blocks[0].position + '.');
      bot.quit('quitting');
      return;
    } else {
      bot.chat("I couldn't find any Diamond Ore blocks within 256.");
      bot.quit('quitting');
      return;
    }
  });
});
```

## Dependencies

 * [Mineflayer](https://github.com/PrismarineJS/mineflayer)

## Installation

`npm install mineflayer-blockfinder`

Or clone and cd into the directory

`npm install .`

Windows: You will need to install:

 * Python 2.5+ (but < 3.0): https://www.python.org/downloads/

 * Visual C++ 2015 build tools: http://landinghub.visualstudio.com/visual-cpp-build-tools

 * A version of Visual Studio: https://www.visualstudio.com/vs/community/

 * An older version of OpenSSL (bitness needs to match your installation of nodejs)

   ** 64-bit: http://slproweb.com/download/Win64OpenSSL-1_0_2k.exe

   ** 32-bit: http://slproweb.com/download/Win32OpenSSL-1_0_2k.exe

## Documentation

### bot.findBlock(options, callback)

Finds the nearest block(s) to the given point.
 * `options` - Additional options for the search:
   - `point` - The start position of the search.
   - `matching` - A function that returns true if the given block is a match.  Also supports this value being a block id or array of block ids.
   - `maxDistance` - The furthest distance for the search, defaults to 64.
   - `count` - The number of blocks to find at most, defaults to 1.
 * `callback` - A callback function to get the result.  Function signature:

```
function(err, arrayOfPoints)
```

### bot.findBlockSync(options)

Finds the nearest block(s) to the given point synchronously.
 * `options` - See `bot.findBlock`.

## History

### 0.0.7

 * DiamondFinder tested working, fix another issue related to recursion.

### 0.0.6

 * Fix recursion issue (thanks to rom1504)

### 0.0.5

 * Added new OctahedronIterator class, a fast finder algorithm that always returns the closest block, and is comparable with the cube algorithm.

### 0.0.4

 * Reverted algorithm to use the old, fast cube algorithm.

### 0.0.3

 * Fix 'matching' option to allow for array of ids instead of crashing.

### 0.0.2

 * Refactored algorithm to use an Iterator approach, to allow for re-useable code.
 * Rewrote block finding algorithm to guarantee the closest block is always found first.
 * Matching argument now takes an array of block ids, instead of block enums.
