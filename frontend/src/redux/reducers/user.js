import {createReducer} from '@reduxjs/toolkit';
import {toast} from 'react-toastify';
const initialState = {
	isAuthenticated: false,
};
export const userReducer = createReducer(initialState, {
	LoadUserRequest: (state) => {
		state.loading = true;
	},
	LoadUserSuccess: (state, action) => {
		state.loading = false;
		state.isAuthenticated = true;
		state.user = action.payload;
	},
	LoadUserFail: (state, action) => {
		state.loading = false;
		state.error = action.payload;
		state.isAuthenticated = false;
	},

	LogoutSuccess: (state) => {
		state.isAuthenticated = false;
	},
	LogoutFail: (state, action) => {
		state.error = action.payload;
	},
	updateUserInfoRequest: (state, action) => {
		state.loading = true;
	},
	updateUserInfoSuccess: (state, action) => {
		state.user = action.payload;
		state.loading = false;
		toast.success('update user info success');
	},
	updateUserInfoFailed: (state, action) => {
		state.loading = false;
		state.error = action.payload;
		toast.error('update user info failed');
	},
	updateUserAddressRequest: (state, action) => {
		state.addressLoading = true;
	},
	updateUserAddressSuccess: (state, action) => {
		state.addressLoading = false;
		state.user = action.payload.user;
		state.successMessage = 'update address success';
	},
	updateUserAddressFailed: (state, action) => {
		state.addressLoading = false;
		state.error = action.payload.message;
	},
	deleteUserAddressRequest: (state, action) => {
		state.addressLoading = true;
	},
	deleteUserAddressSuccess: (state, action) => {
		state.successMessage = action.payload.successMessage;
		state.user = action.payload.user;
		state.addressLoading = false;
	},
	deleteUserAddressFailed: (state, action) => {
		state.error = action.payload;
		state.addressLoading = false;
	},
	updateUserPasswordRequest: (state, action) => {
		state.passwordLoading = true;
	},
	updateUserPasswordSuccess: (state, action) => {
		state.passwordLoading = false;
		state.successMessage = action.payload;
		// state.user = action.payload.user;
	},
	updateUserPasswordFailed: (state, action) => {
		state.passwordLoading = false;
		state.error = action.payload;
	},

	clearErrors: (state) => {
		state.error = null;
	},
	clearMessages: (state) => {
		state.successMessage = null;
	},
});
