import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import standaloneCode from 'ajv/dist/standalone/index.js';
import { compile } from 'json-schema-to-typescript';
import { build } from 'esbuild';
import { format } from 'prettier';

const root = new URL('../', import.meta.url);
const schema = JSON.parse(
  await readFile(new URL('schemas/contracts.schema.json', root), 'utf8'),
);
const check = process.argv.includes('--check');
const banner =
  '/* Generated from schemas/contracts.schema.json. Do not edit. */';
const names = Object.keys(schema.definitions);
const exports = Object.fromEntries(
  names.map((name) => [
    `validate${name}Structure`,
    `${schema.$id}#/definitions/${name}`,
  ]),
);

const ajv = new Ajv({
  strict: true,
  allErrors: false,
  ownProperties: true,
  inlineRefs: false,
  coerceTypes: false,
  useDefaults: false,
  removeAdditional: false,
  code: { source: true, esm: true, lines: true },
});
addFormats(ajv);
ajv.addSchema(schema);

// Bundle only standalone helpers, never the Ajv compiler, into browser-safe ESM.
const bundled = await build({
  stdin: {
    contents: standaloneCode(ajv, exports),
    resolveDir: fileURLToPath(root),
    sourcefile: 'standalone-validators.js',
  },
  bundle: true,
  platform: 'browser',
  format: 'esm',
  target: 'es2023',
  write: false,
  legalComments: 'none',
  banner: { js: banner },
});
if (bundled.outputFiles.length !== 1) {
  throw new Error('Expected exactly one standalone validator module.');
}
const validators = bundled.outputFiles[0].text;
if (/\beval\s*\(|\bnew\s+Function\s*\(/u.test(validators)) {
  throw new Error('Standalone output must not compile code at runtime.');
}

const types = await compile(schema, 'SqlQuestContract', {
  bannerComment: banner,
  cwd: fileURLToPath(root),
  unreachableDefinitions: true,
  // TS describes value shapes; Schema enforces array lengths without huge tuples.
  ignoreMinAndMaxItems: true,
  unknownAny: true,
  format: true,
});
const declarations = await format(
  `${banner}
import type { ErrorObject } from 'ajv';
import type { ${names.join(', ')} } from './types';

export interface StructuralValidator<T> {
  (value: unknown): value is T;
  errors?: ErrorObject[] | null;
}
${names
  .map(
    (name) =>
      `export declare const validate${name}Structure: StructuralValidator<${name}>;`,
  )
  .join('\n')}
`,
  { parser: 'typescript', singleQuote: true },
);

const output = new URL('src/contracts/generated/', root);
const files = {
  'types.d.ts': types,
  'validators.js': validators,
  'validators.d.ts': declarations,
};
if (!check) await mkdir(output, { recursive: true });
for (const [name, contents] of Object.entries(files)) {
  const path = new URL(name, output);
  if (check) {
    const existing = await readFile(path, 'utf8').catch((error) => {
      if (error.code === 'ENOENT') return null;
      throw error;
    });
    if (existing !== contents) {
      throw new Error(`${name} is missing or stale. Run npm run generate.`);
    }
  } else {
    await writeFile(path, contents);
  }
}
console.log(
  `${check ? 'Verified' : 'Generated'} types and ${names.length} standalone structural validators.`,
);
