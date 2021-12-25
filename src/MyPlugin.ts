import { Plugin } from "obsidian";
import {
  githubIssue,
  defaultSettings as githubIssueDefaultSettings,
} from "./plugins/githubIssue";

type DCTAPlugin = (main: MyPlugin) => void;

const plugins: Array<DCTAPlugin> = [githubIssue];

const DEFAULT_SETTINGS = {
  githubIssue: githubIssueDefaultSettings,
};

type MyPluginSettings = typeof DEFAULT_SETTINGS;

export class MyPlugin extends Plugin {
  settings: MyPluginSettings = DEFAULT_SETTINGS;

  async onload() {
    await this.loadSettings();
    this.initPlugins();
  }

  initPlugins() {
    for (const plugin of plugins) {
      plugin(this);
    }
  }

  onunload() {}

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
