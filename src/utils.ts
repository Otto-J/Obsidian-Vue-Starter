import { type App, Notice, TFile, stringifyYaml, Plugin } from "obsidian";

export const useObsidianFrontmatter = (file: TFile, app: App) => {
  // 使用更具语义化的函数名
  const doesFileExist = () => !!app.metadataCache.getFileCache(file);

  const currentFrontMatter = () =>
    app.metadataCache.getFileCache(file)?.frontmatter ?? {};
  const addOrUpdateFrontMatter = async (obj: Record<string, string>) => {
    const fileCache = app.metadataCache.getFileCache(file);
    // 如果文件不存在，直接返回
    if (!fileCache) {
      new Notice("文件不存在");
      return;
    }

    const currentFrontMatter = fileCache?.frontmatter ?? {};
    const newFrontMatter = `---\n${stringifyYaml({
      ...currentFrontMatter,
      ...obj,
    })}\n---\n`;

    // const { frontmatterPosition } = fileCache;
    const fileContents = await app.vault.read(file);

    const frontmatterPosition = fileCache.frontmatterPosition ?? {
      start: {
        line: 0,
        col: 0,
        offset: 0,
      },
      end: {
        line: 0,
        col: 0,
        offset: 0,
      },
    };

    // 这里逻辑比较绕，目的是重写文件内容，希望有官方 api
    const {
      start: { offset: deleteFrom },
      end: { offset: deleteTo },
    } = frontmatterPosition;

    const newFileContents =
      fileContents.slice(0, deleteFrom) +
      newFrontMatter +
      fileContents.slice(deleteTo);

    await app.vault.modify(file, newFileContents);
  };

  return {
    doesFileExist,
    addOrUpdateFrontMatter,
    currentFrontMatter,
  };
};

export const handleLocalUrl = async (obUrl: string, plugin: Plugin) => {
  console.log("handleLocalUrl--", obUrl);
  // 这里需要调用 obsidian 的 api 来读取文件
  try {
    const obInnerFile = await plugin.app.metadataCache.getFirstLinkpathDest(
      obUrl,
      ""
    );
    if (!obInnerFile) {
      new Notice(`Failed upload ${obUrl}, 文件不存在`);
      return;
    }
    console.log("find ob local file");

    const conArrayBuffer = await plugin.app.vault.readBinary(obInnerFile);
    // 转成二进制，通过 post 上传
    const blob = new Blob([conArrayBuffer], {
      type: "image/" + obInnerFile.extension,
    });
    // 测试上传一个图片
    return blob;
  } catch (error: any) {
    new Notice(`Fail Read ${obUrl}, ${error.message}`);
  }

  return;
};
