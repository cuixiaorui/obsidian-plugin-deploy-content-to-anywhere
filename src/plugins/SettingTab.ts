import { App, PluginSettingTab, Setting } from "obsidian";
import { MyPlugin } from "../MyPlugin";

export class SettingTab extends PluginSettingTab {
  plugin: MyPlugin;

  constructor(app: App, plugin: MyPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    containerEl.createEl("h2", { text: "Settings for my awesome plugin." });

    const config = this.plugin.settings.githubIssue;

    new Setting(containerEl)
      .setName("Git Token")
      .setDesc("GH_TOKEN")
      .addText((text) =>
        text
          .setPlaceholder("Enter your git token")
          .setValue(config.token)
          .onChange(async (value) => {
            console.log("git token: " + value);
            config.token = value;
            await this.plugin.saveSettings();
          })
      );
    new Setting(containerEl)
      .setName("owner")
      .setDesc("发送到谁的repo")
      .addText((text) =>
        text
          .setPlaceholder("Enter git username")
          .setValue(config.owner)
          .onChange(async (value) => {
            console.log("git username: " + value);
            config.owner = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("repo")
      .setDesc("仓库名")
      .addText((text) =>
        text
          .setPlaceholder("Enter git repoName")
          .setValue(config.repo)
          .onChange(async (value) => {
            console.log("git repoName:" + value);
            config.repo = value;
            await this.plugin.saveSettings();
          })
      );
  }
}
