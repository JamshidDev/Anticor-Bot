
import {Composer, Keyboard, session} from "grammy"
import userControllers from "../controllers/userControllers.js";
import moment from "moment-timezone";
import adminModule from "./adminModule.js";
const timezone = 'Asia/Tashkent';

const bot = new Composer();
var WORK_TIME = 'AUTO' // AUTO; ON; OFF;

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
    const superAdminTelegramIdList = [5604998397];
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
        let autoCheckWorkTime =hour<9 || hour>=18;
        return  !autoCheckWorkTime;
    }else{
        let autoCheckWorkTime = ([6,7].includes(weekDay) || hour<9 || hour>=18);
        return  !autoCheckWorkTime
    }
}


bot.filter(async (ctx)=> !ctx.config.superAdmin).use(async (ctx, next)=>{
    let workTime = checkWorkTime();
    if(!workTime){
        await ctx.reply(ctx.t("bot-work-time-text"), {
            parse_mode:"HTML",
            reply_markup:new Keyboard()
                .text("🔒")
                .resized()
        })
    }else{
        await next();
    }
})









bot.filter(async (ctx)=> ctx.config.superAdmin).command('start', async (ctx)=>{

    await ctx.reply(    `
<b>Admin menyu</b>
   
<i>Botni sozlash</i> 
<i>🟢 ON - Ish vaqtini boshlash</i>
<i>🔴 OFF - Ish vaqtini yopish</i>
<i>🤖 AUTO - Ish vaqtini botga topshirish</i>

<i>♻️ Bot holat: <b>${WORK_TIME}</b></i>
    `,{
        parse_mode:"HTML",
        reply_markup:new Keyboard()
            .text("🟢 ON")
            .text("🔴 OFF")
            .row()
            .text("🤖 AUTO")
            .resized()
    });
});



bot.filter(async (ctx)=> ctx.config.superAdmin).hears("🔴 OFF", async (ctx)=>{
    await ctx.reply(" Ish vaqti yopildi (🔴 OFF)")
    WORK_TIME = 'OFF'
    await ctx.reply(`
♻️ Ish vaqti boshlandi (🟢 ON)
Ish kuni <b>⚪️</b>
Ish vati <b>[9:00 : 18:00]</b>
    `,{
        parse_mode:"HTML"
    })


})

bot.filter(async (ctx)=> ctx.config.superAdmin).hears("🟢 ON", async (ctx)=>{
    WORK_TIME = 'ON'
    await ctx.reply(`
♻️ Ish vaqti boshlandi (🟢 ON)
Ish kuni <b>⚪️</b>
Ish vati <b>[9:00 : 18:00]</b>
    `,{
        parse_mode:"HTML"
    })
})

bot.filter(async (ctx)=> ctx.config.superAdmin).hears("🤖 AUTO", async (ctx)=>{
    WORK_TIME = 'AUTO'
    await ctx.reply(`
♻️ Ish vaqti botga topshirildi (🤖 AUTO)
Ish kuni <b>[Dushanba : Juma]</b>
Ish vati <b>[9:00 : 18:00]</b>
    `,{
        parse_mode:"HTML"
    })
})

bot.filter(async (ctx)=> ctx.config.superAdmin).hears("🤖 32432", async (ctx)=>{
    WORK_TIME = 'AUTO'
    await ctx.reply(`
♻️ Ish vaqti botga topshirildi (🤖 AUTO)
Ish kuni <b>[Dushanba : Juma]</b>
Ish vati <b>[9:00 : 18:00]</b>
    `,{
        parse_mode:"HTML"
    })
})
export default bot;