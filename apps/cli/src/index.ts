#!/usr/bin/env node
import c from 'picocolors';
import { printHelp } from './utils/banner.js';
import { getVersion } from './utils/version.js';
import { trackRun } from './utils/tracking.js';
import { listCommand } from './commands/list.js';
import { addCommand } from './commands/add.js';
import { configCommand } from './commands/config.js';

const args = process.argv.slice(2);
const command = args[0];
const subcommand = args[1];

async function main() {
  const version = getVersion();
  
  // Track every CLI run in background (fire and forget)
  // This tracks every single invocation with the command used
  trackRun(version, command).catch(() => {
    // Silently ignore tracking errors
  });

  // Show banner + help when no command provided
  if (!command || command === '--help' || command === '-h') {
    printHelp();
    process.exit(0);
  }

  // Show version
  if (command === '--version' || command === '-v') {
    console.log(version);
    process.exit(0);
  }

  // Handle commands
  try {
    switch (command) {
      case 'list':
        await listCommand();
        break;
      case 'add':
        await addCommand(subcommand);
        break;
      case 'config':
        await configCommand();
        break;
      default:
        console.log(c.red(`Unknown command: ${command}`));
        console.log();
        printHelp();
        process.exit(1);
    }
  } catch (error) {
    console.error(c.red(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`));
    process.exit(1);
  }
}

main();
