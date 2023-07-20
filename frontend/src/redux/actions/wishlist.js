export const addToWishlist = (item) => {
	return (dispatch, getState) => {
		dispatch({
			type: 'addToWishlist',
			payload: item,
		});
		// console.log(3);
		// console.log(item);
		localStorage.setItem(
			'wishlistItems',
			JSON.stringify(getState().wishlist?.wishlist)
		);
		return item;
	};
};
export const removeFromWishlist = (data) => (dispatch, getState) => {
	dispatch({
		type: 'removeFromWishlist',
		payload: data._id,
	});
	localStorage.setItem(
		'wishlistItems',
		JSON.stringify(getState().wishlist.wishlist)
	);
};
