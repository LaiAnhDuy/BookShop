import React, {useEffect, useState} from 'react';
import CheckoutSteps from '../components/Checkout/CheckoutSteps';
import Footer from '../components/Layout/Footer';
import Header from '../components/Layout/Header';
import Payment from '../components/Payment/Payment.jsx';
import axios from '../redux/actions/axiosConfig';
import {loadStripe} from '@stripe/stripe-js';
import {Elements} from '@stripe/react-stripe-js';
import {useNavigate} from 'react-router-dom';
import {useSelector} from 'react-redux';

const PaymentPage = () => {
	const navigate = useNavigate();
	const {orderData} = useSelector((state) => state.cart);
	useEffect(() => {
		if (!orderData) {
			navigate('/checkout');
		}
	}, []);
	return (
		<div>
			<div className="w-full min-h-screen bg-[#f6f9fc]">
				<Header />
				<br />
				<br />
				<CheckoutSteps active={2} />
				<Payment />
				<br />
				<br />
				<Footer />
			</div>
			)
		</div>
	);
};

export default PaymentPage;
