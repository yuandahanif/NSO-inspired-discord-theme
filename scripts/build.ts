import cssnanoPlugin from "cssnano";
import { watch, writeFile, readFile } from "fs";
import postcss from "postcss";
import { author_comment } from "./authorComment";

const entryFile = "themes/index.css";
const outputFileName = "output/ame-chan.theme.css";

readFile(entryFile, (err, css) => {
  postcss([cssnanoPlugin])
    .process(css, {
      from: entryFile,
      to: outputFileName,
    })
    .then((result) => {
      writeFile(outputFileName, author_comment + result.css, () => true);
      if (result.map) {
        writeFile(`${outputFileName}.map`, result.map.toString(), () => true);
      }
    });
});
