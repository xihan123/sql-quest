import { readFile } from 'node:fs/promises';
import type { Fixture } from '../src/contracts/generated/types.d.ts';
import { validateCourse } from '../src/content/semantics.ts';
import { registeredPaths } from '../src/content/urls.ts';

export async function sourceContent() {
  const directory = new URL('../content/', import.meta.url);
  const course = validateCourse(
    JSON.parse(await readFile(new URL('course.json', directory), 'utf8')),
  );
  const documents = new Map<string, unknown>();
  for (const path of registeredPaths(course))
    documents.set(
      path,
      JSON.parse(await readFile(new URL(path, directory), 'utf8')),
    );
  return { course, documents };
}

export async function publishedContent() {
  const { course, documents } = await sourceContent();
  const prefix = `releases/r${course.revision}/`;
  for (const theme of course.themes)
    for (const chapter of theme.chapters)
      for (const lesson of chapter.lessons)
        if (lesson.path) lesson.path = prefix + lesson.path;
  for (const fixture of course.fixtures) fixture.path = prefix + fixture.path;
  return {
    course,
    documents: new Map(
      [...documents].map(([path, value]) => [prefix + path, value]),
    ),
  };
}

export function trickyFixture(): Fixture {
  return {
    schemaVersion: 1,
    id: 'quotes-v1',
    tables: [
      {
        name: 'child',
        description: 'Child first, foreign key checked after loading.',
        columns: [
          { name: 'id', type: 'INTEGER', primaryKey: true, description: 'ID' },
          {
            name: 'parent_id',
            type: 'TEXT',
            nullable: true,
            references: { table: 'parent', column: 'id' },
            description: 'Parent',
          },
          {
            name: 'amount',
            type: 'REAL',
            minimum: -1.5,
            description: 'Number',
          },
          { name: 'note', type: 'TEXT', nullable: true, description: 'Text' },
        ],
        rows: [
          [1, "O'Brien", -1.5, "'); DROP TABLE parent; --"],
          [2, null, 2, null],
          [3, "O'Brien", 3.5, ''],
          [4, null, 0, 'NULL'],
          [5, null, 1, 'a\0b'],
        ],
      },
      {
        name: 'parent',
        description: 'Parent',
        columns: [
          { name: 'id', type: 'TEXT', primaryKey: true, description: 'ID' },
        ],
        rows: [["O'Brien"]],
      },
    ],
    indexes: [
      {
        name: 'child_amount',
        table: 'child',
        columns: [{ name: 'amount', direction: 'DESC' }],
      },
    ],
  };
}
