
import { Composer } from "grammy"


const bot = new Composer();




bot.use(async (ctx, next)=>{
    const superAdminTelegramIdList = [1038293334];
    const overwriteCommandsList = [ctx.t('cancel_action_msg'), ctx.t('change-appeal_btn_text')];
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