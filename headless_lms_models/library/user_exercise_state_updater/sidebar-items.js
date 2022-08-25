window.SIDEBAR_ITEMS = {"fn":[["update_user_exercise_state","Loads all required data and updates user_exercise_state. Also creates completions if needed."],["update_user_exercise_state_with_some_already_loaded_data","Allows you to pass some data that `update_user_exercise_state` fetches to avoid repeating SQL queries for performance. Note that the caller must be careful that it passes correct data to the function. A good rule of thumb is that this function expects unmodified data directly from the database."]],"mod":[["data_loader",""],["state_deriver",""]],"struct":[["UserExerciseStateUpdateAlreadyLoadedRequiredData","Same as `UserExerciseStateUpdateRequiredData` but public and everything is optional. Can be used to pass some already loaded dependencies to the update function."],["UserExerciseStateUpdateAlreadyLoadedRequiredDataPeerReviewInformation","Same as `UserExerciseStateUpdateRequiredDataPeerReviewInformation` but public and everything is optional. Can be used to pass some already loaded dependencies to the update function."],["UserExerciseStateUpdateRequiredData","Visible only in the current module (and submodules) to prevent misuse."],["UserExerciseStateUpdateRequiredDataPeerReviewInformation","Visible only in the current module (and submodules) to prevent misuse."]]};