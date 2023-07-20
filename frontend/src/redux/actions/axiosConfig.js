import axios from 'axios';
import {server} from '../../server';
// Next we make an 'instance' of it
const instance = axios.create({
	withCredentials: true,
	baseURL: server,
});

export default instance;
