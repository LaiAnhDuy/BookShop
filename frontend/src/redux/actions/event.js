import axios from './axiosConfig';

export const createEvent = (newForm) => async (dispatch) => {
	try {
		dispatch({
			type: 'eventCreateRequest',
		});
		const config = {
			headers: {'Content-Type': 'multipart/form-data'},
		};
		const {data} = await axios.post(`/event/create-event`, newForm, config);
		dispatch({
			type: 'eventCreateSuccess',
			payload: data.event,
		});
	} catch (error) {
		dispatch({
			type: 'EventCreateFail',
			payload: error.response.data.message,
		});
	}
};

export const getAllEventsShop = (id) => async (dispatch) => {
	try {
		dispatch({type: 'getAllEventsShopRequest'});
		const {data} = await axios.get(`/event/get-all-events-shop/${id}`);
		dispatch({
			type: 'getAllEventsShopSuccess',
			payload: data.events,
		});
	} catch (error) {
		dispatch({
			type: 'getAllEventsShopFail',
			payload: error.response.data.message,
		});
	}
};
export const deleteEvent = (id) => async (dispatch) => {
	try {
		dispatch({type: 'deleteEventRequest'});
		const {data} = await axios.delete(`/event/delete-shop-event/${id}`);
		dispatch({type: 'deleteEventSuccess', payload: data.message});
	} catch (error) {
		dispatch({
			type: 'deleteEventFail',
			payload: error.response.data.message,
		});
	}
};
export const getAllEvents = () => async (dispatch) => {
	try {
		dispatch({type: 'getAllEventsRequest'});
		const {data} = await axios.get('/event/get-all-events');
		dispatch({type: 'getAllEventsSuccess', payload: data.events});
	} catch (e) {
		dispatch({
			type: 'getAllEventsFailed',
			payload: e.response.data.message,
		});
	}
};
