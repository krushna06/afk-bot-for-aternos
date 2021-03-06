var mineflayer = require('mineflayer');
var blockFinderPlugin = require('..')(mineflayer);
if(process.argv.length<4 || process.argv.length>6)
{
  console.log("Usage : node diamondFinder.js <host> <port> [<name>] [<password>]");
  process.exit(1);
}
var bot = mineflayer.createBot({
  username: process.argv[4] ? process.argv[4] : "diamondFinder",
  viewDistance: "tiny",
  verbose: true,
  port:parseInt(process.argv[3]),
  host:process.argv[2],
  password:process.argv[5]
});

// Install the plugin
blockFinderPlugin(bot);

// Sample usage
bot.once('spawn', function() {
  bot.findBlock({
    point: bot.entity.position,
    matching: 56,
    maxDistance: 256,
    count: 1,
  }, function(err, blockPoints) {
    if (err) {
      bot.chat('Error trying to find Diamond Ore: ' + err);
      bot.quit('quitting');
      return;
    }
    if (blockPoints.length) {
      console.log(blockPoints[0].position);
      bot.chat('I found a Diamond Ore block at ' + blockPoints[0].position + '.');
      bot.quit('quitting');
      return;
    } else {
      bot.chat("I couldn't find any Diamond Ore blocks within 256.");
      bot.quit('quitting');
      return;
    }
  });
});
