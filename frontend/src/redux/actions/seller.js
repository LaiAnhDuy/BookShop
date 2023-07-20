import {createAction} from '@reduxjs/toolkit';
import axios from 'axios';
import {server} from '../../server';

//load user
export const loadSeller = () => async (dispatch) => {
	try {
		dispatch({
			type: 'LoadSellerRequest',
		});
		const {data} = await axios.get(`${server}/shop/getSeller`, {
			withCredentials: true,
		});
		dispatch({
			type: 'LoadSellerSuccess',
			payload: data.seller,
		});
	} catch (error) {
		dispatch({
			type: 'LoadSellerFail',
			payload: error.response.data.message,
		});
	}
};

export const logout = () => async (dispatch) => {
	try {
		const {data} = await axios.get(`${server}/user/logout`, {
			withCredentials: true,
		});
		dispatch({
			type: 'LogoutSuccess',
		});
	} catch (e) {
		dispatch({type: 'LogoutFail', payload: e.response.data.message});
	}
};
