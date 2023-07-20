import axios from './axiosConfig';

export const getAllOrderUser = (id) => async (dispatch) => {
	try {
		dispatch({type: 'getAllOrderUserRequest'});
		const {data} = await axios.get(`/order/get-all-orders/${id}`);
		dispatch({
			type: 'getAllOrderUserSuccess',
			payload: data.orders,
		});
	} catch (error) {
		dispatch({
			type: 'getAllOrderUserFail',
			payload: error.response.data.message,
		});
	}
};
export const getAllOrderShop = (id) => async (dispatch) => {
	try {
		dispatch({type: 'getAllOrderShopRequest'});
		const {data} = await axios.get(`/order/get-seller-orders/${id}`);
		dispatch({
			type: 'getAllOrderShopSuccess',
			payload: data.orders,
		});
	} catch (error) {
		dispatch({
			type: 'getAllOrderShopFail',
			payload: error.response.data.message,
		});
	}
};
