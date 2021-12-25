import { Editor, MarkdownView } from "obsidian";
import { MyPlugin } from "../MyPlugin";
import { SettingTab } from "./SettingTab";
import { submitDaily } from "./submitDaily";

// TODO
// 1. 定义默认的值
// 2. 插件的名称
// 3. 插件的执行函数

export function githubIssue(main: MyPlugin) {
  // 添加命令
  main.addCommand({
    id: "obsidian-plugin-deploy-content-to-anywhere:command:deploy",
    name: "Deploy To Github Issue",
    editorCallback: (editor: Editor, view: MarkdownView) => {
      console.log(view.data);
      console.log(main.settings);
      submitDaily({
        content: view.data,
        githubToken: main.settings.githubIssue.token,
        owner: main.settings.githubIssue.owner,
        repo: main.settings.githubIssue.repo,
      });
    },
  });

  // 添加 setting 面板的 view
  main.addSettingTab(new SettingTab(main.app, main));
}
