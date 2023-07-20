export const addToCart = (item) => {
	return (dispatch, getState) => {
		dispatch({
			type: 'addToCart',
			payload: item,
		});
		// console.log(3);
		console.log(item);
		localStorage.setItem('cartItems', JSON.stringify(getState().cart?.cart));
		return item;
	};
};
export const removeFromCart = (data) => (dispatch, getState) => {
	dispatch({
		type: 'removeFromCart',
		payload: data._id,
	});
	localStorage.setItem('cartItems', JSON.stringify(getState().cart.cart));
};
