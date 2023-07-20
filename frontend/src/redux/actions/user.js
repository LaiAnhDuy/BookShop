import {createAction} from '@reduxjs/toolkit';
import axios from './axiosConfig';
import {server} from '../../server';

//load user
export const loadUser = () => async (dispatch) => {
	try {
		dispatch({
			type: 'LoadUserRequest',
		});
		const {data} = await axios.get(`/user/getuser`);
		dispatch({
			type: 'LoadUserSuccess',
			payload: data.user,
		});
	} catch (error) {
		dispatch({
			type: 'LoadUserFail',
			payload: error.response.data.message,
		});
	}
};

export const updateUserInformation =
	(name, email, phoneNumber, password) => async (dispatch, getState) => {
		try {
			dispatch({
				type: 'updateUserInfoRequest',
			});
			const {data} = await axios.put('/user/update-user-info', {
				email,
				password,
				phoneNumber,
				name,
			});
			dispatch({
				type: 'updateUserInfoSuccess',
				payload: data.user,
			});
		} catch (error) {
			dispatch({
				type: 'updateUserInfoFailed',
				payload: error.response.data.message,
			});
		}
	};

export const logout = () => async (dispatch) => {
	try {
		const {data} = await axios.get(`/user/logout`);
		dispatch({
			type: 'LogoutSuccess',
		});
	} catch (e) {
		dispatch({type: 'LogoutFail', payload: e.response.data.message});
	}
};
export const updateUserAddress = (address) => async (dispatch, getState) => {
	try {
		dispatch({
			type: 'updateUserAddressRequest',
		});
		const {data} = await axios.put(`/user/add-user-addresses`, address);
		dispatch({type: 'updateUserAddressSuccess', payload: data});
	} catch (error) {
		dispatch({type: 'updateUserAddressFailed', payload: error.response.data});
	}
};

export const deleteUserAddress = (id) => async (dispatch, getState) => {
	try {
		dispatch({type: 'deleteUserAddressRequest'});
		const {data} = await axios.delete(`/user/delete-user-address/${id}`);
		dispatch({
			type: 'deleteUserAddressSuccess',
			payload: {
				successMessage: 'User Address deleted successfully',
				user: data.user,
			},
		});
	} catch (error) {
		dispatch({
			type: 'deleteUserAddressFailed',
			payload: error.response.data.message,
		});
	}
};

export const updateUserPassword = (update) => async (dispatch, getState) => {
	try {
		dispatch({type: 'updateUserPasswordRequest'});
		// console.log(2);
		const {data} = await axios.put(`/user/update-user-password`, update);
		// const {data} = await axios.put(`/user/add-user-addresses`, update);
		dispatch({
			type: 'updateUserPasswordSuccess',
			payload: data.message,
		});
		// console.log(4);
	} catch (error) {
		dispatch({
			type: 'updateUserPasswordFailed',
			payload: error.response.data.message,
		});
	}
};
