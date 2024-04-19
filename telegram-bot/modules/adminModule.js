import { Composer,Keyboard } from "grammy"
import {createConversation} from "@grammyjs/conversations"
const bot = new Composer();

const pm = bot.chatType("private");



pm.use(createConversation(base_menu))



async function base_menu(conversation, ctx){
    const admin_buttons = new Keyboard()
        .text("🔗 Admin kanallar")
        .text("✍️ Xabar yozish")
        .row()
        .text("📈 Umumiy statistika")
        .text("📊 Kunlik statistika")
        .resized()

    await ctx.reply(`⚡️ Asosy menyu ⚡️`,{
        reply_markup:admin_buttons
    })
}




export default bot;