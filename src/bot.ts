import {Bot} from "./bot/bot";
import {NewChatMembersHandler, NewMessageHandler, CommandHandler, CallbackQueryHandler} from "./bot/handler";
import {JoinCallback} from "./bot-stopvirus/commands/join";
import {HelpCommandCallback} from "./bot-stopvirus/commands/help";
import {DamageCommandCallback} from "./bot-stopvirus/commands/damage";
import {SearchCommandCallback} from "./bot-stopvirus/commands/search";
import {LocationCommandCallback} from "./bot-stopvirus/commands/location";
import {CommandCallback} from "./bot-stopvirus/commands/callback";
import {SetAliasCommandCallback, GetAliasCommandCallback} from "./bot-stopvirus/commands/alias";
import {EmergencyCommandCallback} from "./bot-stopvirus/commands/emergency";
import {DefaultCallback} from "./bot-stopvirus/commands/default";

import botConfig from "./config/bot";
const environment = (global as NodeJS.Global).cloudEnv.getString("environment") || "development"; 
const botToken = (botConfig as Record<string, string>)[environment];

const bot = new Bot(botToken, "https://api.icq.net/bot/v1");

bot.dispatcher.addHandler(new NewChatMembersHandler([], JoinCallback));
bot.dispatcher.addHandler(new CommandHandler("help", [], HelpCommandCallback));
bot.dispatcher.addHandler(new CommandHandler("start", [], HelpCommandCallback));

bot.dispatcher.addHandler(new CallbackQueryHandler([], CommandCallback));
bot.dispatcher.addHandler(new NewMessageHandler([], DefaultCallback));

export default bot;