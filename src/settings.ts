import { App, PluginSettingTab, Setting, normalizePath } from 'obsidian';

import TelegramPlugin from './main';

export interface TelegramPluginSettings {
	botToken: string;
	userId: string;
	savingMode: string;
	noteAppendPath: string;
	noteAppendTemplate: string;
	noteCreatePath: string;
	notifyMessage: boolean;
}

export const DEFAULT_SETTINGS: TelegramPluginSettings = {
	botToken: '',
	userId: '', // will be autofilled
	savingMode: '1',
	noteAppendPath: '',
	noteAppendTemplate:'\n---\n\n{message}\n',
	noteCreatePath: '',
	notifyMessage: false,
}

export class TelegramSettingsTab extends PluginSettingTab {
	plugin: TelegramPlugin;

	constructor(app: App, plugin: TelegramPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Telegram Bot Token')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('123456789:AbCdefGhIJKlmNoPQRsTUVwxyZ')
				.setValue(this.plugin.settings.botToken)
				.onChange(async (value) => {
					this.plugin.settings.botToken = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
				.setName('Telegram User ID')
				.setDesc('User ID (Will be automatically filled through first interaction with bot)')
				.addText(text => text
					.setPlaceholder('319638032')
					.setValue(this.plugin.settings.userId)
					.onChange(async (value) => {
						this.plugin.settings.userId = value;
						await this.plugin.saveSettings();
					}));
		
		new Setting(containerEl)
				.setName('Message Processing')
				.setDesc('todo')
				.addDropdown(dropdown => {
					dropdown.addOption('1', 'Add to existing note');
					dropdown.addOption('2', 'Create new notes');
					dropdown.setValue(this.plugin.settings.savingMode);
					dropdown.onChange(async (value: string) =>	{
						this.plugin.settings.savingMode = value;
						await this.plugin.saveSettings()
						this.display()
					});
				});

		if(this.plugin.settings.savingMode == '1'){
			new Setting(containerEl)
			.setName('Append to Note')
			.setDesc('New messages will be filled into here')
			.addSearch(text => {
				text.setPlaceholder('folder/note')
				text.setValue(this.plugin.settings.noteAppendPath)
				text.onChange(async (value) => {
					value = normalizePath(value)
					if(!value.endsWith('.md')){
						value += '.md'
					}
					this.plugin.settings.noteAppendPath = value;
					await this.plugin.saveSettings();
				})});

			new Setting(containerEl)
			.setName('Append Template')
			.setDesc('Placeholder: {message}')
			.addTextArea(text => {
				text.setPlaceholder('folder/note')
				text.setValue(this.plugin.settings.noteAppendTemplate)
				text.onChange(async (value) => {
					this.plugin.settings.noteAppendTemplate = value;
					await this.plugin.saveSettings();
				})});
		}

		if(this.plugin.settings.savingMode == '2'){
			new Setting(containerEl)
			.setName('Note Folder')
			.setDesc('Newly created notes will be placed here')
			.addText(text => text
				.setPlaceholder('folder/')
				.setValue(this.plugin.settings.noteCreatePath)
				.onChange(async (value) => {
					this.plugin.settings.noteCreatePath = normalizePath(value);
					await this.plugin.saveSettings();
				}));
		}

		new Setting(containerEl)
			.setName('Notify On new Message')
			.setDesc('Will send obsidian notice when handling messages')
			.addToggle(text => text
				.setValue(this.plugin.settings.notifyMessage)
				.onChange(async (value) => {
					this.plugin.settings.notifyMessage = value;
					await this.plugin.saveSettings();
				}));
	}
}