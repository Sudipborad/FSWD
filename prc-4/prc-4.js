import { readdir, stat, mkdir, rename, writeFile } from 'fs/promises';
import { join, extname, resolve } from 'path';

const fileCategories = {
  images: ['.jpg', '.jpeg', '.png', '.gif'],
  documents: ['.pdf', '.docx', '.txt', '.xlsx'],
  videos: ['.mp4', '.mkv', '.avi'],
};

async function organizeFiles(dirPath) {
  try {
    const files = await readdir(dirPath);
    const summary = [];

    for (const file of files) {
      const filePath = join(dirPath, file);
      const fileStat = await stat(filePath);

      if (fileStat.isFile()) {
        const ext = extname(file).toLowerCase();
        let folder = 'Others';

        for (const [category, extensions] of Object.entries(fileCategories)) {
          if (extensions.includes(ext)) {
            folder = category.charAt(0).toUpperCase() + category.slice(1);
            break;
          }
        }

        const targetFolder = join(dirPath, folder);
        await mkdir(targetFolder, { recursive: true });
        const targetPath = join(targetFolder, file);

        await rename(filePath, targetPath);
        summary.push(`${file} → ${folder}`);
      }
    }

    const summaryPath = join(dirPath, 'summary.txt');
    await writeFile(summaryPath, summary.join('\n'), 'utf8');
    console.log('File organization complete. Summary saved to summary.txt');
  } catch (err) {
    console.error('Error organizing files:', err);
  }
}

const inputDir = process.argv[2];
if (!inputDir) {
  console.error('Please provide a directory path.');
  process.exit(1);
}

organizeFiles(resolve(inputDir));
