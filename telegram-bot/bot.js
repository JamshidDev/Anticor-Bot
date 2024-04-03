import { Bot, webhookCallback} from "grammy"
import dotenv from 'dotenv';
dotenv.config();


import adminModule from "./modules/adminModule.js"
import clientModule from "./modules/clientModule.js"
import configModule from "./modules/configModule.js"
import channelModule from "./modules/channelModule.js"
import overwriteCommandsModule from "./modules/overwriteCommandsModule.js";






let _TOKEN = process.env.BOT_TOKEN;
let _DOMAIN = process.env.DOMAIN_URL;
let _WEBHOOK_URL = `${_DOMAIN}/${_TOKEN}`;
const allow_updates = ["my_chat_member", "chat_member", "message", "callback_query", "inline_query"];




 const bot = new Bot('6195186408:AAFh9FYhoJNJqtteYIx6tZ8rTccwq2vTD3U');





bot.use(configModule);
bot.use(overwriteCommandsModule);
bot.use(channelModule);
bot.filter(async (ctx)=> !ctx.config.superAdmin).use(clientModule);
bot.filter(async (ctx)=> ctx.config.superAdmin).use(adminModule);












bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`Error while handling update ${ctx.update.update_id}:`);
});

let token = _TOKEN;
// bot.api.setWebhook(_WEBHOOK_URL, allow_updates).then((res)=>{
//     console.log(`Webhook bot set to ${_WEBHOOK_URL}`);
// }).catch((error)=>{
//     console.log(error)
// });
// export {bot, token};

bot.start(allow_updates)

