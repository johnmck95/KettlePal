import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type AddExerciseInput = {
  comment?: InputMaybe<Scalars['String']['input']>;
  elapsedSeconds?: InputMaybe<Scalars['Int']['input']>;
  key?: InputMaybe<Scalars['String']['input']>;
  multiplier?: InputMaybe<Scalars['Float']['input']>;
  reps?: InputMaybe<Scalars['String']['input']>;
  repsDisplay?: InputMaybe<Scalars['String']['input']>;
  sets?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
  weight?: InputMaybe<Scalars['String']['input']>;
  weightUnit?: InputMaybe<Scalars['String']['input']>;
};

export type AddOrEditUserInput = {
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  password: Scalars['String']['input'];
  tokenCount: Scalars['Int']['input'];
};

export type AddOrEditWorkoutInput = {
  comment?: InputMaybe<Scalars['String']['input']>;
  date: Scalars['String']['input'];
  elapsedSeconds?: InputMaybe<Scalars['Int']['input']>;
};

export type AddOrUpdateSettingsInput = {
  bodyWeight?: InputMaybe<Scalars['Float']['input']>;
  bodyWeightUnit?: InputMaybe<Scalars['String']['input']>;
  templates: Array<AddOrUpdateTemplateInput>;
};

export type AddOrUpdateTemplateInput = {
  index: Scalars['Int']['input'];
  isBodyWeight: Scalars['Boolean']['input'];
  multiplier?: InputMaybe<Scalars['Float']['input']>;
  repsDisplay?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
  weightUnit?: InputMaybe<Scalars['String']['input']>;
};

export type AddUserInput = {
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type AddWorkoutWithExercisesInput = {
  comment?: InputMaybe<Scalars['String']['input']>;
  date: Scalars['String']['input'];
  elapsedSeconds?: InputMaybe<Scalars['Int']['input']>;
  exercises: Array<InputMaybe<AddExerciseInput>>;
};

export type CheckSessionResponse = {
  __typename?: 'CheckSessionResponse';
  isValid: Scalars['Boolean']['output'];
  user?: Maybe<User>;
};

export type DateRangeInput = {
  end: Scalars['String']['input'];
  start: Scalars['String']['input'];
};

export type EditExerciseInput = {
  comment?: InputMaybe<Scalars['String']['input']>;
  elapsedSeconds?: InputMaybe<Scalars['Int']['input']>;
  reps?: InputMaybe<Scalars['String']['input']>;
  repsDisplay?: InputMaybe<Scalars['String']['input']>;
  sets?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
  weight?: InputMaybe<Scalars['String']['input']>;
  weightUnit?: InputMaybe<Scalars['String']['input']>;
};

export type EditUserInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
};

export type Exercise = {
  __typename?: 'Exercise';
  comment?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  elapsedSeconds?: Maybe<Scalars['Int']['output']>;
  multiplier: Scalars['Float']['output'];
  reps?: Maybe<Scalars['Int']['output']>;
  repsDisplay?: Maybe<Scalars['String']['output']>;
  sets?: Maybe<Scalars['Int']['output']>;
  title: Scalars['String']['output'];
  uid: Scalars['ID']['output'];
  weight?: Maybe<Scalars['Float']['output']>;
  weightUnit?: Maybe<Scalars['String']['output']>;
  workoutUid: Scalars['ID']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addExercise?: Maybe<Exercise>;
  addOrUpdateSettings: UserWithTemplates;
  addUser?: Maybe<User>;
  addWorkout?: Maybe<Workout>;
  addWorkoutWithExercises: Workout;
  deleteExercise: Exercise;
  deleteUser: Array<Maybe<User>>;
  deleteWorkout: Array<Maybe<Workout>>;
  deleteWorkoutWithExercises: Workout;
  invalidateToken: Scalars['Boolean']['output'];
  login?: Maybe<User>;
  refreshToken: RefreshTokenResponse;
  signUp?: Maybe<User>;
  updateExercise?: Maybe<Exercise>;
  updateUser?: Maybe<User>;
  updateWorkout?: Maybe<Workout>;
  updateWorkoutWithExercises?: Maybe<Workout>;
};


export type MutationAddExerciseArgs = {
  exercise: AddExerciseInput;
  workoutUid: Scalars['ID']['input'];
};


export type MutationAddOrUpdateSettingsArgs = {
  settings: AddOrUpdateSettingsInput;
  userUid: Scalars['ID']['input'];
};


export type MutationAddUserArgs = {
  user: AddUserInput;
};


export type MutationAddWorkoutArgs = {
  userUid: Scalars['ID']['input'];
  workout: AddOrEditWorkoutInput;
};


export type MutationAddWorkoutWithExercisesArgs = {
  userUid: Scalars['ID']['input'];
  workoutWithExercises: AddWorkoutWithExercisesInput;
};


export type MutationDeleteExerciseArgs = {
  uid: Scalars['ID']['input'];
};


export type MutationDeleteUserArgs = {
  uid: Scalars['ID']['input'];
};


export type MutationDeleteWorkoutArgs = {
  uid: Scalars['ID']['input'];
};


export type MutationDeleteWorkoutWithExercisesArgs = {
  workoutUid: Scalars['ID']['input'];
};


export type MutationLoginArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationSignUpArgs = {
  user: AddUserInput;
};


export type MutationUpdateExerciseArgs = {
  edits: EditExerciseInput;
  uid: Scalars['ID']['input'];
};


export type MutationUpdateUserArgs = {
  edits: EditUserInput;
  uid: Scalars['ID']['input'];
};


export type MutationUpdateWorkoutArgs = {
  edits: AddOrEditWorkoutInput;
  uid: Scalars['ID']['input'];
};


export type MutationUpdateWorkoutWithExercisesArgs = {
  workoutUid: Scalars['ID']['input'];
  workoutWithExercises: UpdateWorkoutWithExercisesInput;
};

export type Query = {
  __typename?: 'Query';
  checkSession: CheckSessionResponse;
  exercise?: Maybe<Exercise>;
  exercises?: Maybe<Array<Maybe<Exercise>>>;
  pastWorkouts?: Maybe<UserPastWorkouts>;
  uniqueExerciseTitles: Array<Scalars['String']['output']>;
  user?: Maybe<User>;
  users?: Maybe<Array<Maybe<User>>>;
  workout?: Maybe<Workout>;
  workouts?: Maybe<Array<Maybe<Workout>>>;
};


export type QueryExerciseArgs = {
  uid: Scalars['ID']['input'];
};


export type QueryPastWorkoutsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  searchQuery?: InputMaybe<Scalars['String']['input']>;
  userUid: Scalars['ID']['input'];
};


export type QueryUniqueExerciseTitlesArgs = {
  userUid: Scalars['ID']['input'];
};


export type QueryUserArgs = {
  uid: Scalars['ID']['input'];
};


export type QueryWorkoutArgs = {
  uid: Scalars['ID']['input'];
};


export type QueryWorkoutsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type RefreshTokenResponse = {
  __typename?: 'RefreshTokenResponse';
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type Template = {
  __typename?: 'Template';
  createdAt: Scalars['String']['output'];
  index: Scalars['Int']['output'];
  isBodyWeight: Scalars['Boolean']['output'];
  multiplier: Scalars['Float']['output'];
  repsDisplay?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  uid: Scalars['ID']['output'];
  userUid: Scalars['ID']['output'];
  weightUnit?: Maybe<Scalars['String']['output']>;
};

export enum TimeGrain {
  Day = 'DAY',
  Month = 'MONTH',
  Week = 'WEEK',
  Year = 'YEAR'
}

export type UpdateExerciseInput = {
  comment?: InputMaybe<Scalars['String']['input']>;
  elapsedSeconds?: InputMaybe<Scalars['Int']['input']>;
  key?: InputMaybe<Scalars['String']['input']>;
  multiplier: Scalars['Float']['input'];
  reps?: InputMaybe<Scalars['String']['input']>;
  repsDisplay?: InputMaybe<Scalars['String']['input']>;
  sets?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
  uid: Scalars['ID']['input'];
  weight?: InputMaybe<Scalars['String']['input']>;
  weightUnit?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateWorkoutWithExercisesInput = {
  comment?: InputMaybe<Scalars['String']['input']>;
  date: Scalars['String']['input'];
  elapsedSeconds?: InputMaybe<Scalars['Int']['input']>;
  exercises: Array<InputMaybe<UpdateExerciseInput>>;
};

export type User = {
  __typename?: 'User';
  bodyWeight: Scalars['Float']['output'];
  bodyWeightUnit: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  isAuthorized: Scalars['Boolean']['output'];
  lastName: Scalars['String']['output'];
  password: Scalars['String']['output'];
  templates: Array<Template>;
  tokenCount: Scalars['Int']['output'];
  uid: Scalars['ID']['output'];
  userStats?: Maybe<UserStats>;
  workoutTrends: WorkoutTrendResponse;
  workouts: Array<Maybe<Workout>>;
};


export type UserWorkoutTrendsArgs = {
  grain: TimeGrain;
  range: DateRangeInput;
};


export type UserWorkoutsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type UserPastWorkouts = {
  __typename?: 'UserPastWorkouts';
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  isAuthorized: Scalars['Boolean']['output'];
  lastName: Scalars['String']['output'];
  password: Scalars['String']['output'];
  uid: Scalars['ID']['output'];
  workoutWithExercises: Array<Maybe<WorkoutWithExercises>>;
};

export type UserStats = {
  __typename?: 'UserStats';
  bodyWeight: Scalars['Float']['output'];
  bodyWeightUnit: Scalars['String']['output'];
  largestWorkCapacityKg?: Maybe<Scalars['Float']['output']>;
  longestWorkout?: Maybe<Scalars['Int']['output']>;
  mostRepsInWorkout?: Maybe<Scalars['Int']['output']>;
  oldestWorkoutDate?: Maybe<Scalars['String']['output']>;
  topExercises?: Maybe<Scalars['String']['output']>;
  totalExercises: Scalars['Int']['output'];
  totalTime?: Maybe<Scalars['Int']['output']>;
  totalWorkouts: Scalars['Int']['output'];
};

export type UserWithTemplates = {
  __typename?: 'UserWithTemplates';
  templates: Array<Template>;
  user: User;
};

export type Workout = {
  __typename?: 'Workout';
  comment?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  date: Scalars['String']['output'];
  elapsedSeconds?: Maybe<Scalars['Int']['output']>;
  exercises?: Maybe<Array<Exercise>>;
  uid: Scalars['ID']['output'];
  userUid: Scalars['ID']['output'];
};

export type WorkoutAggregate = {
  __typename?: 'WorkoutAggregate';
  durationSeconds: Scalars['Int']['output'];
  periodEnd: Scalars['String']['output'];
  periodStart: Scalars['String']['output'];
  workCapacityKg: Scalars['Float']['output'];
};

export type WorkoutTrendResponse = {
  __typename?: 'WorkoutTrendResponse';
  buckets: Array<WorkoutAggregate>;
  grain: TimeGrain;
  rangeEnd: Scalars['String']['output'];
  rangeStart: Scalars['String']['output'];
};

export type WorkoutWithExercises = {
  __typename?: 'WorkoutWithExercises';
  comment?: Maybe<Scalars['String']['output']>;
  date: Scalars['String']['output'];
  elapsedSeconds?: Maybe<Scalars['Int']['output']>;
  exercises: Array<Exercise>;
  uid: Scalars['ID']['output'];
  userUid: Scalars['ID']['output'];
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  AddExerciseInput: AddExerciseInput;
  AddOrEditUserInput: AddOrEditUserInput;
  AddOrEditWorkoutInput: AddOrEditWorkoutInput;
  AddOrUpdateSettingsInput: AddOrUpdateSettingsInput;
  AddOrUpdateTemplateInput: AddOrUpdateTemplateInput;
  AddUserInput: AddUserInput;
  AddWorkoutWithExercisesInput: AddWorkoutWithExercisesInput;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CheckSessionResponse: ResolverTypeWrapper<CheckSessionResponse>;
  DateRangeInput: DateRangeInput;
  EditExerciseInput: EditExerciseInput;
  EditUserInput: EditUserInput;
  Exercise: ResolverTypeWrapper<Exercise>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  RefreshTokenResponse: ResolverTypeWrapper<RefreshTokenResponse>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Template: ResolverTypeWrapper<Template>;
  TimeGrain: TimeGrain;
  UpdateExerciseInput: UpdateExerciseInput;
  UpdateWorkoutWithExercisesInput: UpdateWorkoutWithExercisesInput;
  User: ResolverTypeWrapper<User>;
  UserPastWorkouts: ResolverTypeWrapper<UserPastWorkouts>;
  UserStats: ResolverTypeWrapper<UserStats>;
  UserWithTemplates: ResolverTypeWrapper<UserWithTemplates>;
  Workout: ResolverTypeWrapper<Workout>;
  WorkoutAggregate: ResolverTypeWrapper<WorkoutAggregate>;
  WorkoutTrendResponse: ResolverTypeWrapper<WorkoutTrendResponse>;
  WorkoutWithExercises: ResolverTypeWrapper<WorkoutWithExercises>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  AddExerciseInput: AddExerciseInput;
  AddOrEditUserInput: AddOrEditUserInput;
  AddOrEditWorkoutInput: AddOrEditWorkoutInput;
  AddOrUpdateSettingsInput: AddOrUpdateSettingsInput;
  AddOrUpdateTemplateInput: AddOrUpdateTemplateInput;
  AddUserInput: AddUserInput;
  AddWorkoutWithExercisesInput: AddWorkoutWithExercisesInput;
  Boolean: Scalars['Boolean']['output'];
  CheckSessionResponse: CheckSessionResponse;
  DateRangeInput: DateRangeInput;
  EditExerciseInput: EditExerciseInput;
  EditUserInput: EditUserInput;
  Exercise: Exercise;
  Float: Scalars['Float']['output'];
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  Mutation: {};
  Query: {};
  RefreshTokenResponse: RefreshTokenResponse;
  String: Scalars['String']['output'];
  Template: Template;
  UpdateExerciseInput: UpdateExerciseInput;
  UpdateWorkoutWithExercisesInput: UpdateWorkoutWithExercisesInput;
  User: User;
  UserPastWorkouts: UserPastWorkouts;
  UserStats: UserStats;
  UserWithTemplates: UserWithTemplates;
  Workout: Workout;
  WorkoutAggregate: WorkoutAggregate;
  WorkoutTrendResponse: WorkoutTrendResponse;
  WorkoutWithExercises: WorkoutWithExercises;
}>;

export type CheckSessionResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['CheckSessionResponse'] = ResolversParentTypes['CheckSessionResponse']> = ResolversObject<{
  isValid?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ExerciseResolvers<ContextType = any, ParentType extends ResolversParentTypes['Exercise'] = ResolversParentTypes['Exercise']> = ResolversObject<{
  comment?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  elapsedSeconds?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  multiplier?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  reps?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  repsDisplay?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  sets?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  uid?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  weight?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  weightUnit?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  workoutUid?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  addExercise?: Resolver<Maybe<ResolversTypes['Exercise']>, ParentType, ContextType, RequireFields<MutationAddExerciseArgs, 'exercise' | 'workoutUid'>>;
  addOrUpdateSettings?: Resolver<ResolversTypes['UserWithTemplates'], ParentType, ContextType, RequireFields<MutationAddOrUpdateSettingsArgs, 'settings' | 'userUid'>>;
  addUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationAddUserArgs, 'user'>>;
  addWorkout?: Resolver<Maybe<ResolversTypes['Workout']>, ParentType, ContextType, RequireFields<MutationAddWorkoutArgs, 'userUid' | 'workout'>>;
  addWorkoutWithExercises?: Resolver<ResolversTypes['Workout'], ParentType, ContextType, RequireFields<MutationAddWorkoutWithExercisesArgs, 'userUid' | 'workoutWithExercises'>>;
  deleteExercise?: Resolver<ResolversTypes['Exercise'], ParentType, ContextType, RequireFields<MutationDeleteExerciseArgs, 'uid'>>;
  deleteUser?: Resolver<Array<Maybe<ResolversTypes['User']>>, ParentType, ContextType, RequireFields<MutationDeleteUserArgs, 'uid'>>;
  deleteWorkout?: Resolver<Array<Maybe<ResolversTypes['Workout']>>, ParentType, ContextType, RequireFields<MutationDeleteWorkoutArgs, 'uid'>>;
  deleteWorkoutWithExercises?: Resolver<ResolversTypes['Workout'], ParentType, ContextType, RequireFields<MutationDeleteWorkoutWithExercisesArgs, 'workoutUid'>>;
  invalidateToken?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  login?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationLoginArgs, 'email' | 'password'>>;
  refreshToken?: Resolver<ResolversTypes['RefreshTokenResponse'], ParentType, ContextType>;
  signUp?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationSignUpArgs, 'user'>>;
  updateExercise?: Resolver<Maybe<ResolversTypes['Exercise']>, ParentType, ContextType, RequireFields<MutationUpdateExerciseArgs, 'edits' | 'uid'>>;
  updateUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationUpdateUserArgs, 'edits' | 'uid'>>;
  updateWorkout?: Resolver<Maybe<ResolversTypes['Workout']>, ParentType, ContextType, RequireFields<MutationUpdateWorkoutArgs, 'edits' | 'uid'>>;
  updateWorkoutWithExercises?: Resolver<Maybe<ResolversTypes['Workout']>, ParentType, ContextType, RequireFields<MutationUpdateWorkoutWithExercisesArgs, 'workoutUid' | 'workoutWithExercises'>>;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  checkSession?: Resolver<ResolversTypes['CheckSessionResponse'], ParentType, ContextType>;
  exercise?: Resolver<Maybe<ResolversTypes['Exercise']>, ParentType, ContextType, RequireFields<QueryExerciseArgs, 'uid'>>;
  exercises?: Resolver<Maybe<Array<Maybe<ResolversTypes['Exercise']>>>, ParentType, ContextType>;
  pastWorkouts?: Resolver<Maybe<ResolversTypes['UserPastWorkouts']>, ParentType, ContextType, RequireFields<QueryPastWorkoutsArgs, 'userUid'>>;
  uniqueExerciseTitles?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType, RequireFields<QueryUniqueExerciseTitlesArgs, 'userUid'>>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserArgs, 'uid'>>;
  users?: Resolver<Maybe<Array<Maybe<ResolversTypes['User']>>>, ParentType, ContextType>;
  workout?: Resolver<Maybe<ResolversTypes['Workout']>, ParentType, ContextType, RequireFields<QueryWorkoutArgs, 'uid'>>;
  workouts?: Resolver<Maybe<Array<Maybe<ResolversTypes['Workout']>>>, ParentType, ContextType, Partial<QueryWorkoutsArgs>>;
}>;

export type RefreshTokenResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['RefreshTokenResponse'] = ResolversParentTypes['RefreshTokenResponse']> = ResolversObject<{
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TemplateResolvers<ContextType = any, ParentType extends ResolversParentTypes['Template'] = ResolversParentTypes['Template']> = ResolversObject<{
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  index?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  isBodyWeight?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  multiplier?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  repsDisplay?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  uid?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  userUid?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  weightUnit?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  bodyWeight?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  bodyWeightUnit?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  firstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  isAuthorized?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  lastName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  password?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  templates?: Resolver<Array<ResolversTypes['Template']>, ParentType, ContextType>;
  tokenCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  uid?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  userStats?: Resolver<Maybe<ResolversTypes['UserStats']>, ParentType, ContextType>;
  workoutTrends?: Resolver<ResolversTypes['WorkoutTrendResponse'], ParentType, ContextType, RequireFields<UserWorkoutTrendsArgs, 'grain' | 'range'>>;
  workouts?: Resolver<Array<Maybe<ResolversTypes['Workout']>>, ParentType, ContextType, Partial<UserWorkoutsArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserPastWorkoutsResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserPastWorkouts'] = ResolversParentTypes['UserPastWorkouts']> = ResolversObject<{
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  firstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  isAuthorized?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  lastName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  password?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  uid?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  workoutWithExercises?: Resolver<Array<Maybe<ResolversTypes['WorkoutWithExercises']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserStatsResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserStats'] = ResolversParentTypes['UserStats']> = ResolversObject<{
  bodyWeight?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  bodyWeightUnit?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  largestWorkCapacityKg?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  longestWorkout?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  mostRepsInWorkout?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  oldestWorkoutDate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  topExercises?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  totalExercises?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalTime?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  totalWorkouts?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserWithTemplatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserWithTemplates'] = ResolversParentTypes['UserWithTemplates']> = ResolversObject<{
  templates?: Resolver<Array<ResolversTypes['Template']>, ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type WorkoutResolvers<ContextType = any, ParentType extends ResolversParentTypes['Workout'] = ResolversParentTypes['Workout']> = ResolversObject<{
  comment?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  elapsedSeconds?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  exercises?: Resolver<Maybe<Array<ResolversTypes['Exercise']>>, ParentType, ContextType>;
  uid?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  userUid?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type WorkoutAggregateResolvers<ContextType = any, ParentType extends ResolversParentTypes['WorkoutAggregate'] = ResolversParentTypes['WorkoutAggregate']> = ResolversObject<{
  durationSeconds?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  periodEnd?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  periodStart?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  workCapacityKg?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type WorkoutTrendResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['WorkoutTrendResponse'] = ResolversParentTypes['WorkoutTrendResponse']> = ResolversObject<{
  buckets?: Resolver<Array<ResolversTypes['WorkoutAggregate']>, ParentType, ContextType>;
  grain?: Resolver<ResolversTypes['TimeGrain'], ParentType, ContextType>;
  rangeEnd?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  rangeStart?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type WorkoutWithExercisesResolvers<ContextType = any, ParentType extends ResolversParentTypes['WorkoutWithExercises'] = ResolversParentTypes['WorkoutWithExercises']> = ResolversObject<{
  comment?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  date?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  elapsedSeconds?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  exercises?: Resolver<Array<ResolversTypes['Exercise']>, ParentType, ContextType>;
  uid?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  userUid?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  CheckSessionResponse?: CheckSessionResponseResolvers<ContextType>;
  Exercise?: ExerciseResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  RefreshTokenResponse?: RefreshTokenResponseResolvers<ContextType>;
  Template?: TemplateResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserPastWorkouts?: UserPastWorkoutsResolvers<ContextType>;
  UserStats?: UserStatsResolvers<ContextType>;
  UserWithTemplates?: UserWithTemplatesResolvers<ContextType>;
  Workout?: WorkoutResolvers<ContextType>;
  WorkoutAggregate?: WorkoutAggregateResolvers<ContextType>;
  WorkoutTrendResponse?: WorkoutTrendResponseResolvers<ContextType>;
  WorkoutWithExercises?: WorkoutWithExercisesResolvers<ContextType>;
}>;

