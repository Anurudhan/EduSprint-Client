import { createSlice,PayloadAction } from "@reduxjs/toolkit";
import { SignupFormData, Response } from "../../../types/IForm";
import { getUserData, loginAction, logoutAction, registerAction, signupAction } from "../actions/auth";



export interface userState{
    loading:boolean;
    data:SignupFormData|null;
    error:string | null;
}

const initialState : userState = {
    loading:false,
    data:null,
    error:null,
}

const userSlice = createSlice({
    name:"user",
    initialState,
    reducers:{
        storeUserData : (
            state : userState,
            action :PayloadAction<SignupFormData>
         ) => {
            state.data = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // signup user
			.addCase(signupAction.pending, (state: userState) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(
				signupAction.fulfilled,
				(state: userState, action: PayloadAction<Response>) => {
					state.loading = false;
					state.data = action.payload.data || null;
					state.error = null;
				}
			)
			.addCase(signupAction.rejected, (state: userState, action) => {
				state.loading = false;
				state.error = action.error.message || "signup failed";
				state.data = null;
			})

			//Register-form
			
			.addCase(registerAction.pending, (state: userState) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(
				registerAction.fulfilled,
				(state: userState, action: PayloadAction<Response>) => {
					state.loading = false;
					state.data = action.payload.data || null;
					state.error = null;
				}
			)
			.addCase(registerAction.rejected, (state: userState, action) => {
				state.loading = false;
				state.error = action.error.message || "signup failed";
				state.data = null;
			})

			// login user
			.addCase(loginAction.pending, (state: userState) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(
				loginAction.fulfilled,
				(state: userState, action: PayloadAction<Response>) => {
					state.loading = false;
					state.data = action.payload.data || null;
					state.error = null;
				}
			)
			.addCase(loginAction.rejected, (state: userState, action) => {
				state.loading = false;
				state.error = action.error.message || "signin failed";
				state.data = null;
			})

            // getUserData 

            .addCase(getUserData.pending, (state: userState) => {
				state.loading = true;
			})
			.addCase(
				getUserData.fulfilled,
				(state: userState, action: PayloadAction<{ data: SignupFormData }>) => {
					state.loading = false;
					state.data = action.payload.data || null;
					state.error = null;
				}
			)
			.addCase(getUserData.rejected, (state: userState, action) => {
				state.loading = false;
				state.error = action.error.message || "Fetching user data failed";
				state.data = null;
			})

			// logOut Action

			.addCase(logoutAction.pending, (state: userState) => {
				state.loading = true;
			})
			.addCase(logoutAction.rejected, (state: userState, action) => {
				state.loading = false;
				state.data = null;
				state.error = action.error.message || "Logout failed";
			})
			.addCase(logoutAction.fulfilled, (state: userState) => {
				state.loading = false;
				state.data = null;
				state.error = null;
			});
    }

})


export const { storeUserData } = userSlice.actions;

export const userReducer = userSlice.reducer;