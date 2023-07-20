import axios from './axiosConfig';

export const createProduct = (newForm) => async (dispatch) => {
	try {
		dispatch({
			type: 'productCreateRequest',
		});
		const config = {
			headers: {'Content-Type': 'multipart/form-data'},
		};
		const {data} = await axios.post(`/product/create-product`, newForm, config);
		dispatch({
			type: 'productCreateSuccess',
			payload: data.product,
		});
	} catch (error) {
		dispatch({
			type: 'ProductCreateFail',
			payload: error.response.data.message,
		});
	}
};

export const getAllProductsShop = (id) => async (dispatch) => {
	try {
		dispatch({type: 'getAllProductsShopRequest'});
		const {data} = await axios.get(`/product/get-all-products-shop/${id}`);
		dispatch({
			type: 'getAllProductsShopSuccess',
			payload: data.products,
		});
	} catch (error) {
		dispatch({
			type: 'getAllProductsShopFail',
			payload: error.response.data.message,
		});
	}
};
export const deleteProduct = (id) => async (dispatch) => {
	try {
		dispatch({type: 'deleteProductRequest'});
		const {data} = await axios.delete(`/product/delete-shop-product/${id}`);
		dispatch({type: 'deleteProductSuccess', payload: data.message});
	} catch (error) {
		dispatch({
			type: 'deleteProductFail',
			payload: error.response.data.message,
		});
	}
};
export const getAllProducts = () => async (dispatch) => {
	try {
		dispatch({type: 'getAllProductsRequest'});
		const {data} = await axios.get('/product/get-all-products');
		dispatch({type: 'getAllProductsSuccess', payload: data.products});
	} catch (e) {
		dispatch({
			type: 'getAllProductsFailed',
			payload: e.response.data.message,
		});
	}
};
