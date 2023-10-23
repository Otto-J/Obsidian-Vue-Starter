import {
  App,
  ItemView,
  Modal,
  Platform,
  Plugin,
  PluginSettingTab,
  TFile,
  TFolder,
  WorkspaceLeaf,
} from "obsidian";
import {
  createApp,
  type ComponentPublicInstance,
  type App as VueApp,
} from "vue";
import SettingsPage from "./ui/settings.vue";
import ModalPage from "./ui/modal.vue";

import DemoVue from "./ui/test.vue";
import { useObsidianFrontmatter } from "./utils";

const VIEW_TYPE = "vue-view";

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
  mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
  mySetting: "这是默认值",
};

class MyVueView extends ItemView {
  view!: ComponentPublicInstance;

  getViewType(): string {
    return VIEW_TYPE;
  }

  getDisplayText(): string {
    return "Dice Roller";
  }

  getIcon(): string {
    return "dice";
  }

  async onOpen(): Promise<void> {
    const app = createApp(DemoVue).mount(this.contentEl);
    this.view = app;
  }
}

// 核心
export default class MyPlugin extends Plugin {
  private view!: MyVueView;
  settings!: MyPluginSettings;

  async onload() {
    await this.loadSettings();
    this.addSettingTab(new SampleSettingTab(this.app, this));

    this.registerView(
      VIEW_TYPE,
      (leaf: WorkspaceLeaf) => (this.view = new MyVueView(leaf))
    );

    this.registerEvent(
      this.app.workspace.on("file-menu", (menu, file) => {
        if (file instanceof TFolder) {
          // 一定进不来，为了 ts 不报错
          return;
        }

        if (file instanceof TFile) {
          const isImg = ["png", "jpg", "jpeg", "gif", "webp"].includes(
            file.extension
          );

          if (isImg) {
            // 暂不处理
          } else {
            // nothing
          }
        }
      })
    );

    // This creates an icon in the left ribbon.
    this.addRibbonIcon("dice", "悬浮展示1", (evt: MouseEvent) => {
      console.log(evt);
      this.openMapView();
    });

    // 在这里注册命令 This adds a simple command that can be triggered anywhere
    this.addCommand({
      id: "xxx-id",
      name: "注册命令中文名",
      callback: () => this.openMapView(),
    });
  }

  onunload() {}

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  async openMapView() {
    const workspace = this.app.workspace;
    workspace.detachLeavesOfType(VIEW_TYPE);
    const leaf = workspace.getLeaf(
      // @ts-ignore
      !Platform.isMobile
    );
    await leaf.setViewState({ type: VIEW_TYPE });
    workspace.revealLeaf(leaf);
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
    const { addOrUpdateFrontMatter, currentFrontMatter } =
      useObsidianFrontmatter(this.file, this.app);

    //  console.log("open设置面板", this.plugin);
    const _app = createApp(ModalPage, {
      plugin: this.plugin,
      modal: this,
      file: this.file,
      addOrUpdateFrontMatter,
      currentFrontMatter,
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
