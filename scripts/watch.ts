import cssnanoPlugin from "cssnano";
import { watch, writeFile, readFile } from "fs";
import postcss from "postcss";
import os from "node:os";
import { author_comment } from "./authorComment";

let discord_theme_path = "";

const prompt = "discord theme path: e.g /home/[user]/.config/Vencord/themes/\n";
process.stdout.write(prompt);

for await (const line of console) {
  if (line == "") {
    if (os.platform() == "linux") {
      discord_theme_path = `/home/${Bun.env.USER}/.config/Vencord/themes/`;
      console.log(
        "🐧 detected, setting default path to: " + discord_theme_path
      );
    } else {
      console.log("Please provide the path to your discord theme folder.");
      process.exit(1);
    }
    break;
  } else {
    discord_theme_path = line;
    break;
  }
}

const watcher = watch(
  import.meta.dir + "/../themes",
  { recursive: true },
  (event, filename) => {
    console.log(`Detected ${event} in ${filename}`);

    if (filename!.endsWith(".css")) {
      const outputFileName =
        filename! == "index.css"
          ? "ame-chan.dev.theme.css"
          : filename!.replace(".css", ".theme.css");

      const inputFilename = import.meta.dir + "/../themes/" + filename!;
      console.log("compiling new update!");

      readFile(inputFilename, (err, css) => {
        postcss([cssnanoPlugin])
          .process(css, {
            from: inputFilename,
            to: `${discord_theme_path}/${outputFileName}`,
          })
          .then((result) => {
            writeFile(
              `${discord_theme_path}/${outputFileName}`,
              author_comment + result.css,
              () => true
            );
            if (result.map) {
              writeFile(
                `${discord_theme_path}/${outputFileName}.map`,
                result.map.toString(),
                () => true
              );
            }
          });
      });
    }
  }
);

process.on("SIGINT", () => {
  // close watcher when Ctrl-C is pressed
  console.log("Closing watcher...");
  watcher.close();

  process.exit(0);
});
