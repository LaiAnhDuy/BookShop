import {createReducer} from '@reduxjs/toolkit';
const initialState = {
	isLoading: true,
};
export const sellerReducer = createReducer(initialState, {
	LoadSellerRequest: (state) => {
		state.isLoading = true;
	},
	LoadSellerSuccess: (state, action) => {
		state.isLoading = false;
		state.isSeller = true;
		state.seller = action.payload;
	},
	LoadSellerFail: (state, action) => {
		state.isLoading = false;
		state.error = action.payload;
		state.isSeller = false;
	},
	clearError: (state) => {
		state.error = null;
	},
	LogoutSuccess: (state) => {
		state.isAuthenticated = false;
	},
	LogoutFail: (state, action) => {
		state.error = action.payload;
	},
});
