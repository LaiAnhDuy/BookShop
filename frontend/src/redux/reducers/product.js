import {createReducer} from '@reduxjs/toolkit';
import {getAllProducts} from '../actions/product';
const initialState = {
	isLoading: true,
};
export const productReducer = createReducer(initialState, {
	productCreateRequest: (state) => {
		state.isLoading = true;
	},
	productCreateSuccess: (state, action) => {
		state.isLoading = false;
		state.product = action.payload;
		state.success = true;
	},
	productCreateFail: (state, action) => {
		state.isLoading = false;
		state.error = action.payload;
		state.success = false;
	},
	getAllProductsShopRequest: (state) => {
		state.isLoading = true;
	},
	getAllProductsShopSuccess: (state, action) => {
		state.isLoading = false;
		state.products = action.payload;
	},
	getAllProductsShopFail: (state, action) => {
		state.isLoading = false;
		state.error = action.payload;
	},
	deleteProductRequest: (state) => {
		// state.isLoading = true;
	},
	deleteProductSuccess: (state, action) => {
		state.message = action.payload;
	},
	deleteProductFail: (state, action) => {
		state.error = action.payload;
	},
	clearErrors: (state) => {
		state.error = null;
	},
	getAllProductsRequest: (state) => {
		state.isLoading = true;
	},
	getAllProductsSuccess: (state, action) => {
		state.isLoading = false;
		state.allProducts = action.payload;
	},
	getAllProductsFailed: (state, action) => {
		state.isLoading = false;
		state.error = action.payload;
	},
});
