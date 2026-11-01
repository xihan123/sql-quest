/* Generated from schemas/contracts.schema.json. Do not edit. */

/**
 * The sole SQL Quest machine contract. Generated TypeScript and standalone validators validate structure, not trusted content or protocol state.
 */
export type SqlQuestContract = Course | Lesson | Fixture | WorkerMessage | LearningRecord | RecordMetadata | BackupPart;
export type ContentId = string;
export type Revision = number;
export type Title = string;
export type Prose = string;
/**
 * Source or published relative path. URL origin, directory, duplicate address, self-reference and release checks are semantic checks.
 */
export type ContentPath = string;
export type Identifier = string;
export type SqlDraft = string;
/**
 * @minItems 3
 * @maxItems 3
 */
export type Hints = [IdeaHint, SyntaxHint, SkeletonHint];
export type Sql = string;
export type Comparison = ExactComparison | TolerantComparison;
export type Cell = null | SafeNumber | string;
/**
 * Finite JSON number; integral REAL values must also be safe integers.
 */
export type SafeNumber = number;
/**
 * @minItems 1
 * @maxItems 100
 */
export type Row = Cell[];
export type Description = string;
export type FixtureColumn = IntegerColumn | RealColumn | TextColumn;
export type SafeInteger = number;
export type WorkerMessage = WorkerRequest | WorkerResponse;
export type WorkerRequest = PrepareRequest | RunCaseRequest;
export type Token = string;
export type ExecutionMode = "run" | "submit";
export type InputMode = "text" | "puzzle";
export type WorkerResponse = ReadyResponse | RunCaseResult | SubmitCaseResult | PrepareError | CaseError;
export type WorkerErrorCode =
  "invalid-request" | "protocol" | "engine-load" | "sql" | "forbidden" | "limit" | "comparison" | "internal";
export type HintId = "idea" | "syntax" | "skeleton";
export type Counter = number;
export type Timestamp = string;

export interface Course {
  schemaVersion: 1;
  id: ContentId;
  revision: Revision;
  title: Title;
  objective: Prose;
  dialect: "sqlite";
  /**
   * @minItems 1
   * @maxItems 64
   */
  themes: Theme[];
  /**
   * @minItems 0
   * @maxItems 1024
   */
  fixtures: FixtureIndex[];
}
export interface Theme {
  id: ContentId;
  title: Title;
  /**
   * @minItems 1
   * @maxItems 64
   */
  chapters: Chapter[];
  /**
   * @minItems 0
   * @maxItems 256
   */
  concepts: Concept[];
}
export interface Chapter {
  id: ContentId;
  title: Title;
  /**
   * @minItems 1
   * @maxItems 256
   */
  lessons: LessonIndex[];
}
export interface LessonIndex {
  id: ContentId;
  title: Title;
  /**
   * @minItems 0
   * @maxItems 256
   */
  prerequisites: ContentId[];
  path: ContentPath | null;
}
export interface Concept {
  id: ContentId;
  title: Title;
  introducedAt: ContentId;
}
export interface FixtureIndex {
  id: ContentId;
  path: ContentPath;
}
export interface Lesson {
  schemaVersion: 1;
  courseId: ContentId;
  themeId: ContentId;
  chapterId: ContentId;
  id: ContentId;
  revision: Revision;
  dialect: "sqlite";
  mode: "guided" | "practice" | "challenge";
  title: Title;
  /**
   * @minItems 0
   * @maxItems 256
   */
  prerequisites: ContentId[];
  /**
   * @minItems 0
   * @maxItems 256
   */
  concepts: ContentId[];
  /**
   * @minItems 0
   * @maxItems 256
   */
  introducedConcepts: ContentId[];
  objective: Prose;
  statement: Prose;
  /**
   * @minItems 1
   * @maxItems 32
   */
  knowledge: Prose[];
  /**
   * @minItems 1
   * @maxItems 64
   */
  readableTables: Identifier[];
  previewFixtureId: ContentId;
  duplicatePolicy: "preserve" | "distinct";
  starterSql: SqlDraft;
  hints: Hints;
  /**
   * @minItems 1
   * @maxItems 16
   */
  referenceSolutions: ReferenceSolution[];
  comparison: Comparison;
  /**
   * @minItems 1
   * @maxItems 100
   */
  tests: TestCase[];
  /**
   * @minItems 1
   * @maxItems 100
   */
  expectedFailures: ExpectedFailure[];
  flowchart?: Flowchart;
  sqlPuzzle?: SqlPuzzle;
}
export interface IdeaHint {
  id: "idea";
  text: Prose;
}
export interface SyntaxHint {
  id: "syntax";
  text: Prose;
}
export interface SkeletonHint {
  id: "skeleton";
  text: Prose;
}
export interface ReferenceSolution {
  sql: Sql;
  explanation: Prose;
}
export interface ExactComparison {
  rowOrder: "ordered" | "unordered";
  columnNames: "exact";
  numbers: "exact";
}
export interface TolerantComparison {
  rowOrder: "ordered" | "unordered";
  columnNames: "exact";
  numbers: "tolerant";
  /**
   * @minItems 1
   * @maxItems 100
   */
  tolerances: Tolerance[];
}
export interface Tolerance {
  column: number;
  absTolerance: number;
  relTolerance: number;
}
export interface TestCase {
  id: ContentId;
  fixtureId: ContentId;
  expected: QueryResult;
}
export interface QueryResult {
  /**
   * @minItems 1
   * @maxItems 100
   */
  columns: string[];
  /**
   * @minItems 0
   * @maxItems 1000
   */
  rows: Row[];
}
export interface ExpectedFailure {
  id: ContentId;
  sql: Sql;
}
export interface Flowchart {
  exampleSql: Sql;
  /**
   * @minItems 1
   * @maxItems 20
   */
  nodes: FlowNode[];
  /**
   * @minItems 0
   * @maxItems 32
   */
  edges: FlowEdge[];
}
export interface FlowNode {
  id: ContentId;
  label: Title;
  description: Description;
}
export interface FlowEdge {
  from: ContentId;
  to: ContentId;
  label?: Title;
}
export interface SqlPuzzle {
  /**
   * @minItems 2
   * @maxItems 40
   */
  cards: SqlCard[];
  /**
   * @minItems 1
   * @maxItems 40
   */
  solutionOrder: ContentId[];
}
export interface SqlCard {
  id: ContentId;
  sql: string;
}
export interface Fixture {
  schemaVersion: 1;
  id: ContentId;
  /**
   * @minItems 1
   * @maxItems 64
   */
  tables: FixtureTable[];
  /**
   * @minItems 0
   * @maxItems 128
   */
  indexes?: FixtureIndexDefinition[];
}
export interface FixtureTable {
  name: Identifier;
  description: Description;
  /**
   * @minItems 1
   * @maxItems 100
   */
  columns: FixtureColumn[];
  /**
   * @minItems 0
   * @maxItems 5000
   */
  rows: Row[];
}
export interface IntegerColumn {
  name: Identifier;
  description: Description;
  /**
   * Omitted means false; validators do not insert defaults.
   */
  nullable?: boolean;
  primaryKey?: boolean;
  references?: ForeignKey;
  type: "INTEGER";
  minimum?: SafeInteger;
}
export interface ForeignKey {
  table: Identifier;
  column: Identifier;
}
export interface RealColumn {
  name: Identifier;
  description: Description;
  /**
   * Omitted means false; validators do not insert defaults.
   */
  nullable?: boolean;
  primaryKey?: boolean;
  references?: ForeignKey;
  type: "REAL";
  minimum?: SafeNumber;
}
export interface TextColumn {
  name: Identifier;
  description: Description;
  /**
   * Omitted means false; validators do not insert defaults.
   */
  nullable?: boolean;
  primaryKey?: boolean;
  references?: ForeignKey;
  type: "TEXT";
}
export interface FixtureIndexDefinition {
  name: Identifier;
  table: Identifier;
  /**
   * @minItems 1
   * @maxItems 100
   */
  columns: IndexColumn[];
}
export interface IndexColumn {
  name: Identifier;
  direction: "ASC" | "DESC";
}
export interface PrepareRequest {
  type: "prepare";
  schemaVersion: 1;
  requestId: Token;
  contentToken: Token;
  rootRevision: Revision;
  courseId: ContentId;
  themeId: ContentId;
  lessonId: ContentId;
  lessonRevision: Revision;
  mode: ExecutionMode;
  inputMode: InputMode;
  sql: Sql;
  lesson: Lesson;
  /**
   * @minItems 1
   * @maxItems 100
   */
  fixtures: Fixture[];
}
export interface RunCaseRequest {
  type: "run-case";
  schemaVersion: 1;
  requestId: Token;
  contentToken: Token;
  rootRevision: Revision;
  courseId: ContentId;
  themeId: ContentId;
  lessonId: ContentId;
  lessonRevision: Revision;
  caseId: ContentId;
  caseIndex: number;
}
export interface ReadyResponse {
  type: "ready";
  schemaVersion: 1;
  requestId: Token;
  contentToken: Token;
  rootRevision: Revision;
  courseId: ContentId;
  themeId: ContentId;
  lessonId: ContentId;
  lessonRevision: Revision;
}
export interface RunCaseResult {
  type: "case-result";
  schemaVersion: 1;
  requestId: Token;
  contentToken: Token;
  rootRevision: Revision;
  courseId: ContentId;
  themeId: ContentId;
  lessonId: ContentId;
  lessonRevision: Revision;
  caseId: ContentId;
  caseIndex: number;
  mode: "run";
  outcome: "executed";
  result: QueryResult;
}
export interface SubmitCaseResult {
  type: "case-result";
  schemaVersion: 1;
  requestId: Token;
  contentToken: Token;
  rootRevision: Revision;
  courseId: ContentId;
  themeId: ContentId;
  lessonId: ContentId;
  lessonRevision: Revision;
  caseId: ContentId;
  caseIndex: number;
  mode: "submit";
  outcome: "passed" | "mismatch";
  result: QueryResult;
}
export interface PrepareError {
  type: "error";
  schemaVersion: 1;
  requestId: Token;
  contentToken: Token;
  rootRevision: Revision;
  courseId: ContentId;
  themeId: ContentId;
  lessonId: ContentId;
  lessonRevision: Revision;
  phase: "prepare";
  code: WorkerErrorCode;
  message: Description;
}
export interface CaseError {
  type: "error";
  schemaVersion: 1;
  requestId: Token;
  contentToken: Token;
  rootRevision: Revision;
  courseId: ContentId;
  themeId: ContentId;
  lessonId: ContentId;
  lessonRevision: Revision;
  caseId: ContentId;
  caseIndex: number;
  phase: "case";
  code: WorkerErrorCode;
  message: Description;
}
export interface LearningRecord {
  schemaVersion: 1;
  courseId: ContentId;
  themeId: ContentId;
  lessonId: ContentId;
  revision: Revision;
  draftSql: SqlDraft;
  puzzleDraft?: PuzzleDraft;
  inputMode: InputMode;
  passed: boolean;
  /**
   * @minItems 0
   * @maxItems 3
   */
  viewedHintIds: HintId[];
  reviewMarked: boolean;
}
export interface PuzzleDraft {
  /**
   * @minItems 0
   * @maxItems 40
   */
  cardOrder: ContentId[];
  sql: SqlDraft;
}
export interface RecordMetadata {
  schemaVersion: 1;
  recordSetVersion: Counter;
  recordGeneration: Counter;
}
export interface BackupPart {
  schemaVersion: 1;
  exportedAt: Timestamp;
  backupId: Token;
  partIndex: Revision;
  partCount: Revision;
  /**
   * @minItems 0
   * @maxItems 10000
   */
  records: LearningRecord[];
}
