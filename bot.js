// 👉 Run "./connect" (or "connect.cmd" on Windows) in the terminal to get started.

class Bot {
  constructor(config) {
    this.config = config;
    console.log("Hello world!", this.config);
  }

  move(eastPaddle, westPaddle, ball) {
    // Determine which paddle you control.
    const paddle = this.config.paddle === "east" ? eastPaddle : westPaddle;

    // This prints the position of your paddle and the ball to the bot terminal.
    // Use these values to determine which direction your paddle should move so
    // you hit the ball!
    console.log("paddle", paddle.x, paddle.y);
    console.log("ball", ball.x, ball.y);

    // Return the direction you'd like to move here:
    // "north" "south" "east" "west" or "none"
    return "none";
  }

  end(eastPaddle, westPaddle, ball) {
    console.log("Good game!");
  }
}

module.exports.Bot = Bot;
