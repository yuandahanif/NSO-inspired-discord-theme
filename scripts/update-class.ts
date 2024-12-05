const config = {
  diffFile: "./submodules/Update-Classes/Changes.txt",
  themeDir: "./themes/index.css",
  outputDir: "./themes/index.css",
};

async function main() {
  try {
    const diffs = Bun.file(config.diffFile);
    const theme = Bun.file(config.themeDir);

    const diffsContent = (await diffs.text()).split("\n");
    let themeContent = await theme.text();

    for (let i = 0; i < diffsContent.length - 1; i += 2) {
      const [key, value] = [diffsContent[i], diffsContent[i + 1]];
      themeContent = themeContent.replaceAll(key, value);
    }

    await Bun.write(config.outputDir, themeContent);
  } catch (error) {
    console.log(error);
  }
}

main();
