import { App, DropdownComponent, Notice, Plugin, PluginSettingTab, Setting, TFile, normalizePath } from 'obsidian';

import { TelegramPluginSettings, DEFAULT_SETTINGS, TelegramSettingsTab } from './settings'

import { ApplicationContext } from './appcontext'

import { TelegramBot } from './telegram'

export default class TelegramPlugin extends Plugin {
	private context: ApplicationContext;

	settings: TelegramPluginSettings;
	bot: TelegramBot;

	async onload() {
		await this.loadSettings();
		console.log('loading Obsidian Telegram Bot Plugin')

		this.context = new ApplicationContext(this.app, this.settings);

		this.bot = new TelegramBot(this.context);
		this.bot.start();

		this.addSettingTab(new TelegramSettingsTab(this.app, this));
	}

	onunload() {
		this.bot.release();
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	appendToNote(message: string){
		var temp = this.settings.noteAppendTemplate;
		temp = temp.replace('{message}', message);

		this.app.vault.adapter.append(this.settings.noteAppendPath, temp)
		// this.app.vault.adapter.exists()
		// this.app.vault.adapter.write()
	}
}