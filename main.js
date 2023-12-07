// ⚠️ Only modify this file if you know what you're doing!
const { Bot } = require("./bot");

function send(channel, botInstanceId, payload) {
  let message = `\n<<zilch>>.${channel}`;

  if (botInstanceId) {
    message += "." + botInstanceId;
  }

  if (payload) {
    message += "." + payload;
  }

  message += "\n";

  process.stderr.write(message);
}

function parsePayload(payload) {
  const [eastPaddleX, eastPaddleY, westPaddleX, westPaddleY, ballX, ballY] =
    payload.split(",").map((value) => {
      return parseFloat(value);
    });

  return [
    {
      x: eastPaddleX,
      y: eastPaddleY,
    },
    {
      x: westPaddleX,
      y: westPaddleY,
    },
    {
      x: ballX,
      y: ballY,
    },
  ];
}

const bots = new Map();

process.stdin.on("data", async (chunk) => {
  const data = chunk.toString().trim();
  const [channel, botInstanceId] = data.split(".", 2);
  const payload = data.slice(channel.length + botInstanceId.length + 2);

  if (channel === "start") {
    const standardCustomConfigSplit = payload.indexOf(".");
    const standardConfigParts = payload
      .slice(0, standardCustomConfigSplit)
      .split(",");

    const config = {
      botInstanceId,
      gameTimeLimit: parseInt(standardConfigParts[0]),
      turnTimeLimit: parseInt(standardConfigParts[1]),
      paddle: standardConfigParts[2] === "0" ? "east" : "west",
    };

    bots.set(botInstanceId, new Bot(config));

    send("start", botInstanceId);
    return;
  }

  const bot = bots.get(botInstanceId);

  if (!bot) {
    throw new Error("No bot runner with id " + botInstanceId);
  }

  if (channel === "move") {
    const move = await bot.move(...parsePayload(payload));
    send("move", botInstanceId, move);
    return;
  }

  if (channel === "end") {
    await bot.end(...parsePayload(payload));
    bots.delete(botInstanceId);
    return;
  }
});

send("ready");
