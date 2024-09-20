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
  createdAt?: InputMaybe<Scalars['String']['input']>;
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
  createdAt?: InputMaybe<Scalars['String']['input']>;
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
  deleteExercise: Array<Maybe<Exercise>>;
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

export type Query = {
  __typename?: 'Query';
  checkSession: CheckSessionResponse;
  exercise?: Maybe<Exercise>;
  exercises?: Maybe<Array<Maybe<Exercise>>>;
  user?: Maybe<User>;
  users?: Maybe<Array<Maybe<User>>>;
  workout?: Maybe<Workout>;
  workouts?: Maybe<Array<Maybe<Workout>>>;
};


export type QueryExerciseArgs = {
  uid: Scalars['ID']['input'];
};


export type QueryUserArgs = {
  uid: Scalars['ID']['input'];
};


export type QueryWorkoutArgs = {
  uid: Scalars['ID']['input'];
};

export type RefreshTokenResponse = {
  __typename?: 'RefreshTokenResponse';
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
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
  workouts: Array<Maybe<Workout>>;
};

export type Workout = {
  __typename?: 'Workout';
  comment?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  elapsedSeconds?: Maybe<Scalars['Int']['output']>;
  exercises?: Maybe<Array<Exercise>>;
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

export type UserWithWorkoutsQueryVariables = Exact<{
  uid: Scalars['ID']['input'];
}>;


export type UserWithWorkoutsQuery = { __typename?: 'Query', user?: { __typename?: 'User', firstName: string, lastName: string, workouts: Array<{ __typename?: 'Workout', uid: string, comment?: string | null, elapsedSeconds?: number | null, createdAt: string, exercises?: Array<{ __typename?: 'Exercise', uid: string, title: string, weight?: number | null, weightUnit?: string | null, sets?: number | null, reps?: number | null, repsDisplay?: string | null, comment?: string | null, elapsedSeconds?: number | null, createdAt: string }> | null } | null> } | null };

export type CheckSessionQueryVariables = Exact<{ [key: string]: never; }>;


export type CheckSessionQuery = { __typename?: 'Query', checkSession: { __typename?: 'CheckSessionResponse', isValid: boolean, user?: { __typename?: 'User', uid: string, firstName: string, lastName: string, email: string, isAuthorized: boolean, createdAt: string, tokenCount: number } | null } };


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
export const UserWithWorkoutsDocument = gql`
    query UserWithWorkouts($uid: ID!) {
  user(uid: $uid) {
    firstName
    lastName
    workouts {
      uid
      comment
      elapsedSeconds
      createdAt
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