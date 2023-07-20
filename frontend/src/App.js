import React, {useEffect, useState} from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {loadStripe} from '@stripe/stripe-js';
import {Elements} from '@stripe/react-stripe-js';
import {
	LoginPage,
	SignupPage,
	ActivationPage,
	HomePage,
	ProductsPage,
	BestSellingPage,
	ProductDetailsPage,
	ProfilePage,
	ShopCreatePage,
	SellerActivationPage,
	ShopLoginPage,
	CheckoutPage,
	PaymentPage,
	OrderSuccessPage,
	NotFoundPage,
	OrderDetailsPage,
	TrackOrderPage,
} from './routes/Routes.js';

import {
	ShopDashboardPage,
	ShopHomePage,
	ShopCreateProduct,
	ShopAllProducts,
	ShopAllCoupouns,
	ShopPreviewPage,
	ShopAllOrders,
	ShopOrderDetail,
	ShopAllRefunds,
	ShopInboxPage,
} from './routes/ShopRoutes.js';
import './App.css';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from './redux/actions/axiosConfig.js';
import {server} from './server.js';
import Store from './redux/store.js';
import {loadUser} from './redux/actions/user.js';
import {useSelector} from 'react-redux';
import ProtectedRoute from './routes/ProtectedRoute.js';
import SellerProtectedRoute from './routes/SellerProtectedRoute.js';
import {loadSeller} from './redux/actions/seller.js';
import Loader from './components/Layout/Loader.jsx';
import {getAllProducts} from './redux/actions/product.js';
import {getAllEvents} from './redux/actions/event.js';
const App = () => {
	const [stripeapikey, setStripeapikey] = useState('');
	// const {isAuthenticated, user, loading} = useSelector((state) => state.user);
	// console.log(isAuthenticated, user);
	const getstripeapikey = async () => {
		const {data} = await axios.get('/payment/stripeapikey');
		setStripeapikey(data.stripeapikey);
	};
	useEffect(() => {
		Store.dispatch(loadUser());
		Store.dispatch(loadSeller());
		Store.dispatch(getAllProducts());
		Store.dispatch(getAllEvents());
		getstripeapikey();
	}, []);

	return (
		<>
			<BrowserRouter>
				<Elements stripe={loadStripe(stripeapikey)}>
					<Routes>
						<Route
							path="/payment"
							element={
								<ProtectedRoute>
									<PaymentPage />
								</ProtectedRoute>
							}
						/>
					</Routes>
				</Elements>

				<Routes>
					<Route
						path="*"
						element={<NotFoundPage />}
					/>
					<Route
						path="/"
						element={<HomePage />}
					/>
					<Route
						path="/login"
						element={<LoginPage />}
					/>
					<Route
						path="/test-loader"
						element={<Loader />}
					/>
					<Route
						path="/sign-up"
						element={<SignupPage />}
					/>
					<Route
						path="/activation/:activation_token"
						element={<ActivationPage />}
					/>
					<Route
						path="/products"
						element={<ProductsPage />}
					/>
					<Route
						path="/order/success"
						element={<OrderSuccessPage />}
					/>

					<Route
						path="/best-selling"
						element={<BestSellingPage />}
					/>
					<Route
						path="/product/:id"
						element={<ProductDetailsPage />}
					/>
					<Route
						path="/profile"
						element={
							<ProtectedRoute>
								<ProfilePage />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/checkout"
						element={
							<ProtectedRoute>
								<CheckoutPage />
							</ProtectedRoute>
						}
					/>

					<Route
						path="/user/track/order/:id"
						element={
							<ProtectedRoute>
								<TrackOrderPage />
							</ProtectedRoute>
						}
					/>

					<Route
						path="/shop/preview/:id"
						element={<ShopPreviewPage />}
					/>
					<Route
						path="/user/order/:id"
						element={
							<ProtectedRoute>
								<OrderDetailsPage />
							</ProtectedRoute>
						}
					/>
					{/* shop routes */}
					<Route
						path="/shop-create"
						element={<ShopCreatePage />}
					/>
					<Route
						path="/seller/activation/:activation_token"
						element={<SellerActivationPage />}
					/>
					<Route
						path="/shop-login"
						element={<ShopLoginPage />}
					/>
					<Route
						path="/dashboard"
						element={
							<SellerProtectedRoute>
								<ShopDashboardPage />
							</SellerProtectedRoute>
						}
					/>
					<Route
						path="/dashboard-messages"
						element={
							<SellerProtectedRoute>
								<ShopInboxPage />
							</SellerProtectedRoute>
						}
					/>
					<Route
						path="/dashboard-create-product"
						element={
							<SellerProtectedRoute>
								<ShopCreateProduct />
							</SellerProtectedRoute>
						}
					/>
					<Route
						path="/shop/:id"
						element={
							<SellerProtectedRoute>
								<ShopHomePage />
							</SellerProtectedRoute>
						}
					/>
					<Route
						path="/dashboard-products"
						element={
							<SellerProtectedRoute>
								<ShopAllProducts />
							</SellerProtectedRoute>
						}
					/>
					<Route
						path="/dashboard-orders"
						element={
							<SellerProtectedRoute>
								<ShopAllOrders />
							</SellerProtectedRoute>
						}
					/>
					<Route
						path="/dashboard-refunds"
						element={
							<SellerProtectedRoute>
								<ShopAllRefunds />
							</SellerProtectedRoute>
						}
					/>

					<Route
						path="/dashboard-coupouns"
						element={
							<SellerProtectedRoute>
								<ShopAllCoupouns />
							</SellerProtectedRoute>
						}
					/>
					<Route
						path="/shop/order/:id"
						element={
							<SellerProtectedRoute>
								<ShopOrderDetail />
							</SellerProtectedRoute>
						}
					/>
				</Routes>

				<ToastContainer
					position="bottom-right"
					autoClose={5000}
					hideProgressBar={false}
					newestOnTop={false}
					closeOnClick
					rtl={false}
					pauseOnFocusLoss
					draggable
					pauseOnHover
					theme="light"
				/>
			</BrowserRouter>
		</>
	);
};
export default App;
