"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
var knexfile_js_1 = require("../knexfile.js");
var knex_1 = require("knex");
var bcrypt = require("bcrypt");
var verifyExercises_js_1 = require("./utils/verifyExercises.js");
var verifyWorkout_js_1 = require("./utils/verifyWorkout.js");
var formatDataForDB_js_1 = require("./utils/formatDataForDB.js");
var auth_js_1 = require("./utils/auth.js");
var NotAuthorizedError_js_1 = require("./utils/Errors/NotAuthorizedError.js");
// Incoming Resolver Properties are: (parent, args, context)
var knexInstance = (0, knex_1.default)(knexfile_js_1.default);
exports.resolvers = {
    // The top-level resolvers inside Query are the entry point resolvers for the graph, not nested queries like workout{ exercises{...} }
    Query: {
        users: function (_1, __1, _a) {
            return __awaiter(this, arguments, void 0, function (_, __, _b) {
                var error_1;
                var req = _b.req;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            if (!req.userUid) {
                                throw new NotAuthorizedError_js_1.NotAuthorizedError();
                            }
                            _c.label = 1;
                        case 1:
                            _c.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, knexInstance("users").select("*")];
                        case 2: return [2 /*return*/, _c.sent()];
                        case 3:
                            error_1 = _c.sent();
                            console.error("Error fetching users:", error_1);
                            throw error_1;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        },
        user: function (_1, _a, _b) {
            return __awaiter(this, arguments, void 0, function (_, _c, _d) {
                var error_2;
                var uid = _c.uid;
                var req = _d.req;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            if (!req.userUid || req.userUid !== uid) {
                                throw new NotAuthorizedError_js_1.NotAuthorizedError();
                            }
                            _e.label = 1;
                        case 1:
                            _e.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, knexInstance("users")
                                    .select("*")
                                    .where({ uid: uid })
                                    .first()];
                        case 2: return [2 /*return*/, _e.sent()];
                        case 3:
                            error_2 = _e.sent();
                            console.error("Error fetching user:", error_2);
                            throw error_2;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        },
        workouts: function (_1, __1, _a) {
            return __awaiter(this, arguments, void 0, function (_, __, _b) {
                var error_3;
                var req = _b.req;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            if (!req.userUid) {
                                throw new NotAuthorizedError_js_1.NotAuthorizedError();
                            }
                            _c.label = 1;
                        case 1:
                            _c.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, knexInstance.raw("\n            SELECT *\n            FROM workouts\n            WHERE \"userUid\" = ?\n            ORDER BY date::date DESC\n          ", [req.userUid])];
                        case 2: return [2 /*return*/, (_c.sent()).rows];
                        case 3:
                            error_3 = _c.sent();
                            console.error("Error fetching workouts:", error_3);
                            throw error_3;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        },
        workout: function (_1, _a, _b) {
            return __awaiter(this, arguments, void 0, function (_, _c, _d) {
                var error_4;
                var uid = _c.uid;
                var req = _d.req;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            if (!req.userUid) {
                                throw new NotAuthorizedError_js_1.NotAuthorizedError();
                            }
                            _e.label = 1;
                        case 1:
                            _e.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, knexInstance("workouts")
                                    .select("*")
                                    .where({ uid: uid })
                                    .first()];
                        case 2: return [2 /*return*/, _e.sent()];
                        case 3:
                            error_4 = _e.sent();
                            console.error("Error fetching workout:", error_4);
                            throw error_4;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        },
        exercises: function (_1, __1, _a) {
            return __awaiter(this, arguments, void 0, function (_, __, _b) {
                var error_5;
                var req = _b.req;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            if (!req.userUid) {
                                throw new NotAuthorizedError_js_1.NotAuthorizedError();
                            }
                            _c.label = 1;
                        case 1:
                            _c.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, knexInstance("exercises").select("*")];
                        case 2: return [2 /*return*/, _c.sent()];
                        case 3:
                            error_5 = _c.sent();
                            console.error("Error fetching exercises:", error_5);
                            throw error_5;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        },
        exercise: function (_1, _a, _b) {
            return __awaiter(this, arguments, void 0, function (_, _c, _d) {
                var error_6;
                var uid = _c.uid;
                var req = _d.req;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            if (!req.userUid) {
                                throw new NotAuthorizedError_js_1.NotAuthorizedError();
                            }
                            _e.label = 1;
                        case 1:
                            _e.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, knexInstance("exercises")
                                    .select("*")
                                    .where({ uid: uid })
                                    .first()];
                        case 2: return [2 /*return*/, _e.sent()];
                        case 3:
                            error_6 = _e.sent();
                            console.error("Error fetching exercises:", error_6);
                            throw error_6;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        },
        checkSession: function (_, __, _a) {
            var req = _a.req;
            // Middleware is responsible for validating JWTs
            if (req.userUid) {
                var user = knexInstance("users").where({ uid: req.userUid }).first();
                return {
                    isValid: true,
                    user: user,
                };
            }
            else {
                return { isValid: false };
            }
        },
    },
    // Resolvers to gather nested fields within a User query (EX: User{ workouts{...} })
    User: {
        workouts: function (parent) {
            return __awaiter(this, void 0, void 0, function () {
                var error_7;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, knexInstance.raw("\n              SELECT *\n              FROM workouts\n              WHERE \"userUid\" = ?\n              ORDER BY date::date DESC\n            ", [parent.uid])];
                        case 1: return [2 /*return*/, (_a.sent()).rows];
                        case 2:
                            error_7 = _a.sent();
                            console.error("Error fetching workouts:", error_7);
                            throw error_7;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        },
    },
    // This is the resolver for returning all exercises within a workout
    Workout: {
        exercises: function (parent_1, __1, _a) {
            return __awaiter(this, arguments, void 0, function (parent, __, _b) {
                var error_8;
                var req = _b.req;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            if (!req.userUid || req.userUid !== parent.userUid) {
                                throw new NotAuthorizedError_js_1.NotAuthorizedError();
                            }
                            _c.label = 1;
                        case 1:
                            _c.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, knexInstance("exercises")
                                    .select("*")
                                    .where({ workoutUid: parent.uid })];
                        case 2: return [2 /*return*/, _c.sent()];
                        case 3:
                            error_8 = _c.sent();
                            console.error("Error fetching exercises:", error_8);
                            throw error_8;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        },
    },
    // Takes in the same args as our query resolvers
    Mutation: {
        addUser: function (_1, _a, _b) {
            return __awaiter(this, arguments, void 0, function (_, _c, _d) {
                var newUser, insertedUser, error_9;
                var user = _c.user;
                var req = _d.req;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            if (!req.userUid) {
                                throw new NotAuthorizedError_js_1.NotAuthorizedError();
                            }
                            _e.label = 1;
                        case 1:
                            _e.trys.push([1, 4, , 5]);
                            newUser = __assign(__assign({}, user), { isAuthorized: false });
                            return [4 /*yield*/, knexInstance("users").insert(newUser)];
                        case 2:
                            _e.sent();
                            return [4 /*yield*/, knexInstance("users")
                                    .where({
                                    email: user.email,
                                    firstName: user.firstName,
                                    lastName: user.lastName,
                                })
                                    .first()];
                        case 3:
                            insertedUser = _e.sent();
                            return [2 /*return*/, insertedUser];
                        case 4:
                            error_9 = _e.sent();
                            console.error("Error adding user:", error_9);
                            throw error_9;
                        case 5: return [2 /*return*/];
                    }
                });
            });
        },
        addWorkoutWithExercises: function (_1, _a, _b) {
            return __awaiter(this, arguments, void 0, function (_, _c, _d) {
                var newExercises, newWorkout, isWorkoutValid, areExercisesValid, addedWorkoutWithExercises, error_10;
                var userUid = _c.userUid, workoutWithExercises = _c.workoutWithExercises;
                var req = _d.req;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            if (!userUid) {
                                throw new Error("userUid required to addWorkoutWithExercises");
                            }
                            if (!req.userUid || req.userUid !== userUid) {
                                throw new NotAuthorizedError_js_1.NotAuthorizedError();
                            }
                            newExercises = (0, formatDataForDB_js_1.formatExercisesForDB)(workoutWithExercises.exercises);
                            newWorkout = (0, formatDataForDB_js_1.formatWorkoutForDB)(workoutWithExercises, userUid);
                            isWorkoutValid = (0, verifyWorkout_js_1.verifyWorkout)(newWorkout);
                            if (isWorkoutValid.result === false) {
                                throw new Error(isWorkoutValid.reason);
                            }
                            areExercisesValid = (0, verifyExercises_js_1.verifyExercises)({ exercises: newExercises });
                            if (areExercisesValid.result === false) {
                                throw new Error(areExercisesValid.reason);
                            }
                            _e.label = 1;
                        case 1:
                            _e.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, knexInstance.transaction(function (trx) {
                                    return __awaiter(this, void 0, void 0, function () {
                                        var workout_1, exercises, error_11;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    _a.trys.push([0, 3, , 5]);
                                                    return [4 /*yield*/, trx("workouts")
                                                            .returning("*")
                                                            .insert(newWorkout)];
                                                case 1:
                                                    workout_1 = (_a.sent())[0];
                                                    return [4 /*yield*/, Promise.all(newExercises.map(function (exercise) {
                                                            return trx("exercises")
                                                                .returning("*")
                                                                .insert(__assign(__assign({}, exercise), { workoutUid: workout_1.uid }));
                                                        }))];
                                                case 2:
                                                    exercises = (_a.sent())[0];
                                                    return [2 /*return*/, __assign(__assign({}, workout_1), { exercises: exercises })];
                                                case 3:
                                                    error_11 = _a.sent();
                                                    console.log(error_11.message);
                                                    return [4 /*yield*/, trx.rollback()];
                                                case 4:
                                                    _a.sent();
                                                    throw new Error("Failed to create workout with exercises.");
                                                case 5: return [2 /*return*/];
                                            }
                                        });
                                    });
                                })];
                        case 2:
                            addedWorkoutWithExercises = _e.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            error_10 = _e.sent();
                            console.log(error_10.message);
                            throw new Error("Failed to create workout with exercises.");
                        case 4: return [2 /*return*/, addedWorkoutWithExercises];
                    }
                });
            });
        },
        addWorkout: function (_1, _a, _b) {
            return __awaiter(this, arguments, void 0, function (_, _c, _d) {
                var newWorkout, insertedWorkout, error_12;
                var userUid = _c.userUid, workout = _c.workout;
                var req = _d.req;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            if (!req.userUid || req.userUid !== userUid) {
                                throw new NotAuthorizedError_js_1.NotAuthorizedError();
                            }
                            _e.label = 1;
                        case 1:
                            _e.trys.push([1, 4, , 5]);
                            newWorkout = __assign(__assign({}, workout), { userUid: userUid });
                            return [4 /*yield*/, knexInstance("workouts").insert(newWorkout)];
                        case 2:
                            _e.sent();
                            return [4 /*yield*/, knexInstance("workouts")
                                    .where({
                                    comment: workout.comment,
                                    userUid: userUid,
                                })
                                    .first()];
                        case 3:
                            insertedWorkout = _e.sent();
                            return [2 /*return*/, insertedWorkout];
                        case 4:
                            error_12 = _e.sent();
                            console.error("Error adding workout:", error_12);
                            throw error_12;
                        case 5: return [2 /*return*/];
                    }
                });
            });
        },
        addExercise: function (_1, _a, _b) {
            return __awaiter(this, arguments, void 0, function (_, _c, _d) {
                var newExercise, insertedExercise, error_13;
                var workoutUid = _c.workoutUid, exercise = _c.exercise;
                var req = _d.req;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            if (!req.userUid) {
                                throw new NotAuthorizedError_js_1.NotAuthorizedError();
                            }
                            _e.label = 1;
                        case 1:
                            _e.trys.push([1, 4, , 5]);
                            newExercise = __assign(__assign({}, exercise), { workoutUid: workoutUid });
                            return [4 /*yield*/, knexInstance("exercises").insert(newExercise)];
                        case 2:
                            _e.sent();
                            return [4 /*yield*/, knexInstance("exercises")
                                    .where({
                                    title: exercise.title,
                                    weight: exercise.weight,
                                    sets: exercise.sets,
                                    reps: exercise.reps,
                                    workoutUid: workoutUid,
                                })
                                    .first()];
                        case 3:
                            insertedExercise = _e.sent();
                            return [2 /*return*/, insertedExercise];
                        case 4:
                            error_13 = _e.sent();
                            console.error("Error adding exercise:", error_13);
                            throw error_13;
                        case 5: return [2 /*return*/];
                    }
                });
            });
        },
        updateUser: function (_1, args_1, _a) {
            return __awaiter(this, arguments, void 0, function (_, args, _b) {
                var edits, uid, e_1;
                var req = _b.req;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            if (!req.userUid || req.userUid !== args.uid) {
                                throw new NotAuthorizedError_js_1.NotAuthorizedError();
                            }
                            edits = args.edits, uid = args.uid;
                            _c.label = 1;
                        case 1:
                            _c.trys.push([1, 4, , 5]);
                            return [4 /*yield*/, knexInstance("users").where({ uid: uid }).update(edits)];
                        case 2:
                            _c.sent();
                            return [4 /*yield*/, knexInstance("users").where({ uid: uid }).first()];
                        case 3: return [2 /*return*/, _c.sent()];
                        case 4:
                            e_1 = _c.sent();
                            console.error("Error updating user:", e_1);
                            throw e_1;
                        case 5: return [2 /*return*/];
                    }
                });
            });
        },
        updateWorkout: function (_1, _a, _b) {
            return __awaiter(this, arguments, void 0, function (_, _c, _d) {
                var error_14;
                var uid = _c.uid, edits = _c.edits;
                var req = _d.req;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            if (!req.userUid) {
                                throw new NotAuthorizedError_js_1.NotAuthorizedError();
                            }
                            _e.label = 1;
                        case 1:
                            _e.trys.push([1, 4, , 5]);
                            return [4 /*yield*/, knexInstance("workouts").where({ uid: uid }).update(edits)];
                        case 2:
                            _e.sent();
                            return [4 /*yield*/, knexInstance("workouts").where({ uid: uid }).first()];
                        case 3: return [2 /*return*/, _e.sent()];
                        case 4:
                            error_14 = _e.sent();
                            console.error("Error updating workout:", error_14);
                            throw error_14;
                        case 5: return [2 /*return*/];
                    }
                });
            });
        },
        updateExercise: function (_1, _a, _b) {
            return __awaiter(this, arguments, void 0, function (_, _c, _d) {
                var userUidOfExercise, oldExercise, mergedExercise, newExercises, areExercisesValid, updatedExercise, error_15;
                var uid = _c.uid, edits = _c.edits;
                var req = _d.req;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            if (!req.userUid) {
                                throw new NotAuthorizedError_js_1.NotAuthorizedError();
                            }
                            return [4 /*yield*/, knexInstance("exercises as e")
                                    .join("workouts as w", "w.uid", "=", "e.workoutUid")
                                    .join("users as u", "w.userUid", "=", "u.uid")
                                    .select("u.uid")
                                    .where("e.uid", "=", uid)
                                    .first()];
                        case 1:
                            userUidOfExercise = (_e.sent()).uid;
                            if (userUidOfExercise !== req.userUid) {
                                throw new NotAuthorizedError_js_1.NotAuthorizedError();
                            }
                            return [4 /*yield*/, knexInstance("exercises").where({ uid: uid })];
                        case 2:
                            oldExercise = (_e.sent())[0];
                            mergedExercise = __assign(__assign({}, oldExercise), edits);
                            newExercises = (0, formatDataForDB_js_1.formatExercisesForDB)([mergedExercise]);
                            areExercisesValid = (0, verifyExercises_js_1.verifyExercises)({
                                exercises: newExercises,
                                updatingWorkout: true,
                            });
                            if (areExercisesValid.result === false) {
                                throw new Error(areExercisesValid.reason);
                            }
                            _e.label = 3;
                        case 3:
                            _e.trys.push([3, 5, , 6]);
                            return [4 /*yield*/, knexInstance("exercises")
                                    .where({ uid: uid })
                                    .update(edits)
                                    .returning("*")];
                        case 4:
                            updatedExercise = _e.sent();
                            return [2 /*return*/, updatedExercise[0]];
                        case 5:
                            error_15 = _e.sent();
                            console.error("Error updating exercise:", error_15);
                            throw error_15;
                        case 6: return [2 /*return*/];
                    }
                });
            });
        },
        updateWorkoutWithExercises: function (_1, _a, _b) {
            return __awaiter(this, arguments, void 0, function (_, _c, _d) {
                var dbWorkout, newExercises, newWorkout, isWorkoutValid, areExercisesValid, dbExercises, updatedWorkoutWithExercises, error_16;
                var workoutUid = _c.workoutUid, workoutWithExercises = _c.workoutWithExercises;
                var req = _d.req;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            // 1. Validate auth token
                            if (!req.userUid) {
                                throw new NotAuthorizedError_js_1.NotAuthorizedError();
                            }
                            return [4 /*yield*/, knexInstance("workouts")
                                    .where({ uid: workoutUid })
                                    .first()];
                        case 1:
                            dbWorkout = _e.sent();
                            if (dbWorkout.userUid !== req.userUid) {
                                throw NotAuthorizedError_js_1.NotAuthorizedError;
                            }
                            newExercises = (0, formatDataForDB_js_1.formatExercisesForDB)(workoutWithExercises.exercises);
                            newWorkout = (0, formatDataForDB_js_1.formatWorkoutForDB)(workoutWithExercises, req.userUid);
                            isWorkoutValid = (0, verifyWorkout_js_1.verifyWorkout)(newWorkout);
                            if (isWorkoutValid.result === false) {
                                throw new Error(isWorkoutValid.reason);
                            }
                            areExercisesValid = (0, verifyExercises_js_1.verifyExercises)({
                                exercises: newExercises,
                                updatingWorkout: true,
                            });
                            if (areExercisesValid.result === false) {
                                throw new Error(areExercisesValid.reason);
                            }
                            return [4 /*yield*/, knexInstance("exercises").where({
                                    workoutUid: workoutUid,
                                })];
                        case 2:
                            dbExercises = _e.sent();
                            _e.label = 3;
                        case 3:
                            _e.trys.push([3, 5, , 6]);
                            return [4 /*yield*/, knexInstance.transaction(function (trx) {
                                    return __awaiter(this, void 0, void 0, function () {
                                        var _loop_1, _i, newExercises_1, exercise, exercisesToDelete, _a, exercisesToDelete_1, exercise, updatedWorkout, updatedExercises, error_17;
                                        return __generator(this, function (_b) {
                                            switch (_b.label) {
                                                case 0:
                                                    _b.trys.push([0, 12, , 14]);
                                                    _loop_1 = function (exercise) {
                                                        var dbExercise, mergedExercise;
                                                        return __generator(this, function (_c) {
                                                            switch (_c.label) {
                                                                case 0:
                                                                    dbExercise = dbExercises.find(function (dbExercise) { return dbExercise.uid === exercise.uid; });
                                                                    if (!dbExercise) {
                                                                        throw new Error("Exercise with uid ".concat(exercise.uid, " not found in DB."));
                                                                    }
                                                                    mergedExercise = __assign(__assign({}, dbExercise), exercise);
                                                                    return [4 /*yield*/, trx("exercises")
                                                                            .where({ uid: exercise.uid })
                                                                            .update(mergedExercise)];
                                                                case 1:
                                                                    _c.sent();
                                                                    return [2 /*return*/];
                                                            }
                                                        });
                                                    };
                                                    _i = 0, newExercises_1 = newExercises;
                                                    _b.label = 1;
                                                case 1:
                                                    if (!(_i < newExercises_1.length)) return [3 /*break*/, 4];
                                                    exercise = newExercises_1[_i];
                                                    return [5 /*yield**/, _loop_1(exercise)];
                                                case 2:
                                                    _b.sent();
                                                    _b.label = 3;
                                                case 3:
                                                    _i++;
                                                    return [3 /*break*/, 1];
                                                case 4:
                                                    if (!(newExercises.length !== dbExercises.length)) return [3 /*break*/, 8];
                                                    exercisesToDelete = dbExercises.filter(function (dbExercise) {
                                                        return !newExercises.find(function (exercise) { return exercise.uid === dbExercise.uid; });
                                                    });
                                                    _a = 0, exercisesToDelete_1 = exercisesToDelete;
                                                    _b.label = 5;
                                                case 5:
                                                    if (!(_a < exercisesToDelete_1.length)) return [3 /*break*/, 8];
                                                    exercise = exercisesToDelete_1[_a];
                                                    return [4 /*yield*/, trx("exercises").where({ uid: exercise.uid }).del()];
                                                case 6:
                                                    _b.sent();
                                                    _b.label = 7;
                                                case 7:
                                                    _a++;
                                                    return [3 /*break*/, 5];
                                                case 8: 
                                                // 7. Update the workout
                                                return [4 /*yield*/, trx("workouts")
                                                        .where({ uid: workoutUid })
                                                        .update(newWorkout)];
                                                case 9:
                                                    // 7. Update the workout
                                                    _b.sent();
                                                    return [4 /*yield*/, trx("workouts").where({
                                                            uid: workoutUid,
                                                        })];
                                                case 10:
                                                    updatedWorkout = (_b.sent())[0];
                                                    return [4 /*yield*/, trx("exercises").where({
                                                            workoutUid: workoutUid,
                                                        })];
                                                case 11:
                                                    updatedExercises = _b.sent();
                                                    return [2 /*return*/, __assign(__assign({}, updatedWorkout), { exercises: updatedExercises })];
                                                case 12:
                                                    error_17 = _b.sent();
                                                    return [4 /*yield*/, trx.rollback()];
                                                case 13:
                                                    _b.sent();
                                                    throw new Error("Failed to updateWorkoutWithExercises.");
                                                case 14: return [2 /*return*/];
                                            }
                                        });
                                    });
                                })];
                        case 4:
                            updatedWorkoutWithExercises = _e.sent();
                            return [3 /*break*/, 6];
                        case 5:
                            error_16 = _e.sent();
                            console.error("Error deleting workout with exercises:", error_16);
                            throw error_16;
                        case 6: return [2 /*return*/, updatedWorkoutWithExercises];
                    }
                });
            });
        },
        deleteUser: function (_1, _a, _b) {
            return __awaiter(this, arguments, void 0, function (_, _c, _d) {
                var workoutsCount, _e, numAffectedRows, error_18;
                var uid = _c.uid;
                var req = _d.req;
                return __generator(this, function (_f) {
                    switch (_f.label) {
                        case 0:
                            if (!req.userUid) {
                                throw new NotAuthorizedError_js_1.NotAuthorizedError();
                            }
                            _f.label = 1;
                        case 1:
                            _f.trys.push([1, 5, , 6]);
                            _e = Number;
                            return [4 /*yield*/, knexInstance("workouts")
                                    .count("*")
                                    .where({ userUid: uid })
                                    .first()];
                        case 2:
                            workoutsCount = _e.apply(void 0, [(_f.sent()).count]);
                            if (workoutsCount > 0) {
                                throw new Error("Please delete the ".concat(workoutsCount, " workouts associated with this user before deleting the user. Exiting without deleting user."));
                            }
                            return [4 /*yield*/, knexInstance("users")
                                    .where({ uid: uid })
                                    .del()];
                        case 3:
                            numAffectedRows = _f.sent();
                            console.log("".concat(numAffectedRows, " rows affected in deleteUser mutation."));
                            return [4 /*yield*/, knexInstance("users").select("*")];
                        case 4: return [2 /*return*/, _f.sent()];
                        case 5:
                            error_18 = _f.sent();
                            console.error("Error deleting user:", error_18);
                            throw error_18;
                        case 6: return [2 /*return*/];
                    }
                });
            });
        },
        // TODO: This is safely deleting workout & exercises, but the exercises returned is an empty array
        deleteWorkoutWithExercises: function (_1, _a, _b) {
            return __awaiter(this, arguments, void 0, function (_, _c, _d) {
                var workout, exercises, workoutWithExercises, error_19;
                var workoutUid = _c.workoutUid;
                var req = _d.req;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            if (!req.userUid) {
                                throw new NotAuthorizedError_js_1.NotAuthorizedError();
                            }
                            return [4 /*yield*/, knexInstance("workouts").where({ uid: workoutUid })];
                        case 1:
                            workout = _e.sent();
                            if (workout[0].userUid !== req.userUid) {
                                throw new NotAuthorizedError_js_1.NotAuthorizedError();
                            }
                            if (!workout) {
                                throw new Error("Workout not found.");
                            }
                            if (workout.length > 1) {
                                throw new Error("".concat(workout.length, " workouts found with uid ").concat(workoutUid, ". Exiting gracefully.."));
                            }
                            return [4 /*yield*/, knexInstance("exercises").where({
                                    workoutUid: workoutUid,
                                })];
                        case 2:
                            exercises = _e.sent();
                            if (!exercises) {
                                throw new Error("Exercises not found.");
                            }
                            workoutWithExercises = __assign(__assign({}, workout[0]), { exercises: exercises });
                            _e.label = 3;
                        case 3:
                            _e.trys.push([3, 5, , 6]);
                            return [4 /*yield*/, knexInstance.transaction(function (trx) {
                                    return __awaiter(this, void 0, void 0, function () {
                                        var error_20;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    _a.trys.push([0, 4, , 6]);
                                                    return [4 /*yield*/, trx("exercises").where({ workoutUid: workoutUid }).del()];
                                                case 1:
                                                    _a.sent();
                                                    return [4 /*yield*/, trx("workouts").where({ uid: workoutUid }).del()];
                                                case 2:
                                                    _a.sent();
                                                    return [4 /*yield*/, trx.commit()];
                                                case 3:
                                                    _a.sent();
                                                    return [3 /*break*/, 6];
                                                case 4:
                                                    error_20 = _a.sent();
                                                    return [4 /*yield*/, trx.rollback()];
                                                case 5:
                                                    _a.sent();
                                                    throw new Error("Failed to delete workout with exercises.");
                                                case 6: return [2 /*return*/];
                                            }
                                        });
                                    });
                                })];
                        case 4:
                            _e.sent();
                            return [2 /*return*/, workoutWithExercises];
                        case 5:
                            error_19 = _e.sent();
                            console.error("Error deleting workout with exercises:", error_19);
                            throw error_19;
                        case 6: return [2 /*return*/];
                    }
                });
            });
        },
        deleteExercise: function (_1, _a, _b) {
            return __awaiter(this, arguments, void 0, function (_, _c, _d) {
                var exercisePlus, userUid, exercise, error_21;
                var uid = _c.uid;
                var req = _d.req;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            if (!req.userUid) {
                                throw new NotAuthorizedError_js_1.NotAuthorizedError();
                            }
                            return [4 /*yield*/, knexInstance("exercises as e")
                                    .join("workouts as w", "w.uid", "e.workoutUid")
                                    .join("users as u", "w.userUid", "u.uid")
                                    .select("e.*", "u.uid as userUid")
                                    .where("e.uid", "=", uid)];
                        case 1:
                            exercisePlus = (_e.sent())[0];
                            if (!!exercisePlus === false) {
                                throw new Error("Exercise not found.");
                            }
                            userUid = exercisePlus.userUid, exercise = __rest(exercisePlus, ["userUid"]);
                            if (userUid !== req.userUid) {
                                throw new NotAuthorizedError_js_1.NotAuthorizedError();
                            }
                            _e.label = 2;
                        case 2:
                            _e.trys.push([2, 4, , 5]);
                            return [4 /*yield*/, knexInstance("exercises").where({ uid: uid }).del()];
                        case 3:
                            _e.sent();
                            return [2 /*return*/, exercise];
                        case 4:
                            error_21 = _e.sent();
                            console.error("Error deleting exercise:", error_21.message);
                            throw error_21;
                        case 5: return [2 /*return*/];
                    }
                });
            });
        },
        signUp: function (_1, _a) {
            return __awaiter(this, arguments, void 0, function (_, _b) {
                var hashedPassword, newUser, emailTaken, insertedUser, error_22;
                var user = _b.user;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, bcrypt.hash(user.password, 12)];
                        case 1:
                            hashedPassword = _c.sent();
                            newUser = {
                                firstName: user.firstName,
                                lastName: user.lastName,
                                email: user.email,
                                password: hashedPassword,
                                isAuthorized: false,
                            };
                            _c.label = 2;
                        case 2:
                            _c.trys.push([2, 5, , 6]);
                            return [4 /*yield*/, knexInstance("users")
                                    .where({ email: user.email })
                                    .first()];
                        case 3:
                            emailTaken = _c.sent();
                            if (emailTaken) {
                                throw new Error("Email is already in use.");
                            }
                            return [4 /*yield*/, knexInstance("users")
                                    .insert(newUser)
                                    .returning("*")];
                        case 4:
                            insertedUser = (_c.sent())[0];
                            console.log("insertedUser: ", insertedUser);
                            return [2 /*return*/, insertedUser];
                        case 5:
                            error_22 = _c.sent();
                            return [3 /*break*/, 6];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        },
        login: function (_1, _a, _b) {
            return __awaiter(this, arguments, void 0, function (_, _c, _d) {
                var user, validPassword, _e, refreshToken, accessToken;
                var email = _c.email, password = _c.password;
                var res = _d.res;
                return __generator(this, function (_f) {
                    switch (_f.label) {
                        case 0: return [4 /*yield*/, knexInstance("users").where({ email: email }).first()];
                        case 1:
                            user = _f.sent();
                            if (!user) {
                                throw new Error("Invalid email address, please try again.");
                            }
                            return [4 /*yield*/, bcrypt.compare(password, user.password)];
                        case 2:
                            validPassword = _f.sent();
                            if (!validPassword) {
                                throw new Error("Invalid credentials, please try again.");
                            }
                            _e = (0, auth_js_1.createTokens)(user), refreshToken = _e.refreshToken, accessToken = _e.accessToken;
                            // Set refresh token in HTTP-only cookie
                            (0, auth_js_1.setAccessToken)(res, accessToken);
                            (0, auth_js_1.setRefreshToken)(res, refreshToken);
                            return [2 /*return*/, user];
                    }
                });
            });
        },
        refreshToken: function (_1, __1, _a) {
            return __awaiter(this, arguments, void 0, function (_, __, _b) {
                var req = _b.req, res = _b.res;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, (0, auth_js_1.refreshTokens)(req, res)];
                        case 1: return [2 /*return*/, _c.sent()];
                    }
                });
            });
        },
        invalidateToken: function (_1, __1, _a) {
            return __awaiter(this, arguments, void 0, function (_, __, _b) {
                var error_23;
                var req = _b.req, res = _b.res;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            // No user, cannot invalidate their refresh token
                            if (!req.userUid) {
                                throw new Error("No user found to invalidate token.");
                            }
                            _c.label = 1;
                        case 1:
                            _c.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, knexInstance("users")
                                    .where({ uid: req.userUid })
                                    .increment("tokenCount", 1)];
                        case 2:
                            _c.sent();
                            // If you don't clear cookies, access-token will be valid until it times out
                            res.clearCookie(auth_js_1.ACCESS_TOKEN_COOKIE_NAME);
                            res.clearCookie(auth_js_1.REFRESH_TOKEN_COOKIE_NAME);
                            console.log("Token count updated for user.");
                            return [2 /*return*/, true];
                        case 3:
                            error_23 = _c.sent();
                            console.error("Error updating token count for user:", error_23);
                            throw error_23;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        },
    },
};
exports.default = exports.resolvers;
