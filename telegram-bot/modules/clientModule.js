import { Composer,Keyboard, InputFile } from "grammy"
import { Menu }  from "@grammyjs/menu"
import { hears }  from "@grammyjs/i18n"
import {createConversation} from "@grammyjs/conversations";
import appealController from "../controllers/appealController.js";
import userControllers from "../controllers/userControllers.js";
import "../config/mongodb.js"
import Docxtemplater from "docxtemplater"
import PizZip from "pizzip"
import path from "path"
import fs from 'fs'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import moment from 'moment-timezone'
const timezone = 'Asia/Tashkent';
const __dirname = dirname(fileURLToPath(import.meta.url));

const bot = new Composer();

const pm = bot.chatType("private");




pm.use(createConversation(hidden_visible_conversation))
pm.use(createConversation(register_appeal_conversation))
pm.use(createConversation(main_menu))
pm.use(createConversation(appeal_conversation))



async function hidden_visible_conversation(conversation, ctx){
    let keyboards = new Keyboard()
        .text(ctx.t('change-appeal_btn_text'))
        .resized();
    await ctx.reply(ctx.t('hidden-appeal-title'),{
        parse_mode:"HTML",
        reply_markup:keyboards
    });

    ctx = await conversation.wait();
    if (!ctx.message?.text) {
        do {
            await ctx.reply(ctx.t('warning_appeal_text'), {
                parse_mode: "HTML",
            });
            ctx = await conversation.wait();
        } while (!ctx.message?.text);
    }

    let basic_mean = ctx.message.text;

    let keyboard_two = new Keyboard()
        .text(ctx.t('change-appeal_next_btn_text'))
        .row()
        .text(ctx.t('change-appeal_btn_text'))
        .resized();
    await ctx.reply(ctx.t('hidden-appeal-file-text'),{
        parse_mode:"HTML",
        reply_markup:keyboard_two
    });

    ctx = await conversation.wait();
    let is_valid = !ctx.message?.document && !(ctx.message.text == ctx.t('change-appeal_next_btn_text'));
    if (is_valid) {
        do {
            await ctx.reply(ctx.t('warning_appeal_file_text'), {
                parse_mode: "HTML",
            });
            ctx = await conversation.wait();
            is_valid = !ctx.message?.document && !(ctx.message.text == ctx.t('change-appeal_next_btn_text'));
        } while (is_valid);
    }
    let file_id = ctx.message?.document?.file_id;

    let data = {
        appealText: basic_mean,
        appealFile: file_id || null,
        appealType:'anonymous'
    }

    let res_data = await appealController.store(data);

    if(res_data.success){
        let keyboards_three = new Keyboard()
            .text(ctx.t('appeal_btn_text'))
            .resized();
        await ctx.reply(ctx.t('confirm-appeal-text',{
            number:res_data.data.appealNumber,
        }),{
            parse_mode:"HTML",
            reply_markup:keyboards_three,
        });

        let message_data = {
            user_id: ctx.from.id,
            text:data.appealText,
            file:data.appealFile,
            type:data.appealType,
            number:res_data.data.appealNumber,
            createdAt:timeFormatterToUzb(res_data.data.created_at),
        }

        await sendMessageAdmin(ctx,message_data);
    }else{
        await ctx.reply(ctx.t('unknown_error'),{
            parse_mode:"HTML",
        });
    }


}

async function register_appeal_conversation(conversation, ctx){

    let data = {
        fullname:null,
        phone:null,
        address:null,
        appealText:null,
        appealFile:null,
        appealType:'register',
    }

    let keyboards = new Keyboard()
        .text(ctx.t('change-appeal_btn_text'))
        .resized();
    await ctx.reply(ctx.t('visible-appeal-title'),{
        parse_mode:"HTML",
        reply_markup:keyboards
    });

    ctx = await conversation.wait();

    if (!ctx.message?.text) {
        do {
            await ctx.reply(ctx.t('warning_appeal_fullname_text'), {
                parse_mode: "HTML",
            });
            ctx = await conversation.wait();
        } while (!ctx.message?.text);
    }

    data.fullname = ctx.message.text;
    let keyboards_phone = new Keyboard()
        .requestContact(ctx.t('request-phone-btn'))
        .row()
        .text(ctx.t('change-appeal_btn_text'))
        .resized();
    await ctx.reply(ctx.t('visible-appeal-phone-title'),{
        parse_mode:"HTML",
        reply_markup:keyboards_phone,
    });

    ctx = await conversation.wait();
    if (!ctx.message?.contact) {
        do {
            await ctx.reply(ctx.t('warning_appeal_phone_text'), {
                parse_mode: "HTML",
                reply_markup:keyboards_phone,
            });
            ctx = await conversation.wait();
        } while (!ctx.message?.contact);
    }
    data.phone = ctx.message.contact.phone_number;

    await ctx.reply(ctx.t('visible-appeal-address-title'),{
        parse_mode:"HTML",
        reply_markup:keyboards
    });

    ctx = await conversation.wait();

    if (!ctx.message?.text) {
        do {
            await ctx.reply(ctx.t('warning_appeal_address_text'), {
                parse_mode: "HTML",
            });
            ctx = await conversation.wait();
        } while (!ctx.message?.text);
    }

    data.address = ctx.message.text;

    await ctx.reply(ctx.t('hidden-appeal-title'),{
        parse_mode:"HTML",
    });

    ctx = await conversation.wait();

    if (!ctx.message?.text) {
        do {
            await ctx.reply(ctx.t('warning_appeal_text'), {
                parse_mode: "HTML",
            });
            ctx = await conversation.wait();
        } while (!ctx.message?.text);
    }

    data.appealText= ctx.message.text;


    let keyboard_two = new Keyboard()
        .text(ctx.t('change-appeal_next_btn_text'))
        .row()
        .text(ctx.t('change-appeal_btn_text'))
        .resized();
    await ctx.reply(ctx.t('hidden-appeal-file-text'),{
        parse_mode:"HTML",
        reply_markup:keyboard_two
    });

    ctx = await conversation.wait();


    let is_valid = !ctx.message?.document && !(ctx.message.text == ctx.t('change-appeal_next_btn_text'));
    if (is_valid) {
        do {
            await ctx.reply(ctx.t('warning_appeal_file_text'), {
                parse_mode: "HTML",
            });
            ctx = await conversation.wait();
            is_valid = !ctx.message?.document && !(ctx.message.text == ctx.t('change-appeal_next_btn_text'));
        } while (is_valid);
    }
    data.appealFile = ctx.message?.document?.file_id || null;

    let res_data= await appealController.store(data);
    if(res_data.success){
        let keyboards_three = new Keyboard()
            .text(ctx.t('appeal_btn_text'))
            .resized();
        await ctx.reply(ctx.t('confirm-appeal-text',{
            number:res_data.data.appealNumber,
        }),{
            parse_mode:"HTML",
            reply_markup:keyboards_three,
        });


        let message_data = {
            user_id: ctx.from.id,
            text:data.appealText,
            file:data.appealFile,
            type:data.appealType,
            number:res_data.data.appealNumber,
            createdAt:timeFormatterToUzb(res_data.data.created_at),
            fullname:data.fullname,
            phone:data.phone,
            address:data.address,
        }

        await sendMessageAdmin(ctx,message_data);

    }else{
        await ctx.reply(ctx.t('unknown_error'),{
            parse_mode:"HTML",
        });
    }



}

async function main_menu(conversation, ctx){
    let res_data =await userControllers.getUserInfoById(ctx.from.id);
    if(res_data.success && res_data.data.languageCode){
        let languageCode = res_data.data.languageCode
        await ctx.i18n.setLocale(languageCode);
        await ctx.conversation.enter("appeal_conversation");

    }else{

        await ctx.reply(ctx.t("select_language_msg",{
            fullname:ctx.from.first_name +" "+(ctx.from.last_name || '')
        }),{
            parse_mode:"HTML",
            reply_markup:language_menu
        })

        let data = {
            telegramId:ctx.from.id,
            firstname:ctx.from.first_name,
            lastname:ctx.from?.last_name,
            username:ctx.from?.username,
            languageCode:null,
        }
        await userControllers.store(data);
    }
}

async function appeal_conversation(conversation, ctx){
    let keyboards = new Keyboard()
        .text(ctx.t('appeal_btn_text'))
        .resized();

    await ctx.reply(ctx.t("exception_msg"),{
        parse_mode:"HTML",
        reply_markup:keyboards
    })
}

 function createDocument(data){
   try{
       let content = null;
       if(data.type === 'anonymous'){
            content = fs.readFileSync(
               path.resolve(__dirname, "../resourse/template2.docx"),
               "binary"
           );
       }else{
           content = fs.readFileSync(
               path.resolve(__dirname, "../resourse/template1.docx"),
               "binary"
           );
       }

       const zip = new PizZip(content);

       const doc = new Docxtemplater(zip, {
           paragraphLoop: true,
           linebreaks: true,
       });

       if(data.type === 'anonymous'){
           doc.render({
               appealText: data.text,
               appealNumber: data.number,
               appealDate: data.createdAt,
           });
       }else{
           doc.render({
               appealText: data.text,
               appealNumber: data.number,
               appealDate: data.createdAt,
               phone:data.phone,
               fullname:data.fullname,
               address:data.address,
           });
       }

       const buf = doc.getZip().generate({
           type: "nodebuffer",
           compression: "DEFLATE",
       });

       fs.writeFileSync(path.resolve(__dirname, "../document/output.docx"), buf);
       let file_path = new InputFile("./document/output.docx")
       return {
           success:true,
           file_path,
       }
   }catch (error){
       console.log(error);
       return {
           success:false,
           file_path:null,
       }
   }
}

const sendMessageAdmin = async (ctx,data)=>{

    let res_data = createDocument(data);
    if(res_data.success){
        let chat_id = -1002086725762;
        await ctx.api.sendDocument(chat_id, res_data.file_path, {
            caption:`
<b>📄 Murojat raqami</b>:${data.number} 
<b>♻️ Murojat turi</b>:${data.type === 'anonymous'? 'Anonim':"Ro'yhatdan o'tish orqali"} 
<b>⏰ Murojat vaqti</b>:${data.createdAt} 
<b>📁 Ilova</b>:${data.file? "Mavjud ✅":"Mavjud emas ❌"} 
            `,
            parse_mode:"HTML"

        },);

        if(data.file){
            await ctx.api.sendDocument(chat_id, data.file, {
                caption:`
<b>📁 ILOVA</b>
<i><b> ${data.number} </b> - raqamli murojat uchun ilova fayli.</i>
            `,
                parse_mode:"HTML"

            },);
        }

    }


}

const timeFormatterToUzb =(time)=>{
    return  moment(time).tz(timezone).format('YYYY-MM-DD HH:mm');
}

const checkWorkTime = ()=>{
    let time = new Date();
    let hour = moment(time).tz(timezone).format('HH');
    let weekDay = new Date(time).getDay();
    let date = moment(time).tz(timezone).format('YYYY-MM-DD');
    // if(9<hour && hour<18){
    //     return true
    // }
    console.log(weekDay)

}




















const language_menu = new Menu("language_menu")
    .dynamic(async (ctx, range) => {
        let list = [
            {
            name: "language_uz",
            key: "uz"
            },
            {
                name: "language_ru",
                key: "ru"
            },
        ]
        list.forEach((item) => {
            range
                .text(ctx.t(item.name), async (ctx) => {
                    await ctx.answerCallbackQuery();
                    await ctx.i18n.setLocale(item.key);
                    await userControllers.setUserLanguage({
                        telegramId:ctx.from.id,
                        languageCode:item.key
                    })
                    await ctx.deleteMessage();
                    await ctx.conversation.enter("appeal_conversation");
                })
                .row();
        })
    })
pm.use(language_menu)

const language_changing_menu = new Menu("language_changing_menu")
    .dynamic(async (ctx, range) => {
        let list = [
            {
                name: "language_uz",
                key: "uz"
            },
            {
                name: "language_ru",
                key: "ru"
            },
        ]
        list.forEach((item) => {
            range
                .text(ctx.t(item.name), async (ctx) => {
                    await ctx.answerCallbackQuery();
                    ctx.session.session_db.language_code = item.key;
                    await ctx.i18n.setLocale(item.key);

                    await userControllers.setUserLanguage({
                        telegramId:ctx.from.id,
                        languageCode:item.key
                    })
                    await ctx.deleteMessage();
                    await ctx.reply(ctx.t('success-change-language'),{
                        parse_mode:"HTML"
                    })
                    await ctx.conversation.enter("main_menu");
                })
                .row();
        })
    })
pm.use(language_changing_menu)
pm.command('start', async (ctx)=>{
    await ctx.conversation.enter("main_menu");
})

pm.command('changelang', async (ctx)=>{
    await ctx.reply(ctx.t("change-language-text"),{
        parse_mode:"HTML",
        reply_markup:language_changing_menu
    })

})


bot.command('checktime', async(ctx)=>{
    checkWorkTime();
})





















bot.filter(hears("appeal_btn_text"), async (ctx) => {

    let keyboards = new Keyboard()
        .text(ctx.t('visible_appeal_btn_text'))
        .row()
        .text(ctx.t('hidden_appeal_btn_text'))
        .resized();

    await ctx.reply(ctx.t('appeal-type-msg'),{
        parse_mode:"HTML",
        reply_markup:keyboards,
    })
});

bot.filter(hears("change-appeal_btn_text"), async (ctx) => {

    let keyboards = new Keyboard()
        .text(ctx.t('visible_appeal_btn_text'))
        .row()
        .text(ctx.t('hidden_appeal_btn_text'))
        .resized();

    await ctx.reply(ctx.t('appeal-type-msg'),{
        parse_mode:"HTML",
        reply_markup:keyboards,
    })
});

bot.filter(hears("hidden_appeal_btn_text"), async (ctx) => {
    await ctx.conversation.enter("hidden_visible_conversation");
});
bot.filter(hears("visible_appeal_btn_text"), async (ctx) => {
    await ctx.conversation.enter("register_appeal_conversation");
});


export default bot;

































