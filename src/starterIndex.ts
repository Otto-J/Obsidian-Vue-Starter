import { App, Modal, Notice, Plugin, PluginSettingTab, TFile } from "obsidian";
import { createApp, type App as VueApp } from "vue";
import SettingsPage from "./ui/settings.vue";
import ModalPage from "./ui/modal.vue";

interface MyPluginSettings {
  mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
  mySetting: "这是默认值",
};

// 核心
export default class MyPlugin extends Plugin {
  settings!: MyPluginSettings;

  async onload() {
    await this.loadSettings();
    this.addSettingTab(new SampleSettingTab(this.app, this));

    this.registerEvent(
      this.app.workspace.on("file-menu", (menu, file) => {
        const isFile = file instanceof TFile;
        if (!isFile) return;

        const isMD = (file.extension ?? "").toLocaleLowerCase() === "md";
        if (!isMD) return;
        new Notice("文件菜单");
      })
    );

    this.addRibbonIcon("dice", "悬浮展示1", (evt: MouseEvent) => {
      console.log(evt);
      // this.openMapView();
    });

    // 在这里注册命令 This adds a simple command that can be triggered anywhere
    this.addCommand({
      id: "xxx-id",
      name: "注册命令中文名",
      callback: () => {
        new Notice("注册命令");
      },
    });
  }

  onunload() {}

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}

/**
 * 添加 设置面板
 */
class SampleSettingTab extends PluginSettingTab {
  plugin: Plugin;
  _vueApp: VueApp | undefined;

  constructor(app: App, plugin: Plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const _app = createApp(SettingsPage, {
      plugin: this.plugin,
    });
    this._vueApp = _app;
    _app.mount(this.containerEl);
  }
  hide() {
    if (this._vueApp) {
      this._vueApp.unmount();
    }
    this.containerEl.empty();
  }
}

/**
 * 第一次上传需要添加默认值
 */
export class MyPublishModal extends Modal {
  _vueApp: VueApp | undefined;
  plugin: Plugin;

  file: TFile;

  constructor(app: App, plugin: Plugin, file: TFile) {
    super(app);
    this.plugin = plugin;
    this.file = file;
  }

  onOpen() {
    const _app = createApp(ModalPage, {
      plugin: this.plugin,
      modal: this,
      file: this.file,
    });
    this._vueApp = _app;
    _app.mount(this.containerEl);
  }

  onClose() {
    if (this._vueApp) {
      this._vueApp.unmount();
    }
    this.containerEl.empty();
  }
}
