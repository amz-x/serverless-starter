
const fs            = require('fs');
const path          = require('path');
const child_process = require('child_process');

const BACKUP_SRC_DIRS = [
  'lib'
];

const BACKUP_SRC_FILES = [
  'terraform.lock.hcl',
  'tfstate',
  'tfstate.backup',
  'cdktf.json',
  'main.ts',
  'package.json',
  'package-lock.json',
  'tsconfig.json'
];

const TF_BASE_DIR         = path.resolve(process.cwd());
const TF_BASE_DIR_CONTENT = fs.readdirSync(TF_BASE_DIR);
const BACKUP_DEST_DIR     = path.resolve(TF_BASE_DIR, 'backup');

// Create Backup Directory
if (!fs.existsSync(BACKUP_DEST_DIR)) {
  fs.mkdirSync(BACKUP_DEST_DIR);
}

// Backup Specified Items
for (const ITEM of TF_BASE_DIR_CONTENT) {

  // Directories
  if (BACKUP_SRC_DIRS.find(DIR => (ITEM === DIR))) {
    fs.cpSync(ITEM, `${BACKUP_DEST_DIR}/${ITEM}`, {
      recursive: true
    });
  }

  // Files
  if (BACKUP_SRC_FILES.find(FILE => (ITEM.endsWith(FILE) || ITEM === FILE))) {
    console.log(ITEM);
    fs.copyFileSync(ITEM, `${BACKUP_DEST_DIR}/${ITEM}`);
  } 
}

const uploadDate       = new Date().toISOString();
const uploadDateSplit  = uploadDate.split('T');
const uploadDateString = uploadDateSplit[0];
const uploadTimeString = (((uploadDateSplit[1].substring(0, uploadDateSplit[1].length -1)).replace('.', '')).split(':')).join('');

// Backup Terraform State
const backupTerraformState = () => {
  try {
    // Start
    console.log('Backing up Terraform State...');

    // Zip
    const zipDirectory    = path.relative(process.cwd(), BACKUP_DEST_DIR);
    const zipFile         = `${zipDirectory}.zip`
    const zipCommand      = `zip -r ${zipFile} ${zipDirectory}`;
    child_process.execSync(zipCommand);

    // Upload
    const uploadS3Bucket   = process.env.TF_STATE_BUCKET_NAME || '';
    const uploadS3Path     = `tf-state-backups/${uploadDateString}/${uploadTimeString}-backup.zip`;
    const uploadCommand    = `aws s3 cp ${zipFile} s3://${uploadS3Bucket}/${uploadS3Path}`;
    child_process.execSync(uploadCommand);
    
    // Cleanup
    fs.rmSync(zipDirectory, { recursive: true });
    fs.rmSync(zipFile);

    // Done
    console.log('Done!');
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

backupTerraformState();
