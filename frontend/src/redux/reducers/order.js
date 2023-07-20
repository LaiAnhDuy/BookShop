import {createReducer} from '@reduxjs/toolkit';
const initialState = {
	isLoading: true,
};
export const orderReducer = createReducer(initialState, {
	getAllOrderUserRequest: (state) => {
		state.isLoading = true;
	},
	getAllOrderUserSuccess: (state, action) => {
		state.isLoading = false;
		state.orders = action.payload;
	},
	getAllOrderUserFail: (state, action) => {
		state.isLoading = false;
		state.error = action.payload;
	},
	clearError: (state) => {
		state.error = null;
	},
	getAllOrderShopRequest: (state) => {
		state.isLoading = true;
	},
	getAllOrderShopSuccess: (state, action) => {
		state.isLoading = false;
		state.orders = action.payload;
	},
	getAllOrderShopFail: (state, action) => {
		state.isLoading = false;
		state.error = action.payload;
	},
});
