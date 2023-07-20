import React, {useEffect, useRef, useState} from 'react';
import styles from '../../styles/styles';
import {BsBagFill} from 'react-icons/bs';
import {Button} from '@material-ui/core';
import Lottie from 'lottie-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
// import {Document, Page, Text, View, StyleSheet} from '@react-pdf/renderer';

import {useDispatch, useSelector} from 'react-redux';
import {Link, useParams} from 'react-router-dom';
import {getAllOrderShop} from '../../redux/actions/order';
import {backend_url} from '../../server';
import axios from '../../redux/actions/axiosConfig';
import {toast} from 'react-toastify';
import animationData from '../../Assests/animations/98288-loading.json';

const OrderDatails = () => {
	const reportTemplateRef = useRef(null);
	const handleGeneratePdf = () => {
		console.log(reportTemplateRef.current);
		const doc = new jsPDF({
			format: 'a4',
			unit: 'pt',
		});

		doc.setFont('Inter-Regular', 'normal');

		doc.html(reportTemplateRef.current, {
			async callback(doc) {
				await doc.save('order - ' + order._id);
			},
		});
	};

	const dispatch = useDispatch();
	const {id} = useParams();
	const {orders} = useSelector((state) => state.order);
	const {seller} = useSelector((state) => state.seller);
	const [order, setOrder] = useState(null);
	useEffect(() => {
		const order = orders?.find((order) => order._id === id);
		setOrder(order);
	}, [orders]);
	console.log(order);
	useEffect(() => {
		dispatch(getAllOrderShop(seller._id));
	}, []);
	// console.log(order);
	const orderStatuses = [
		'Processing',
		'Transferred to delivery partner',
		'Shipping',
		'Received',
		'On the way',
		'Delivered',
	];
	const [status, setStatus] = useState('');
	useEffect(() => setStatus(order?.status), [orders]);
	const handleUpdateOrderStatus = async () => {
		if (status === order.status) {
			return toast.error('please select a status');
		}
		setUpdateLoading(true);

		try {
			const {data} = await axios.put(`/order/update-order-status/${order?._id}`, {
				status,
			});

			dispatch(getAllOrderShop(seller._id));
			toast.success('Updated order status successfully');
			setUpdateLoading(false);
		} catch (error) {
			toast.error(error.response.data.message);
			setUpdateLoading(false);
		}
	};
	const orderRefundHandler = async () => {
		if (status === order.status) {
			return toast.error('please select a status');
		}
		setUpdateLoading(true);

		try {
			await axios.put(`/order/order-refund-success/${order?._id}`, {
				status,
			});

			dispatch(getAllOrderShop(seller._id));
			toast.success('Updated order status successfully');
			setUpdateLoading(false);
		} catch (error) {
			toast.error(error.response.data.message);
			setUpdateLoading(false);
		}
	};
	const [updateLoading, setUpdateLoading] = useState(false);
	return (
		<div>
			{order && (
				<div className={`${styles.section} my-7`}>
					<div
						className="flex justify-between "
						ref={reportTemplateRef}
					>
						<div className="flex">
							<BsBagFill
								size={24}
								className="text-red-600"
							/>
							<h1 className="ml-2 text-[20px] font-[500] ">Order Detail</h1>
						</div>
						{/* <Link
							to={
								order.status === 'Processing refund' ||
								order.status === 'Refund Success'
									? '/dashboard-refunds'
									: '/dashboard-orders'
							}
						> */}
						<div>
							<Button
								variant="outlined"
								className="button"
								onClick={handleGeneratePdf}
							>
								Generate Order
							</Button>
						</div>
						{/* </Link> */}
					</div>
					<div
						className=" w-[500px] pl-[10px]"
						ref={reportTemplateRef}
					>
						<div className="flex justify-between mt-7 text-gray-500">
							<div>
								<span>Order ID: {order?._id.slice(0, 10)}</span>
							</div>
							<div>Placed On : {order?.createdAt.slice(0, 10)}</div>
						</div>
						<div className="my-7">
							{order?.cart.map((item) => (
								<div className=" flex my-2">
									<img
										className="block h-[60px] w-[60px] object-cover"
										src={backend_url + item.images[0]}
										alt=""
									/>
									<div className="ml-2 flex flex-col justify-center">
										<h1 className="text-[16px] font-[500]">{item.name}</h1>
										<div className="text-gray-500">
											US${item.discountPrice} * {item.qty}
										</div>
									</div>
								</div>
							))}
						</div>
						<hr />
						<div className="flex justify-end mt-5">
							<h1 className="text-[17px] font-[400]">
								Total Price: <span className="font-[600]">US${order?.totalPrice}</span>
							</h1>
						</div>
						<div className="my-7 flex justify-between">
							<div>
								<h1 className="text-[18px] font-[600]">Shipping Address:</h1>
								<h2>
									{`${order?.shippingAddress?.address1} ${order?.shippingAddress?.address2}`}
								</h2>
								<h2>{order.shippingAddress.city}</h2>
								<h2>{order.shippingAddress.country}</h2>
							</div>
							<div>
								<h1 className="text-[18px] font-[600]">Payment Info:</h1>
								<h2>Type: {order.paymentInfo.type}</h2>
								<h2>Status: {order.paymentInfo.status}</h2>
							</div>
						</div>
					</div>
					<div>
						<h1 className="text-[18px] font-[600] py-2">Order Status</h1>
						<select
							name=""
							id=""
							value={status}
							onChange={(e) => {
								setStatus(e.target.value);
							}}
							className="py-1 rounded-sm block"
						>
							{order.status !== 'Processing refund' &&
							order.status !== 'Refund Success'
								? orderStatuses
										.slice(
											orderStatuses.indexOf(order.status),
											orderStatuses.indexOf(order.status) + 2
										)
										.map((status) => {
											return <option value={status}>{status}</option>;
										})
								: ['Processing refund', 'Refund Success']
										.slice(
											['Processing refund', 'Refund Success'].indexOf(order.status),
											['Processing refund', 'Refund Success'].indexOf(order.status) + 2
										)
										.map((status) => {
											return <option value={status}>{status}</option>;
										})}
						</select>
						{updateLoading ? (
							<div className="w-[70px] h-[70px]">
								<Lottie animationData={animationData} />
							</div>
						) : (
							<Button
								className="block !my-4"
								variant="contained"
								color="secondary"
								onClick={
									order.status === 'Processing refund'
										? orderRefundHandler
										: handleUpdateOrderStatus
								}
							>
								Update Order Status
							</Button>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default OrderDatails;
