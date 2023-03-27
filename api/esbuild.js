// esbuild.js
const { join, resolve }     = require('node:path');
const { build }             = require('esbuild');
const { esbuildDecorators } = require('@anatine/esbuild-decorators');

// Nest JS Patch Fix
// const { fix } = require('nestjs-esm-fix');

// API - package.json
const pkg = require('./package.json');

// Self invoked build function
(async () => {

  // Current Working Directory
  const cwd         = process.cwd();

  // TS Config
  const tsconfig    = join(cwd, 'tsconfig.build.json');

  // Input Directory
  const indir       = resolve(cwd, 'src');

  // Output Directory
  const outdir      = join(cwd, 'dist');

  // Entry Point
  const entryPoints = [ resolve(indir, 'lambda.ts'), resolve(indir, 'main.ts') ];

  // Build process / results
  const buildResult = await build({
    tsconfig:     tsconfig,
    entryPoints:  entryPoints,
    platform:     'node',
    target:       [ 'node18' ],
    format:       'cjs',
    sourcemap:    'external',
    bundle:       true,
    keepNames:    true,
    treeShaking:  true,
    minify:       false,
    outdir:       outdir,
    loader:       { '.node': 'file' },
    plugins:      [ esbuildDecorators({ cwd, tsconfig }),
      // ignorePlugin([{ resourceRegExp: /class-transformer|class-validator|cache-manager|pg-native$/, contentRegExp: /node_modules/ }])
    ],
    external: [ 
      '@nestjs/websockets',
      '@nestjs/microservices',
      'cache-manager',
      'class-transformer',
      'class-validator',
      'pg-native'
    ]
  });

  // Errors
  if (buildResult.errors.length > 0 && buildResult.warnings.length > 0) {
    console.error('Errors: ', buildResult.errors);
    console.warn('Warnings: ', buildResult.warnings);
  } else {
    console.log(`Finished building ${pkg.name} 🚀`);
  }

  // await fix({
  //   cwd:                  cwd,
  //   target:               `${outdir}/*.js`,
  //   openapiComplexTypes:  true,
  //   openapiVar:           true,
  //   openapiMeta:          true,
  //   dirnameVar:           true,
  //   importify:            true,
  //   requireMain:          true,
  //   redocTpl:             false
  // });

})();
