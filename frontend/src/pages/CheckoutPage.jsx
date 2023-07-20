import React, {useEffect} from 'react';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import CheckoutSteps from '../components/Checkout/CheckoutSteps.jsx';
import Checkout from '../components/Checkout/Checkout.jsx';
import {useNavigate} from 'react-router-dom';

const CheckoutPage = () => {
	const navigate = useNavigate();
	// useEffect(() => {
	// 	navigate('/');
	// }, []);
	return (
		<div>
			<Header />
			<br />
			<br />
			<CheckoutSteps active={1} />
			<Checkout />
			<br />
			<Footer />
		</div>
	);
};

export default CheckoutPage;
