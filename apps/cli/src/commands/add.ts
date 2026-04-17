import * as p from '@clack/prompts';
import c from 'picocolors';
import { getConfig, DEFAULT_API_URL } from '../utils/config.js';
import { makeApiRequest } from '../utils/api.js';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { banner } from '../utils/banner.js';

// File node type matching the web app
interface FileNode {
  id: string;
  name: string;
  path: string;
  content: string;
  type: "file" | "folder";
  isOpen?: boolean;
  children?: FileNode[];
}

interface SkillDetail {
  id: string;
  name: string;
  description: string;
  slug: string;
  content: string;
  files: FileNode[] | null;
  demoUrl: string | null;
  thumbnailUrl: string | null;
  category: string;
  author: string | { name: string; username: string; image?: string };
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

// Sanitize skill name for safe file system usage
function sanitizeSkillName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')   // Replace non-alphanumeric chars with hyphens
    .replace(/-+/g, '-')            // Collapse multiple hyphens
    .replace(/^-|-$/g, '');         // Trim leading/trailing hyphens
}

// Recursively write files and folders from file tree
function writeFileTree(
  baseDir: string,
  files: FileNode[],
  installedPaths: string[]
): void {
  for (const node of files) {
    const nodePath = join(baseDir, node.path);

    if (node.type === "folder") {
      // Create folder
      if (!existsSync(nodePath)) {
        mkdirSync(nodePath, { recursive: true });
      }
      installedPaths.push(nodePath);

      // Recursively process children
      if (node.children && node.children.length > 0) {
        writeFileTree(baseDir, node.children, installedPaths);
      }
    } else {
      // Create parent directories if needed
      const parentDir = dirname(nodePath);
      if (!existsSync(parentDir)) {
        mkdirSync(parentDir, { recursive: true });
      }

      // Write file
      writeFileSync(nodePath, node.content, 'utf-8');
      installedPaths.push(nodePath);
    }
  }
}

// Get all files count from file tree
function countFiles(files: FileNode[]): number {
  let count = 0;
  for (const node of files) {
    if (node.type === "file") {
      count++;
    }
    if (node.children) {
      count += countFiles(node.children);
    }
  }
  return count;
}

export async function addCommand(identifier: string) {
  // Print banner first
  console.log(banner);

  if (!identifier) {
    console.log(c.red('Error: Skill identifier is required'));
    console.log();
    console.log(c.gray('Usage: tasteui add <owner>/<slug>'));
    console.log(c.gray('       tasteui add <slug>'));
    console.log();
    console.log(c.gray('Examples:'));
    console.log(c.gray('  tasteui add abboskhonov/sasa'));
    console.log(c.gray('  tasteui add claude-design-system'));
    console.log();
    console.log(c.gray('Run "tasteui list" to see available skills'));
    return;
  }

  // Parse identifier: can be "owner/slug" or just "slug"
  let owner: string | undefined;
  let slug: string;

  if (identifier.includes('/')) {
    const parts = identifier.split('/');
    owner = parts[0];
    slug = parts[1];
  } else {
    slug = identifier;
  }

  const config = await getConfig();
  const apiUrl = config.apiUrl || DEFAULT_API_URL;

  const spinner = p.spinner();
  
  if (owner) {
    spinner.start(`Fetching skill "${owner}/${slug}"...`);
  } else {
    spinner.start(`Fetching skill "${slug}"...`);
  }

  try {
    // Build API URL based on format
    // Note: The API uses /api/designs/:owner/:slug not /api/skills/:owner/:slug
    const apiUrlPath = owner 
      ? `${apiUrl}/api/designs/${owner}/${slug}`
      : `${apiUrl}/api/skills/${slug}`;

    // Fetch the skill from API (pass token if available)
    const response = await makeApiRequest(apiUrlPath, config.token);
    // API returns { skill: ... } for /skills and { design: ... } for /designs
    const skill = (response as { skill?: SkillDetail; design?: SkillDetail }).skill 
      || (response as { skill?: SkillDetail; design?: SkillDetail }).design;

    if (!skill) {
      throw new Error('Skill not found');
    }

    // Fetch files separately if using the /designs/:owner/:slug endpoint
    // The API excludes files from the main endpoint for performance (lazy loading)
    if (owner && !skill.files) {
      try {
        const filesResponse = await makeApiRequest(
          `${apiUrl}/api/designs/${owner}/${slug}/files`,
          config.token
        ) as { files: FileNode[] | null };
        skill.files = filesResponse.files;
      } catch {
        // If files fetch fails, continue with empty files
        skill.files = null;
      }
    }

    // Extract author info (could be string or object from different endpoints)
    const authorDisplay = typeof skill.author === 'string' 
      ? skill.author 
      : skill.author?.username || skill.author?.name || 'Anonymous';

    spinner.stop(c.green(`Found: ${skill.name} by ${authorDisplay}`));
    console.log();

    // Show skill details
    console.log(c.bold('Skill Details:'));
    console.log(`  ${c.gray('Name:')} ${skill.name}`);
    console.log(`  ${c.gray('Author:')} ${authorDisplay}`);
    console.log(`  ${c.gray('Category:')} ${skill.category}`);
    console.log(`  ${c.gray('Description:')} ${skill.description || 'No description'}`);
    console.log();

    // Install to .agents/skills (universal location)
    console.log(c.gray('Will install to:'), c.cyan('./.agents/skills/'));
    console.log();

    const shouldInstall = await p.confirm({
      message: 'Install this skill?',
      initialValue: true,
    });

    if (p.isCancel(shouldInstall) || !shouldInstall) {
      p.outro(c.gray('Installation cancelled'));
      return;
    }

    // Install the skill
    const installSpinner = p.spinner();
    installSpinner.start('Installing skill...');

    const skillName = sanitizeSkillName(skill.name);
    const installedPaths: string[] = [];

    // Install to .agents/skills (universal location for all agents)
    const installDir = join(process.cwd(), '.agents', 'skills', skillName);
    if (!existsSync(installDir)) {
      mkdirSync(installDir, { recursive: true });
    }

    // Write the main SKILL.md
    writeFileSync(join(installDir, 'SKILL.md'), skill.content, 'utf-8');
    installedPaths.push(join(installDir, 'SKILL.md'));

    // Write additional files from the file tree
    if (skill.files && skill.files.length > 0) {
      writeFileTree(installDir, skill.files, installedPaths);
    }

    const fileCount = skill.files ? countFiles(skill.files) : 0;
    installSpinner.stop(c.green(`Installed ${fileCount + 1} file(s) to ./.agents/skills/${skillName}/`));
    console.log();
    
    p.note(`The skill is now available in your coding agents!`, 'Success');

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Handle specific error cases with helpful messages
    if (errorMessage === 'Skill not found') {
      spinner.stop(c.red(`Skill "${owner ? owner + '/' : ''}${slug}" not found`));
      console.log();
      if (owner) {
        console.log(c.gray(`Make sure "${owner}" is the correct username and "${slug}" is the skill slug`));
      } else {
        console.log(c.gray('Tip: Try using the full identifier format: "owner/slug"'));
      }
      console.log();
      console.log(c.gray('Run "tasteui list" to see available skills'));
    } else if (errorMessage.includes('Authentication required')) {
      spinner.stop(c.red(`Failed: ${errorMessage}`));
      console.log();
      console.log(c.gray('Run "tasteui login" to authenticate'));
    } else if (errorMessage.includes('fetch failed') || errorMessage.includes('ECONNREFUSED')) {
      spinner.stop(c.red('Failed: Could not connect to API'));
      console.log();
      console.log(c.gray('Make sure your API is running at:'), c.cyan(apiUrl));
    } else {
      spinner.stop(c.red(`Failed: ${errorMessage}`));
      console.log();
      console.log(c.gray('Make sure your API is running at:'), c.cyan(apiUrl));
    }
  }
}
