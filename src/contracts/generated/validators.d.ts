/* Generated from schemas/contracts.schema.json. Do not edit. */
import type { ErrorObject } from 'ajv';
import type {
  ContentId,
  Identifier,
  Token,
  Revision,
  Counter,
  SafeInteger,
  SafeNumber,
  Title,
  Prose,
  Description,
  Sql,
  SqlDraft,
  ContentPath,
  Timestamp,
  InputMode,
  ExecutionMode,
  HintId,
  LessonIndex,
  Chapter,
  Concept,
  Theme,
  FixtureIndex,
  Course,
  Cell,
  Row,
  QueryResult,
  Tolerance,
  ExactComparison,
  TolerantComparison,
  Comparison,
  IdeaHint,
  SyntaxHint,
  SkeletonHint,
  Hints,
  ReferenceSolution,
  TestCase,
  ExpectedFailure,
  FlowNode,
  FlowEdge,
  Flowchart,
  SqlCard,
  SqlPuzzle,
  Lesson,
  ForeignKey,
  IntegerColumn,
  RealColumn,
  TextColumn,
  FixtureColumn,
  FixtureTable,
  IndexColumn,
  FixtureIndexDefinition,
  Fixture,
  PrepareRequest,
  ReadyResponse,
  RunCaseRequest,
  RunCaseResult,
  SubmitCaseResult,
  WorkerErrorCode,
  PrepareError,
  CaseError,
  WorkerRequest,
  WorkerResponse,
  WorkerMessage,
  PuzzleDraft,
  LearningRecord,
  RecordMetadata,
  BackupPart,
} from './types';

export interface StructuralValidator<T> {
  (value: unknown): value is T;
  errors?: ErrorObject[] | null;
}
export declare const validateContentIdStructure: StructuralValidator<ContentId>;
export declare const validateIdentifierStructure: StructuralValidator<Identifier>;
export declare const validateTokenStructure: StructuralValidator<Token>;
export declare const validateRevisionStructure: StructuralValidator<Revision>;
export declare const validateCounterStructure: StructuralValidator<Counter>;
export declare const validateSafeIntegerStructure: StructuralValidator<SafeInteger>;
export declare const validateSafeNumberStructure: StructuralValidator<SafeNumber>;
export declare const validateTitleStructure: StructuralValidator<Title>;
export declare const validateProseStructure: StructuralValidator<Prose>;
export declare const validateDescriptionStructure: StructuralValidator<Description>;
export declare const validateSqlStructure: StructuralValidator<Sql>;
export declare const validateSqlDraftStructure: StructuralValidator<SqlDraft>;
export declare const validateContentPathStructure: StructuralValidator<ContentPath>;
export declare const validateTimestampStructure: StructuralValidator<Timestamp>;
export declare const validateInputModeStructure: StructuralValidator<InputMode>;
export declare const validateExecutionModeStructure: StructuralValidator<ExecutionMode>;
export declare const validateHintIdStructure: StructuralValidator<HintId>;
export declare const validateLessonIndexStructure: StructuralValidator<LessonIndex>;
export declare const validateChapterStructure: StructuralValidator<Chapter>;
export declare const validateConceptStructure: StructuralValidator<Concept>;
export declare const validateThemeStructure: StructuralValidator<Theme>;
export declare const validateFixtureIndexStructure: StructuralValidator<FixtureIndex>;
export declare const validateCourseStructure: StructuralValidator<Course>;
export declare const validateCellStructure: StructuralValidator<Cell>;
export declare const validateRowStructure: StructuralValidator<Row>;
export declare const validateQueryResultStructure: StructuralValidator<QueryResult>;
export declare const validateToleranceStructure: StructuralValidator<Tolerance>;
export declare const validateExactComparisonStructure: StructuralValidator<ExactComparison>;
export declare const validateTolerantComparisonStructure: StructuralValidator<TolerantComparison>;
export declare const validateComparisonStructure: StructuralValidator<Comparison>;
export declare const validateIdeaHintStructure: StructuralValidator<IdeaHint>;
export declare const validateSyntaxHintStructure: StructuralValidator<SyntaxHint>;
export declare const validateSkeletonHintStructure: StructuralValidator<SkeletonHint>;
export declare const validateHintsStructure: StructuralValidator<Hints>;
export declare const validateReferenceSolutionStructure: StructuralValidator<ReferenceSolution>;
export declare const validateTestCaseStructure: StructuralValidator<TestCase>;
export declare const validateExpectedFailureStructure: StructuralValidator<ExpectedFailure>;
export declare const validateFlowNodeStructure: StructuralValidator<FlowNode>;
export declare const validateFlowEdgeStructure: StructuralValidator<FlowEdge>;
export declare const validateFlowchartStructure: StructuralValidator<Flowchart>;
export declare const validateSqlCardStructure: StructuralValidator<SqlCard>;
export declare const validateSqlPuzzleStructure: StructuralValidator<SqlPuzzle>;
export declare const validateLessonStructure: StructuralValidator<Lesson>;
export declare const validateForeignKeyStructure: StructuralValidator<ForeignKey>;
export declare const validateIntegerColumnStructure: StructuralValidator<IntegerColumn>;
export declare const validateRealColumnStructure: StructuralValidator<RealColumn>;
export declare const validateTextColumnStructure: StructuralValidator<TextColumn>;
export declare const validateFixtureColumnStructure: StructuralValidator<FixtureColumn>;
export declare const validateFixtureTableStructure: StructuralValidator<FixtureTable>;
export declare const validateIndexColumnStructure: StructuralValidator<IndexColumn>;
export declare const validateFixtureIndexDefinitionStructure: StructuralValidator<FixtureIndexDefinition>;
export declare const validateFixtureStructure: StructuralValidator<Fixture>;
export declare const validatePrepareRequestStructure: StructuralValidator<PrepareRequest>;
export declare const validateReadyResponseStructure: StructuralValidator<ReadyResponse>;
export declare const validateRunCaseRequestStructure: StructuralValidator<RunCaseRequest>;
export declare const validateRunCaseResultStructure: StructuralValidator<RunCaseResult>;
export declare const validateSubmitCaseResultStructure: StructuralValidator<SubmitCaseResult>;
export declare const validateWorkerErrorCodeStructure: StructuralValidator<WorkerErrorCode>;
export declare const validatePrepareErrorStructure: StructuralValidator<PrepareError>;
export declare const validateCaseErrorStructure: StructuralValidator<CaseError>;
export declare const validateWorkerRequestStructure: StructuralValidator<WorkerRequest>;
export declare const validateWorkerResponseStructure: StructuralValidator<WorkerResponse>;
export declare const validateWorkerMessageStructure: StructuralValidator<WorkerMessage>;
export declare const validatePuzzleDraftStructure: StructuralValidator<PuzzleDraft>;
export declare const validateLearningRecordStructure: StructuralValidator<LearningRecord>;
export declare const validateRecordMetadataStructure: StructuralValidator<RecordMetadata>;
export declare const validateBackupPartStructure: StructuralValidator<BackupPart>;
