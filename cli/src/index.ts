import { Command } from "commander";
import * as fs from "fs";
import * as path from "path";

const program = new Command();

program
  .name("pediment")
  .description("CLI for scaffolding Pediment projects")
  .version("0.1.0");

program
  .command("init <name>")
  .description("Initialize a new Pediment project")
  .action((name: string) => {
    console.log(`Creating project: ${name}`);
    const targetDir = path.join(process.cwd(), name);
    if (fs.existsSync(targetDir)) {
      console.error(`Directory ${name} already exists`);
      process.exit(1);
    }
    // Copy template from pediment/templates/astro-solidjs/
    const templateDir = path.join(__dirname, "..", "..", "templates", "astro-solidjs");
    fs.cpSync(templateDir, targetDir, { recursive: true });
    // Replace project name in package.json
    const pkgPath = path.join(targetDir, "package.json");
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
    pkg.name = name;
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
    console.log(`Project ${name} created successfully!`);
    console.log(`  cd ${name}`);
    console.log(`  bun install`);
    console.log(`  bun run dev`);
  });

program.parse();
