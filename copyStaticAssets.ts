import * as shell from "shelljs";

shell.mkdir("dist/public/");
shell.cp("src/public/index.html", "dist/public/");
shell.cp("src/public/404.html", "dist/public/");
shell.mkdir("dist/credentials/");
shell.cp("credentials/mapping.json", "dist/credentials/");
