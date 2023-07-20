import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {server} from '../server';

const ActivationPage = () => {
	const {activation_token} = useParams();
	const [error, setError] = useState(false);

	useEffect(() => {
		if (activation_token) {
			const sendRequest = async () => {
				await axios
					.post(`${server}/user/activation`, {
						activation_token,
					})
					.then((res) => {
						console.log(res);
					})
					.catch((err) => {
						setError(true);
					});
			};
			sendRequest();
		}
	}, []);
	return (
		<div className="w-screen h-screen flex justify-center items-center">
			{error ? (
				<p>Your token is expired</p>
			) : (
				<p>Your account has been created successfully</p>
			)}
		</div>
	);
};

export default ActivationPage;
