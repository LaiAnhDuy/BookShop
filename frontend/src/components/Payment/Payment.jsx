import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Lottie from 'lottie-react';
import animationData from '../../Assests/animations/98288-loading.json';
import {
	useStripe,
	useElements,
	CardElement,
} from '@stripe/react-stripe-js';
import {toast} from 'react-toastify';
import axios from '../../redux/actions/axiosConfig';
import {useNavigate} from 'react-router-dom';
const Payment = () => {
	// const [orderData, setOrderData] = useState(null);
	const {user} = useSelector((state) => state.user);
	const {orderData} = useSelector((state) => state.cart);

	const navigate = useNavigate();
	const dispatch = useDispatch();
	// const [message, setMessage] = useState(null);

	const [isLoading, setIsLoading] = useState(false);

	const stripe = useStripe();
	const elements = useElements();
	// //stripe
	// const {user} = useSelector((state) => state.user);

	let orders = orderData?.orders.map((order) => ({
		cart: order?.cart,
		shippingAddress: orderData?.shippingAddress,
		user: user,
		totalPrice: order?.totalPrice,
	}));
	const amount = Math.round(orderData?.totalPrice * 100);

	const paymentHandler = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		if (!stripe) {
			// Stripe.js hasn't yet loaded.
			// Make sure to disable form submission until Stripe.js has loaded.
			return;
		}
		const {data} = await axios.post('/payment/process', {amount});
		const client_secret = data.client_secret;
		const result = await stripe.confirmCardPayment(client_secret, {
			payment_method: {
				card: elements.getElement(CardElement),
				billing_details: {
					name: 'abc',
				},
			},
		});
		// console.log(result.paymentIntent);
		setIsLoading(false);

		if (result.error) {
			// Show error to your customer (for example, insufficient funds)
			toast.error(result.error.message);
		} else {
			// The payment has been processed!
			if (result.paymentIntent.status === 'succeeded') {
				toast.success('payment succeesfully');

				orders = orders.map((order) => ({
					...order,
					paymentInfo: {
						id: result.paymentIntent.id,
						status: result.paymentIntent.status,
						type: 'debit/credit card',
					},
					paidAt: result.paymentIntent.created * 1000,
				}));
				try {
					await axios.post('/order/create-order', orders);
				} catch (error) {
					return toast.error(error.response.data.message);
				}
				localStorage.setItem('cartItems', JSON.stringify([]));
				dispatch({
					type: 'clearCart',
				});
				dispatch({
					type: 'createOrder',
				});
				localStorage.setItem('cartItems', JSON.stringify([]));
				// console.log(23);
				navigate('/order/success');
			}
		}
	};
	const handleCashOnDelivery = async () => {
		try {
			orders = orders.map((order) => ({
				...order,
				paymentInfo: {
					type: 'Cash On Delivery',
				},
			}));
			await axios.post('/order/create-order', orders);
			dispatch({type: 'clearCart'});
			dispatch({type: 'createOrder'});
			localStorage.setItem('cartItems', JSON.stringify([]));
			navigate('/order/success');
		} catch (error) {
			console.log(3);
			console.log(error.response.data.message);
		}
	};
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	return (
		<div className="w-full flex flex-col items-center py-8">
			<div className="w-[90%] 1000px:w-[70%] block 800px:flex">
				<div className="w-full 800px:w-[65%]">
					<PaymentInfo
						isLoading={isLoading}
						setIsLoading={setIsLoading}
						stripe={stripe}
						paymentHandler={paymentHandler}
						handleCashOnDelivery={handleCashOnDelivery}
					/>
				</div>
				<div className="w-full 800px:w-[35%] 800px:mt-0 mt-8">
					<CartData orderData={orderData} />
				</div>
			</div>
		</div>
	);
};
const PaymentInfo = ({
	paymentHandler,
	// message,
	stripe,
	isLoading,
	setIsLoading,
	handleCashOnDelivery,
}) => {
	const [select, setSelect] = useState(0);

	const CARD_ELEMENT_OPTIONS = {
		style: {
			base: {
				color: '#32325d',
				fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
				fontSmoothing: 'antialiased',
				fontSize: '16px',
				'::placeholder': {
					color: '#aab7c4',
				},
			},
			invalid: {
				color: '#fa755a',
				iconColor: '#fa755a',
			},
		},
	};

	return (
		<div className="w-full 800px:w-[95%] bg-[#fff] rounded-md p-5 pb-8">
			{/* pay with debit or credit card */}
			<div className="flex pb-3">
				<input
					className="w-[25px] h-[25px]"
					type="radio"
					name="payment_method"
					onChange={(e) => {
						if (e.target.checked) {
							setSelect(1);
							console.log(select);
						}
					}}
				/>
				<h1
					className={`${
						select == 1 ? 'opacity-[1]' : 'opacity-[0.7]'
					} pl-2 text-[18px] font-[500]`}
				>
					Pay with debit/credit card
				</h1>
			</div>
			{select === 1 && (
				<form onSubmit={paymentHandler}>
					<div>
						<label>
							<h1 className="font-[400] t-[16px] pb-2">Card detail</h1>

							<CardElement options={CARD_ELEMENT_OPTIONS} />
						</label>
						{isLoading ? (
							<Lottie
								className=" w-[100px] h-[100px]"
								animationData={animationData}
							/>
						) : (
							<button
								type="submit"
								disabled={!stripe}
								className=" bg-red-500 flex items-center justify-center text-white py-2  my-4 w-[120px] rounded-md"
							>
								Confirm order
							</button>
						)}
					</div>
				</form>
			)}

			{/* cash delivery */}
			<div className="flex">
				<input
					className="w-[25px] h-[25px]"
					type="radio"
					name="payment_method"
					onChange={(e) => {
						if (e.target.checked) {
							setSelect(2);
							console.log(select);
						}
					}}
				/>
				<h1
					className={`${
						select == 1 ? 'opacity-[1]' : 'opacity-[0.7]'
					} pl-2 text-[18px] font-[500]`}
				>
					Cash on delivery
				</h1>
			</div>
			{select === 2 && (
				<div className="w-full ">
					<button
						onClick={handleCashOnDelivery}
						className=" bg-red-500 flex items-center justify-center text-white py-2  my-4 w-[120px] rounded-md"
					>
						Confirm order
					</button>
				</div>
			)}
		</div>
	);
};

const CartData = ({orderData}) => {
	// console.log(orderData);
	const shipping = orderData?.shipping?.toFixed(2);
	return (
		<div className="w-full bg-[#fff] rounded-md p-5 pb-8">
			<div className="flex justify-between">
				<h3 className="text-[16px] font-[400] text-[#000000a4]">subtotal:</h3>
				<h5 className="text-[18px] font-[600]">${orderData?.subTotalPrice}</h5>
			</div>
			<br />
			<div className="flex justify-between">
				<h3 className="text-[16px] font-[400] text-[#000000a4]">shipping:</h3>
				<h5 className="text-[18px] font-[600]">${shipping}</h5>
			</div>
			<br />
			<div className="flex justify-between border-b pb-3">
				<h3 className="text-[16px] font-[400] text-[#000000a4]">Discount:</h3>
				<h5 className="text-[18px] font-[600]">
					{orderData?.discountPrice ? '$' + orderData.discountPrice : '-'}
				</h5>
			</div>
			<h5 className="text-[18px] font-[600] text-end pt-3">
				${orderData?.totalPrice}
			</h5>
			<br />
		</div>
	);
};

export default Payment;
