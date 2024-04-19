
import {Composer, Keyboard, session} from "grammy"
import userControllers from "../controllers/userControllers.js";
import moment from "moment-timezone";
const timezone = 'Asia/Tashkent';

const bot = new Composer();
const WORK_TIME = 'AUTO' // AUTO; ON; OFF;

bot.use(async (ctx, next)=>{
    let lang = await ctx.session.session_db.language_code
    if(!lang){
        let user_data =await userControllers.getUserInfoById(ctx.from.id);
        lang = user_data.data.languageCode;
        ctx.session.session_db.language_code = lang;
    }

    await ctx.i18n.setLocale(lang);
    await next();
})



bot.use(async (ctx, next)=>{
    const superAdminTelegramIdList = [];
    const overwriteCommandsList = [ctx.t('cancel_action_msg'), ctx.t('change-appeal_btn_text'), '/start', '/changelang'];
    if (overwriteCommandsList.includes(ctx.message?.text)) {
        const stats = await ctx.conversation.active();
        for (let key of Object.keys(stats)) {
            await ctx.conversation.exit(key);
        }
    }
    console.log(ctx.from.language_code)

    ctx.config = {
        superAdmin: superAdminTelegramIdList.includes(ctx.from?.id)
    }
   await next();
})



const checkWorkTime = ()=>{
    let time = new Date();
    let hour = moment(time).tz(timezone).format('HH');
    let minute = moment(time).tz(timezone).format('mm');
    let weekDay = new Date(time).getDay();
    let date = moment(time).tz(timezone).format('YYYY-MM-DD');
    if(WORK_TIME === 'OFF'){
        return  false;
    }else if(WORK_TIME === 'ON'){
        return  true;
    }else{
        let autoCheckWorkTime = ([6,7].includes(weekDay) || hour<9 || hour>=18);
        return  !autoCheckWorkTime
    }
}


bot.use(async (ctx, next)=>{
    let workTime = checkWorkTime();
    if(!workTime){
        await ctx.reply(ctx.t("bot-work-time-text"), {
            parse_mode:"HTML",
            reply_markup:new Keyboard()
                .text("🔒")
                .resized()
        })
    }
})







export default bot;