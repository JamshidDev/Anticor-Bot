import { Composer,Keyboard } from "grammy"
import { Menu }  from "@grammyjs/menu"
import { hears }  from "@grammyjs/i18n"
import {createConversation} from "@grammyjs/conversations";
const bot = new Composer();

const pm = bot.chatType("private");




pm.use(createConversation(hidden_visible_conversation))
pm.use(createConversation(register_appeal_conversation))



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
        text: basic_mean,
        file_id: file_id || null,
    }
    console.log(data)

    let keyboards_three = new Keyboard()
        .text(ctx.t('appeal_btn_text'))
        .resized();
    await ctx.reply(ctx.t('confirm-appeal-text'),{
        parse_mode:"HTML",
        reply_markup:keyboards_three,
    });






}

async function register_appeal_conversation(conversation, ctx){

    let data = {
        fullname:null,
        phone:null,
        address:null,
        appeal_text:null,
        appeal_file:null,
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

    await ctx.reply(ctx.t('visible-appeal-phone-title'),{
        parse_mode:"HTML",
    });

    ctx = await conversation.wait();

    if (!ctx.message?.text) {
        do {
            await ctx.reply(ctx.t('warning_appeal_phone_text'), {
                parse_mode: "HTML",
            });
            ctx = await conversation.wait();
        } while (!ctx.message?.text);
    }

    data.phone = ctx.message.text;

    await ctx.reply(ctx.t('visible-appeal-address-title'),{
        parse_mode:"HTML",
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

    data.appeal_text= ctx.message.text;


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
    data.appeal_file = ctx.message?.document?.file_id || null;

    console.log(data);

    let keyboards_three = new Keyboard()
        .text(ctx.t('appeal_btn_text'))
        .resized();
    await ctx.reply(ctx.t('confirm-appeal-text'),{
        parse_mode:"HTML",
        reply_markup:keyboards_three,
    });

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
                    await ctx.deleteMessage();


                    let keyboards = new Keyboard()
                        .text(ctx.t('appeal_btn_text'))
                        .resized();

                    await ctx.reply(ctx.t("exception_msg"),{
                        parse_mode:"HTML",
                        reply_markup:keyboards
                    })


                })
                .row();
        })
    })
pm.use(language_menu)
pm.command('start', async (ctx)=>{

    await ctx.reply(ctx.t("select_language_msg",{
        fullname:ctx.from.first_name +" "+(ctx.from.last_name || '')
    }),{
        parse_mode:"HTML",
        reply_markup:language_menu
    })
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