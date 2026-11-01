import type { PrepareRequest } from '../src/contracts/generated/types.d.ts';
import { validateContent } from '../src/content/semantics.ts';
import { sourceContent } from './content-helpers.ts';

export async function engineRequest(
  sql = 'SELECT title, price FROM books;',
  mode: 'run' | 'submit' = 'submit',
): Promise<PrepareRequest> {
  const { course, documents } = await sourceContent();
  const content = validateContent(course, documents);
  const lesson = content.lessons[0];
  if (!lesson) throw new Error('Missing test lesson');
  return {
    type: 'prepare',
    schemaVersion: 1,
    requestId: crypto.randomUUID(),
    contentToken: 'test-content',
    rootRevision: course.revision,
    courseId: course.id,
    themeId: lesson.themeId,
    lessonId: lesson.id,
    lessonRevision: lesson.revision,
    mode,
    inputMode: 'text',
    sql,
    lesson,
    fixtures: content.fixtures.filter((fixture) =>
      mode === 'submit'
        ? lesson.tests.some((testCase) => testCase.fixtureId === fixture.id)
        : fixture.id === lesson.previewFixtureId,
    ),
  };
}
