const fs = require('fs');
const os = require('os');
const process = require('process');
const path = require('path');
const { FILE } = require('dns');
const { info } = require('console');

const folder = process.argv[2];
const workingDir = path.join(os.homedir(), 'Desktop', folder);
if (!folder || !fs.existsSync(workingDir)) {
  console.error('Please enter folder name in Pictures');
  return;
}

const videoDir = path.join(workingDir, 'videoDir');
const capturedDir = path.join(workingDir, 'capturedDir');
const duplicatedDir = path.join(workingDir, 'duplicatedDir');

!fs.existsSync(videoDir) && fs.mkdirSync(videoDir);
!fs.existsSync(capturedDir) && fs.mkdirSync(capturedDir);
!fs.existsSync(duplicatedDir) && fs.mkdirSync(duplicatedDir);

fs.promises
  .readdir(workingDir) //
  .then(processFiles)
  .catch(console.log);

function processFiles(files) {
  files.forEach((file) => {
    if (isVideoFile(file)) {
      move(file, videoDir);
    } else if (isCapturedFile(file)) {
      move(file, capturedDir);
    } else if (isDuplicatedFile(files, file)) {
      move(file, duplicatedDir);
    }
  });
}

function isVideoFile(file) {
  const redExp = /(mp4|mov)$/gm;
  const match = file.match(redExp);
  return !!match;
}
function isCapturedFile(file) {
  const redExp = /(png|aae)$/gm;
  const match = file.match(redExp);
  return !!match;
}
function isDuplicatedFile(files, file) {
  if (!file.startsWith('IMG_') || file.startsWith('IMG_E')) {
    return false;
  }
  const edited = `IMG_E${file.split('_')[1]}`;
  const found = files.find((f) => f.includes(edited));
  return !!found;
}

function move(file, targetDir) {
  console.info(`move ${file} to ${path.basename(targetDir)}`);
  const oldPath = path.join(workingDir, file);
  const newPath = path.join(targetDir, file);
  fs.promises //
    .rename(oldPath, newPath)
    .catch(console.error);
}
