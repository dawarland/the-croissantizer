import { RTMClient }  from '@slack/rtm-api'
import { SLACK_OAUTH_TOKEN, BOT_SPAM_CHANNEL } from './constants'
import  { WebClient } from '@slack/web-api';
const fs = require('fs')
const packageJson = require('../package.json')

const rtm = new RTMClient(SLACK_OAUTH_TOKEN);
const web = new WebClient(SLACK_OAUTH_TOKEN);

rtm.start()
  .catch(console.error);

rtm.on('ready', async () => {
    console.log('bot started')
    //sendMessage(BOT_SPAM_CHANNEL, `Bot version ${packageJson.version} is online.`)
})

rtm.on('slack_event', async (eventType, event) => {
    if (event && event.type === 'message'){
        console.log({event})
        if (event.text.includes('!ranking') && (!(event.username) || (event.username && !(event.username.includes('Croissantizer')))  ) ) {
            getRanking(event.channel, event.user)
        }
    }
    else if(event && event.type=="desktop_notification"){
        console.log({event})
        // si croissantizer est identifié, c'est un croissantage !
        if (event.content.includes('@Croissantizer') && event.content.includes(':') && event.subtitle && !(event.subtitle.includes('Croissantizer (bot)'))){
            const victim = "@"+event.content.split(':')[0]
            let from = "" ;
            let day;
            if (event.content.includes('!from')) {
                const m = event.content.match(/\!from\(?(.+)\)/gi)
                from = m ? m[0].split('(')[1].slice(0, -1) : "";   
            }
            if (event.content.includes('!day')) {
                const m = event.content.match(/\!from\(?(.+)\)/gi)
                day = m ? m[0].split('(')[1].slice(0, -1) : "";   
            }
            croissantage(event.channel, victim, from, day)
        }
    }
})


async function croissantage(channelId, victim, from, day) {
    await fs.readFile('./db/ranking.json', 'utf8', function (err,data) {
        if (err) {
          return console.log(err);
        }
        console.log({victim,from})
        let ranking;
        const buf = Buffer.from(data);
        const results = JSON.parse(buf.toString('utf-8'));

        let victimToModified = results.find(x=>x.name.includes(victim));
        if(victimToModified){
            ranking = results.map(x=> victimToModified.name == x.name ? {...x,quantity:x.quantity+1} :x)
        }else{
            ranking = [...results,{name:victim,quantity:1,shoot:0}]
        }

        let fromToModified = ranking.find(x=>x.name.includes(from));
        if(from){
            if(fromToModified){
                ranking = ranking.map(x=> fromToModified.name == x.name ? {...x,shoot:x.shoot+1} :x)
            }else{
                ranking = [...ranking,{name:from,quantity:0,shoot:1}]
            }
        }

        console.log({ranking})
        fs.writeFile('./db/ranking.json', JSON.stringify(ranking), 'utf8', function (err) {
           if (err) return console.log(err);
        });
        return;
    });
    const randomAnswer = await getRandomAnswer();
    sendMessage(channelId, `${randomAnswer}${day?` Rendez-vous le ${getNext(day)}!`:""}${from?` From ${from} 🎯`:""}`)
      
}
function getRanking (channelId, userId) {
    fs.readFile('./db/ranking.json', function(err, data) {
        if (err) {
            return console.log(err);
        }
        const buf = Buffer.from(data);
        const ranking = JSON.parse(buf.toString('utf-8')).sort((a,b) => b.quantity - a.quantity)
        console.log(`Ranking :\n ${ranking.map(x=>`${x.name} (${x.quantity} 🥐 / ${x.shoot} 🎯 )`).join('\n')}`)
        sendMessage(channelId, `Ranking :\n ${ranking.map(x=>`${x.name} (${x.quantity} 🥐 / ${x.shoot} 🎯 )`).join('\n')}`)
    });
}

function getRandomAnswer(){
    return new Promise((resolve, reject)=>{
        fs.readFile('./db/anwser.json', 'utf8', function (err,data) {
            if (err) {
                console.log(err);
                return reject(err);
            }
            const buf = Buffer.from(data);
            const anwser = JSON.parse(buf.toString('utf-8'));
            console.log({anwser})
            return resolve(anwser[Math.floor(Math.random()*anwser.length)])
        })
    })
}

function getNext(day){
    return ;
}
async function sendMessage(channel, message) {
    await web.chat.postMessage({
        channel: channel,
        text: message,
    })
}
