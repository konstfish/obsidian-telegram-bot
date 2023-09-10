import { Notice } from 'obsidian';

import { Telegraf } from 'telegraf'
import { message } from 'telegraf/filters'

import { ApplicationContext } from './appcontext'
import { FileController } from './file'

export class TelegramBot {
    context: ApplicationContext;
    filecon: FileController;
    bot: Telegraf;

    constructor(context: ApplicationContext, ){
        this.context = context;
        this.filecon = new FileController(this.context);

        this.bot = new Telegraf(this.context.settings.botToken);

        this.bot.command('start', async (ctx) => {
			if(this.context.settings.userId == ''){
				this.context.settings.userId = `${ctx.message.chat.id}`;
				new Notice(`[Telegram] Registered User: ${ctx.message.from.first_name} (${ctx.message.chat.id})`);
			}
		})

		this.bot.on(message('text'), async (ctx) => {
			if(!ctx.message.text.startsWith('/') && this.context.settings.userId == `${ctx.message.chat.id}`){
				if(this.context.settings.savingMode == '1'){
                    this.filecon.appendToNote(ctx.message.text)
				}else{
                    new Notice(`Creating new files has not been implemented yet.`);
                }
                
                if(this.context.settings.notifyMessage){
                    new Notice(`Telegram Message: ${ctx.message.text}`);
                }
			}
		})
    }

    async start(){
        try {
            await this.bot.launch();
        } catch (error) {
            new Notice(`[Telegram] Unable to launch Telegram Bot, try reloading`);
        }
    }

    release() {
        this.bot.stop('SIGTERM')
    }
}