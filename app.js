const { App } = require("@slack/bolt");

// Initializes your app with your bot token and signing secret
/*const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode:true, // enable the following to use socket mode
  appToken: process.env.APP_TOKEN
});*/
const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    socketMode:true, // enable the following to use socket mode
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    appToken: process.env.APP_TOKEN
  });

app.command("/ranking", async ({ command, ack, say }) => {
    try {
      await ack();
      say("ranking is : ");
    } catch (error) {
        console.log("err")
      console.error(error);
    }
});
app.message(/\/from\(@(.*)\)/, async ({ command, say }) => {
    try {
      say("Yaaay 1! that command works!");
    } catch (error) {
        console.log("err")
      console.error(error);
    }
});
app.message("/from", async ({ command, say }) => {
    try {
      const data = command.text;
      say(`Yaaay 2! that command works! with data => ${data}`);
    } catch (error) {
        console.log("err")
      console.error(error);
    }
});

(async () => {
  const port = 3000
  // Start your app
  await app.start(process.env.PORT || port);
  console.log(`⚡️ Slack Bolt app is running on port ${port}!`);
})();