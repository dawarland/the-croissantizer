const { App } = require("@slack/bolt");
require("dotenv").config();

// Initializes your app with your bot token and signing secret
/*const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode:true, // enable the following to use socket mode
  appToken: process.env.APP_TOKEN
});*/
const app = new App({
    token: 'xoxb-1208966967986-3483809358053-aoKNRDcoaxW0P5XLfW6aZDL8',//process.env.SLACK_BOT_TOKEN,
    socketMode:true, // enable the following to use socket mode
    signingSecret: 'b2b62a402e4cbc9251c95d42d6e1bf9f',//process.env.SLACK_SIGNING_SECRET,
    appToken: 'xapp-1-A03E7FS1ZNZ-3486578176018-ee04d35e197f401d95fd3f6e2716e3e173a117f5ba1d3b49015cc6e91d162d60'//process.env.APP_TOKEN,
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