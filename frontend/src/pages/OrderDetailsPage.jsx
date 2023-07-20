import React from 'react';
import Footer from '../components/Layout/Footer';
import UserOrderDetails from '../components/Order/UserOrderDetails.jsx';
import Header from '../components/Layout/Header';

const OrderDetailsPage = () => {
	return (
		<div>
			<Header />
			<UserOrderDetails />
			<Footer />
		</div>
	);
};

export default OrderDetailsPage;
