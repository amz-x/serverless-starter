const { globby }    = require('globby');
const { extname }   = require('node:path');
const { patchFile } = require('./patch.js');

const defaults = {
  openapiComplexTypes: true,
  openapiMeta: true,
  openapiVar: true,
  dirnameVar: true,
  importify: true,
  requireMain: true,
  redocTpl: true,
};

const fix = async ({ target, cwd = process.cwd(), ..._opts }) => {
  if (!target) {
    throw new Error('target is required')
  }

  const opts = { ...defaults, ..._opts }
  const pattern = target.includes('*')
    ? target
    : extname(target)
    ? target
    : `${target}/**/*`
  const files = await globby(pattern, { onlyFiles: true, absolute: true, cwd })

  await Promise.all(files.map((file) => patchFile(file, opts)))
};

module.exports = [ fix ];
