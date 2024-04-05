
import {Composer, session} from "grammy"


const bot = new Composer();


bot.use(async (ctx, next)=>{
    let lang = await ctx.session.session_db.language_code || 'uz';
    await ctx.i18n.setLocale(lang);
    await next();
})



bot.use(async (ctx, next)=>{
    const superAdminTelegramIdList = [];
    const overwriteCommandsList = [ctx.t('cancel_action_msg'), ctx.t('change-appeal_btn_text'), '/start', '/changelang'];
    console.log(overwriteCommandsList.includes(ctx.message?.text))
    if (overwriteCommandsList.includes(ctx.message?.text)) {
        const stats = await ctx.conversation.active();
        for (let key of Object.keys(stats)) {
            await ctx.conversation.exit(key);
        }
    }

    ctx.config = {
        superAdmin: superAdminTelegramIdList.includes(ctx.from?.id)
    }
   await next();
})







export default bot;