import { parse } from "https://deno.land/std@0.160.0/flags/mod.ts";
import { move } from "https://deno.land/std@0.160.0/fs/move.ts";
import { walk } from "https://deno.land/std@0.160.0/fs/walk.ts";

const printUsage = () => {
  console.info(
    "USAGE:",
  );
  console.info(
    "    deno file-renamer.ts --allow-read --allow-write file-renamer.ts --regex=[REGEX] --replacer=[REPLACER] [--dry-run]",
  );
};

const parsedArgs = parse(Deno.args);

if (parsedArgs["regex"] === undefined || parsedArgs["replace"] === undefined) {
  printUsage();
} else {
  const regex = new RegExp(parsedArgs["regex"]);
  const replacer = parsedArgs["replace"];

  for await (const entry of walk(".", { match: [regex] })) {
    const replacedPath = entry.path.replace(
      entry.name,
      entry.name.replace(regex, replacer),
    );

    if (parsedArgs["dry-run"] === true) {
      console.info(`${entry.path} -> ${replacedPath}`);
    } else {
      await move(entry.path, replacedPath);
    }
  }
}
