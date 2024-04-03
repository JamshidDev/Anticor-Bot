import { Composer, MemorySessionStorage, session } from "grammy"
import { I18n} from "@grammyjs/i18n"
import {chatMembers } from "@grammyjs/chat-members"
import {conversations} from "@grammyjs/conversations"




const bot = new Composer();
const adapter = new MemorySessionStorage();



const i18n = new I18n({
    defaultLocale: "uz",
    useSession: true,
    // directory: "telegram-bot/locales",
    directory: "locales",
    globalTranslationContext(ctx) {
        return { first_name: ctx.from?.first_name ?? "" };
    },
});

bot.use(i18n);
bot.use(session({
    type: "multi",
    session_db: {
        initial: () => {
            return {
                client: {
                    phone: null,
                    full_name: null,
                },
            }
        },
        storage: adapter,
    },
    conversation: {},
    __language_code: {},
}));

bot.use(chatMembers(adapter));
bot.use(conversations());







export default bot;