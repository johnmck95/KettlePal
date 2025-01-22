import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
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

export type UpdateExerciseInput = {
  comment?: InputMaybe<Scalars['String']['input']>;
  elapsedSeconds?: InputMaybe<Scalars['Int']['input']>;
  key?: InputMaybe<Scalars['String']['input']>;
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
  createdAt: Scalars['String']['output'];
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  isAuthorized: Scalars['Boolean']['output'];
  lastName: Scalars['String']['output'];
  password: Scalars['String']['output'];
  tokenCount: Scalars['Int']['output'];
  uid: Scalars['ID']['output'];
  userStats?: Maybe<UserStats>;
  workouts: Array<Maybe<Workout>>;
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
  largestWorkCapacityKg: Scalars['Int']['output'];
  longestWorkout: Scalars['Int']['output'];
  mostRepsInWorkout: Scalars['Int']['output'];
  oldestWorkoutDate: Scalars['String']['output'];
  topThreeExercises: Scalars['String']['output'];
  totalExercises: Scalars['Int']['output'];
  totalTime: Scalars['Int']['output'];
  totalWorkouts: Scalars['Int']['output'];
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

export type WorkoutWithExercises = {
  __typename?: 'WorkoutWithExercises';
  comment?: Maybe<Scalars['String']['output']>;
  date: Scalars['String']['output'];
  elapsedSeconds?: Maybe<Scalars['Int']['output']>;
  exercises: Array<Exercise>;
  uid: Scalars['ID']['output'];
  userUid: Scalars['ID']['output'];
};

export type LoginMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login?: { __typename?: 'User', uid: string } | null };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', invalidateToken: boolean };

export type AddWorkoutWithExercisesMutationVariables = Exact<{
  userUid: Scalars['ID']['input'];
  workoutWithExercises: AddWorkoutWithExercisesInput;
}>;


export type AddWorkoutWithExercisesMutation = { __typename?: 'Mutation', addWorkoutWithExercises: { __typename?: 'Workout', uid: string, userUid: string, exercises?: Array<{ __typename?: 'Exercise', uid: string, title: string }> | null } };

export type DeleteWorkoutWithExercisesMutationVariables = Exact<{
  workoutUid: Scalars['ID']['input'];
}>;


export type DeleteWorkoutWithExercisesMutation = { __typename?: 'Mutation', deleteWorkoutWithExercises: { __typename?: 'Workout', uid: string } };

export type UpdateExerciseMutationVariables = Exact<{
  uid: Scalars['ID']['input'];
  edits: EditExerciseInput;
}>;


export type UpdateExerciseMutation = { __typename?: 'Mutation', updateExercise?: { __typename?: 'Exercise', uid: string, title: string, weight?: number | null, weightUnit?: string | null, sets?: number | null, reps?: number | null, repsDisplay?: string | null, comment?: string | null, elapsedSeconds?: number | null, createdAt: string, workoutUid: string } | null };

export type DeleteExerciseMutationVariables = Exact<{
  uid: Scalars['ID']['input'];
}>;


export type DeleteExerciseMutation = { __typename?: 'Mutation', deleteExercise: { __typename?: 'Exercise', uid: string } };

export type UpdateWorkoutWithExercisesMutationVariables = Exact<{
  workoutUid: Scalars['ID']['input'];
  workoutWithExercises: UpdateWorkoutWithExercisesInput;
}>;


export type UpdateWorkoutWithExercisesMutation = { __typename?: 'Mutation', updateWorkoutWithExercises?: { __typename?: 'Workout', date: string, comment?: string | null, exercises?: Array<{ __typename?: 'Exercise', title: string, reps?: number | null, sets?: number | null }> | null } | null };

export type FuzzySearchQueryVariables = Exact<{
  userUid: Scalars['ID']['input'];
  offset?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  searchQuery?: InputMaybe<Scalars['String']['input']>;
}>;


export type FuzzySearchQuery = { __typename?: 'Query', pastWorkouts?: { __typename?: 'UserPastWorkouts', firstName: string, lastName: string, workoutWithExercises: Array<{ __typename?: 'WorkoutWithExercises', uid: string, comment?: string | null, elapsedSeconds?: number | null, date: string, exercises: Array<{ __typename?: 'Exercise', uid: string, title: string, weight?: number | null, weightUnit?: string | null, sets?: number | null, reps?: number | null, repsDisplay?: string | null, comment?: string | null, elapsedSeconds?: number | null, createdAt: string }> } | null> } | null };

export type UserWithWorkoutsQueryVariables = Exact<{
  uid: Scalars['ID']['input'];
  offset?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type UserWithWorkoutsQuery = { __typename?: 'Query', user?: { __typename?: 'User', firstName: string, lastName: string, workouts: Array<{ __typename?: 'Workout', uid: string, comment?: string | null, elapsedSeconds?: number | null, date: string, exercises?: Array<{ __typename?: 'Exercise', uid: string, title: string, weight?: number | null, weightUnit?: string | null, sets?: number | null, reps?: number | null, repsDisplay?: string | null, comment?: string | null, elapsedSeconds?: number | null, createdAt: string }> | null } | null> } | null };

export type CheckSessionQueryVariables = Exact<{ [key: string]: never; }>;


export type CheckSessionQuery = { __typename?: 'Query', checkSession: { __typename?: 'CheckSessionResponse', isValid: boolean, user?: { __typename?: 'User', uid: string, firstName: string, lastName: string, email: string, isAuthorized: boolean, createdAt: string, tokenCount: number } | null } };

export type UserStatsQueryVariables = Exact<{
  uid: Scalars['ID']['input'];
}>;


export type UserStatsQuery = { __typename?: 'Query', user?: { __typename?: 'User', userStats?: { __typename?: 'UserStats', totalWorkouts: number, totalExercises: number, totalTime: number, longestWorkout: number, mostRepsInWorkout: number, largestWorkCapacityKg: number, topThreeExercises: string, oldestWorkoutDate: string } | null } | null };


export const LoginDocument = gql`
    mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    uid
  }
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = gql`
    mutation Logout {
  invalidateToken
}
    `;
export type LogoutMutationFn = Apollo.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: Apollo.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, options);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const AddWorkoutWithExercisesDocument = gql`
    mutation addWorkoutWithExercises($userUid: ID!, $workoutWithExercises: AddWorkoutWithExercisesInput!) {
  addWorkoutWithExercises(
    userUid: $userUid
    workoutWithExercises: $workoutWithExercises
  ) {
    uid
    userUid
    exercises {
      uid
      title
    }
  }
}
    `;
export type AddWorkoutWithExercisesMutationFn = Apollo.MutationFunction<AddWorkoutWithExercisesMutation, AddWorkoutWithExercisesMutationVariables>;

/**
 * __useAddWorkoutWithExercisesMutation__
 *
 * To run a mutation, you first call `useAddWorkoutWithExercisesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddWorkoutWithExercisesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addWorkoutWithExercisesMutation, { data, loading, error }] = useAddWorkoutWithExercisesMutation({
 *   variables: {
 *      userUid: // value for 'userUid'
 *      workoutWithExercises: // value for 'workoutWithExercises'
 *   },
 * });
 */
export function useAddWorkoutWithExercisesMutation(baseOptions?: Apollo.MutationHookOptions<AddWorkoutWithExercisesMutation, AddWorkoutWithExercisesMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddWorkoutWithExercisesMutation, AddWorkoutWithExercisesMutationVariables>(AddWorkoutWithExercisesDocument, options);
      }
export type AddWorkoutWithExercisesMutationHookResult = ReturnType<typeof useAddWorkoutWithExercisesMutation>;
export type AddWorkoutWithExercisesMutationResult = Apollo.MutationResult<AddWorkoutWithExercisesMutation>;
export type AddWorkoutWithExercisesMutationOptions = Apollo.BaseMutationOptions<AddWorkoutWithExercisesMutation, AddWorkoutWithExercisesMutationVariables>;
export const DeleteWorkoutWithExercisesDocument = gql`
    mutation deleteWorkoutWithExercises($workoutUid: ID!) {
  deleteWorkoutWithExercises(workoutUid: $workoutUid) {
    uid
  }
}
    `;
export type DeleteWorkoutWithExercisesMutationFn = Apollo.MutationFunction<DeleteWorkoutWithExercisesMutation, DeleteWorkoutWithExercisesMutationVariables>;

/**
 * __useDeleteWorkoutWithExercisesMutation__
 *
 * To run a mutation, you first call `useDeleteWorkoutWithExercisesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteWorkoutWithExercisesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteWorkoutWithExercisesMutation, { data, loading, error }] = useDeleteWorkoutWithExercisesMutation({
 *   variables: {
 *      workoutUid: // value for 'workoutUid'
 *   },
 * });
 */
export function useDeleteWorkoutWithExercisesMutation(baseOptions?: Apollo.MutationHookOptions<DeleteWorkoutWithExercisesMutation, DeleteWorkoutWithExercisesMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteWorkoutWithExercisesMutation, DeleteWorkoutWithExercisesMutationVariables>(DeleteWorkoutWithExercisesDocument, options);
      }
export type DeleteWorkoutWithExercisesMutationHookResult = ReturnType<typeof useDeleteWorkoutWithExercisesMutation>;
export type DeleteWorkoutWithExercisesMutationResult = Apollo.MutationResult<DeleteWorkoutWithExercisesMutation>;
export type DeleteWorkoutWithExercisesMutationOptions = Apollo.BaseMutationOptions<DeleteWorkoutWithExercisesMutation, DeleteWorkoutWithExercisesMutationVariables>;
export const UpdateExerciseDocument = gql`
    mutation updateExercise($uid: ID!, $edits: EditExerciseInput!) {
  updateExercise(uid: $uid, edits: $edits) {
    uid
    title
    weight
    weightUnit
    sets
    reps
    repsDisplay
    comment
    elapsedSeconds
    createdAt
    workoutUid
  }
}
    `;
export type UpdateExerciseMutationFn = Apollo.MutationFunction<UpdateExerciseMutation, UpdateExerciseMutationVariables>;

/**
 * __useUpdateExerciseMutation__
 *
 * To run a mutation, you first call `useUpdateExerciseMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateExerciseMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateExerciseMutation, { data, loading, error }] = useUpdateExerciseMutation({
 *   variables: {
 *      uid: // value for 'uid'
 *      edits: // value for 'edits'
 *   },
 * });
 */
export function useUpdateExerciseMutation(baseOptions?: Apollo.MutationHookOptions<UpdateExerciseMutation, UpdateExerciseMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateExerciseMutation, UpdateExerciseMutationVariables>(UpdateExerciseDocument, options);
      }
export type UpdateExerciseMutationHookResult = ReturnType<typeof useUpdateExerciseMutation>;
export type UpdateExerciseMutationResult = Apollo.MutationResult<UpdateExerciseMutation>;
export type UpdateExerciseMutationOptions = Apollo.BaseMutationOptions<UpdateExerciseMutation, UpdateExerciseMutationVariables>;
export const DeleteExerciseDocument = gql`
    mutation deleteExercise($uid: ID!) {
  deleteExercise(uid: $uid) {
    uid
  }
}
    `;
export type DeleteExerciseMutationFn = Apollo.MutationFunction<DeleteExerciseMutation, DeleteExerciseMutationVariables>;

/**
 * __useDeleteExerciseMutation__
 *
 * To run a mutation, you first call `useDeleteExerciseMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteExerciseMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteExerciseMutation, { data, loading, error }] = useDeleteExerciseMutation({
 *   variables: {
 *      uid: // value for 'uid'
 *   },
 * });
 */
export function useDeleteExerciseMutation(baseOptions?: Apollo.MutationHookOptions<DeleteExerciseMutation, DeleteExerciseMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteExerciseMutation, DeleteExerciseMutationVariables>(DeleteExerciseDocument, options);
      }
export type DeleteExerciseMutationHookResult = ReturnType<typeof useDeleteExerciseMutation>;
export type DeleteExerciseMutationResult = Apollo.MutationResult<DeleteExerciseMutation>;
export type DeleteExerciseMutationOptions = Apollo.BaseMutationOptions<DeleteExerciseMutation, DeleteExerciseMutationVariables>;
export const UpdateWorkoutWithExercisesDocument = gql`
    mutation UpdateWorkoutWithExercises($workoutUid: ID!, $workoutWithExercises: UpdateWorkoutWithExercisesInput!) {
  updateWorkoutWithExercises(
    workoutUid: $workoutUid
    workoutWithExercises: $workoutWithExercises
  ) {
    date
    comment
    exercises {
      title
      reps
      sets
    }
  }
}
    `;
export type UpdateWorkoutWithExercisesMutationFn = Apollo.MutationFunction<UpdateWorkoutWithExercisesMutation, UpdateWorkoutWithExercisesMutationVariables>;

/**
 * __useUpdateWorkoutWithExercisesMutation__
 *
 * To run a mutation, you first call `useUpdateWorkoutWithExercisesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateWorkoutWithExercisesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateWorkoutWithExercisesMutation, { data, loading, error }] = useUpdateWorkoutWithExercisesMutation({
 *   variables: {
 *      workoutUid: // value for 'workoutUid'
 *      workoutWithExercises: // value for 'workoutWithExercises'
 *   },
 * });
 */
export function useUpdateWorkoutWithExercisesMutation(baseOptions?: Apollo.MutationHookOptions<UpdateWorkoutWithExercisesMutation, UpdateWorkoutWithExercisesMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateWorkoutWithExercisesMutation, UpdateWorkoutWithExercisesMutationVariables>(UpdateWorkoutWithExercisesDocument, options);
      }
export type UpdateWorkoutWithExercisesMutationHookResult = ReturnType<typeof useUpdateWorkoutWithExercisesMutation>;
export type UpdateWorkoutWithExercisesMutationResult = Apollo.MutationResult<UpdateWorkoutWithExercisesMutation>;
export type UpdateWorkoutWithExercisesMutationOptions = Apollo.BaseMutationOptions<UpdateWorkoutWithExercisesMutation, UpdateWorkoutWithExercisesMutationVariables>;
export const FuzzySearchDocument = gql`
    query FuzzySearch($userUid: ID!, $offset: Int, $limit: Int, $searchQuery: String) {
  pastWorkouts(
    userUid: $userUid
    searchQuery: $searchQuery
    limit: $limit
    offset: $offset
  ) {
    firstName
    lastName
    workoutWithExercises {
      uid
      comment
      elapsedSeconds
      date
      exercises {
        uid
        title
        weight
        weightUnit
        sets
        reps
        repsDisplay
        comment
        elapsedSeconds
        createdAt
      }
    }
  }
}
    `;

/**
 * __useFuzzySearchQuery__
 *
 * To run a query within a React component, call `useFuzzySearchQuery` and pass it any options that fit your needs.
 * When your component renders, `useFuzzySearchQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFuzzySearchQuery({
 *   variables: {
 *      userUid: // value for 'userUid'
 *      offset: // value for 'offset'
 *      limit: // value for 'limit'
 *      searchQuery: // value for 'searchQuery'
 *   },
 * });
 */
export function useFuzzySearchQuery(baseOptions: Apollo.QueryHookOptions<FuzzySearchQuery, FuzzySearchQueryVariables> & ({ variables: FuzzySearchQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FuzzySearchQuery, FuzzySearchQueryVariables>(FuzzySearchDocument, options);
      }
export function useFuzzySearchLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FuzzySearchQuery, FuzzySearchQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FuzzySearchQuery, FuzzySearchQueryVariables>(FuzzySearchDocument, options);
        }
export function useFuzzySearchSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<FuzzySearchQuery, FuzzySearchQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<FuzzySearchQuery, FuzzySearchQueryVariables>(FuzzySearchDocument, options);
        }
export type FuzzySearchQueryHookResult = ReturnType<typeof useFuzzySearchQuery>;
export type FuzzySearchLazyQueryHookResult = ReturnType<typeof useFuzzySearchLazyQuery>;
export type FuzzySearchSuspenseQueryHookResult = ReturnType<typeof useFuzzySearchSuspenseQuery>;
export type FuzzySearchQueryResult = Apollo.QueryResult<FuzzySearchQuery, FuzzySearchQueryVariables>;
export const UserWithWorkoutsDocument = gql`
    query UserWithWorkouts($uid: ID!, $offset: Int, $limit: Int) {
  user(uid: $uid) {
    firstName
    lastName
    workouts(offset: $offset, limit: $limit) {
      uid
      comment
      elapsedSeconds
      date
      exercises {
        uid
        title
        weight
        weightUnit
        sets
        reps
        repsDisplay
        comment
        elapsedSeconds
        createdAt
      }
    }
  }
}
    `;

/**
 * __useUserWithWorkoutsQuery__
 *
 * To run a query within a React component, call `useUserWithWorkoutsQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserWithWorkoutsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserWithWorkoutsQuery({
 *   variables: {
 *      uid: // value for 'uid'
 *      offset: // value for 'offset'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useUserWithWorkoutsQuery(baseOptions: Apollo.QueryHookOptions<UserWithWorkoutsQuery, UserWithWorkoutsQueryVariables> & ({ variables: UserWithWorkoutsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UserWithWorkoutsQuery, UserWithWorkoutsQueryVariables>(UserWithWorkoutsDocument, options);
      }
export function useUserWithWorkoutsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserWithWorkoutsQuery, UserWithWorkoutsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UserWithWorkoutsQuery, UserWithWorkoutsQueryVariables>(UserWithWorkoutsDocument, options);
        }
export function useUserWithWorkoutsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<UserWithWorkoutsQuery, UserWithWorkoutsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<UserWithWorkoutsQuery, UserWithWorkoutsQueryVariables>(UserWithWorkoutsDocument, options);
        }
export type UserWithWorkoutsQueryHookResult = ReturnType<typeof useUserWithWorkoutsQuery>;
export type UserWithWorkoutsLazyQueryHookResult = ReturnType<typeof useUserWithWorkoutsLazyQuery>;
export type UserWithWorkoutsSuspenseQueryHookResult = ReturnType<typeof useUserWithWorkoutsSuspenseQuery>;
export type UserWithWorkoutsQueryResult = Apollo.QueryResult<UserWithWorkoutsQuery, UserWithWorkoutsQueryVariables>;
export const CheckSessionDocument = gql`
    query CheckSession {
  checkSession {
    isValid
    user {
      uid
      firstName
      lastName
      email
      isAuthorized
      createdAt
      tokenCount
    }
  }
}
    `;

/**
 * __useCheckSessionQuery__
 *
 * To run a query within a React component, call `useCheckSessionQuery` and pass it any options that fit your needs.
 * When your component renders, `useCheckSessionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCheckSessionQuery({
 *   variables: {
 *   },
 * });
 */
export function useCheckSessionQuery(baseOptions?: Apollo.QueryHookOptions<CheckSessionQuery, CheckSessionQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CheckSessionQuery, CheckSessionQueryVariables>(CheckSessionDocument, options);
      }
export function useCheckSessionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CheckSessionQuery, CheckSessionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CheckSessionQuery, CheckSessionQueryVariables>(CheckSessionDocument, options);
        }
export function useCheckSessionSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<CheckSessionQuery, CheckSessionQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<CheckSessionQuery, CheckSessionQueryVariables>(CheckSessionDocument, options);
        }
export type CheckSessionQueryHookResult = ReturnType<typeof useCheckSessionQuery>;
export type CheckSessionLazyQueryHookResult = ReturnType<typeof useCheckSessionLazyQuery>;
export type CheckSessionSuspenseQueryHookResult = ReturnType<typeof useCheckSessionSuspenseQuery>;
export type CheckSessionQueryResult = Apollo.QueryResult<CheckSessionQuery, CheckSessionQueryVariables>;
export const UserStatsDocument = gql`
    query UserStats($uid: ID!) {
  user(uid: $uid) {
    userStats {
      totalWorkouts
      totalExercises
      totalTime
      longestWorkout
      mostRepsInWorkout
      largestWorkCapacityKg
      topThreeExercises
      oldestWorkoutDate
    }
  }
}
    `;

/**
 * __useUserStatsQuery__
 *
 * To run a query within a React component, call `useUserStatsQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserStatsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserStatsQuery({
 *   variables: {
 *      uid: // value for 'uid'
 *   },
 * });
 */
export function useUserStatsQuery(baseOptions: Apollo.QueryHookOptions<UserStatsQuery, UserStatsQueryVariables> & ({ variables: UserStatsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UserStatsQuery, UserStatsQueryVariables>(UserStatsDocument, options);
      }
export function useUserStatsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserStatsQuery, UserStatsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UserStatsQuery, UserStatsQueryVariables>(UserStatsDocument, options);
        }
export function useUserStatsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<UserStatsQuery, UserStatsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<UserStatsQuery, UserStatsQueryVariables>(UserStatsDocument, options);
        }
export type UserStatsQueryHookResult = ReturnType<typeof useUserStatsQuery>;
export type UserStatsLazyQueryHookResult = ReturnType<typeof useUserStatsLazyQuery>;
export type UserStatsSuspenseQueryHookResult = ReturnType<typeof useUserStatsSuspenseQuery>;
export type UserStatsQueryResult = Apollo.QueryResult<UserStatsQuery, UserStatsQueryVariables>;