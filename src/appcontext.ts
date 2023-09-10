import { App } from 'obsidian';
import { TelegramPluginSettings } from './settings';

export class ApplicationContext {
  app: App;
  settings: TelegramPluginSettings;

  constructor(app: App, settings: TelegramPluginSettings) {
    this.app = app;
    this.settings = settings;
  }
}