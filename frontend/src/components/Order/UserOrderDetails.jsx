import React, {useEffect, useState} from 'react';
import styles from '../../styles/styles';
import {BsBagFill} from 'react-icons/bs';
import {Button} from '@material-ui/core';
import {useDispatch, useSelector} from 'react-redux';
import {Link, useParams} from 'react-router-dom';
import {getAllOrderShop, getAllOrderUser} from '../../redux/actions/order';
import {backend_url} from '../../server';
import {RxCross1} from 'react-icons/rx';
import {AiFillStar, AiOutlineStar} from 'react-icons/ai';
import axios from '../../redux/actions/axiosConfig';
import {toast} from 'react-toastify';

const UserOrderDatails = () => {
	const [comment, setComment] = useState(null);

	const dispatch = useDispatch();
	const {id} = useParams();
	const {orders, isLoading} = useSelector((state) => state.order);
	const {user} = useSelector((state) => state.user);
	console.log(user);
	const order = orders?.find((order) => order._id === id);
	useEffect(() => {
		dispatch(getAllOrderUser(user._id));
	}, []);
	// console.log(order);
	const [open, setOpen] = useState(false);
	const [selected, setSelected] = useState(null);
	const [status, setStatus] = useState('');
	useEffect(() => setStatus(order?.status), [orders]);
	const [rating, setRating] = useState(1);
	const reviewHandler = async () => {
		try {
			await axios.put('/product/create-new-review', {
				user,
				productId: selected._id,
				rating,
				comment,
				orderId: order._id,
			});
			dispatch(getAllOrderUser(user._id));
			setComment('');
			setOpen(false);
			setSelected(null);
			setRating(1);
			toast.success('Your new review has been created');
		} catch (error) {
			toast.error(error.response.data.message);
		}
	};
	const refundHandler = async () => {
		await axios
			.put(`order/order-refund/${order._id}`, {
				status: 'Processing refund',
			})
			.then((res) => {
				toast.success(res.data.message);
				dispatch(getAllOrderUser(user._id));
			})
			.catch((error) => {
				toast.success(error.res.data.message);
			});
	};
	return (
		<div>
			{order && (
				<div className={`${styles.section} my-7`}>
					<div className="flex justify-between">
						<div className="flex">
							<BsBagFill
								size={24}
								className="text-red-600"
							/>
							<h1 className="ml-2 text-[20px] font-[500] ">Order Detail</h1>
						</div>
						<Link to={'/profile?type=2'}>
							<div>
								<Button variant="contained">Order List</Button>
							</div>
						</Link>
					</div>

					<div className="800px:flex 800px:justify-between mt-7 text-gray-500">
						<div>
							<span>Order ID: {order?._id.slice(0, 10)}</span>
						</div>
						<div>Placed On : {order?.createdAt.slice(0, 10)}</div>
					</div>

					<div className="my-7">
						{order?.cart.map((item) => (
							<div className="800px:flex 800px:justify-between">
								<div className=" flex mb-3 800px:max-w-[70%] items-center ">
									<img
										className="block h-[60px] w-[60px] object-cover"
										src={backend_url + item.images[0]}
										alt=""
									/>
									<div className="ml-2 flex flex-col justify-between">
										<h1 className="text-[16px] font-[500]">{item.name}</h1>
										<div className="text-gray-500">
											US${item.discountPrice} * {item.qty}
										</div>
									</div>
								</div>
								<div>
									{item && !item.isReviewed && order.status === 'Delivered' && (
										<Button
											onClick={() => {
												setOpen(true);
												setSelected(item);
											}}
											variant="contained"
										>
											Write a review
										</Button>
									)}
								</div>
							</div>
						))}
					</div>

					{/* review popup */}
					{open && (
						<div className="fixed z-30 top-0 right-0 left-0 bottom-0 bg-[#1c02024f] flex justify-center items-center ">
							<div className="w-[75%] 800px:w-[50%] h-[75vh] overflow-y-scroll bg-white rounded-md">
								<div className="flex justify-end p-2 ">
									<RxCross1
										size={30}
										onClick={() => setOpen(false)}
										className="cursor-pointer"
									/>
								</div>
								<div className="w-full px-4">
									<div className="text-center">
										<h1 className="text-[22px] font-[700] mt-3 mb-5">Give a Review</h1>
									</div>
									<div className="flex w-full items-center ">
										<img
											src={backend_url + selected?.images[0]}
											alt=""
											className="block object-cover w-[60px] h-[60px]"
										/>
										<div className=" ml-2">
											<h1 className="font-[500]">{selected.name}</h1>
											<h2>
												US${selected.discountPrice} * {selected.qty}
											</h2>
										</div>
									</div>
									<div className="mt-8">
										<h1 className="font-[500] text-[17px]">
											Give a Rating <span className="text-red-600"> *</span>
										</h1>
										<div className="flex my-2 gap-2">
											{[1, 2, 3, 4, 5].map((i) => {
												if (rating >= i) {
													return (
														<AiFillStar
															key={i}
															className="mr-1 cursor-pointer"
															color="rgb(246,186,0)"
															size={25}
															onClick={() => setRating(i)}
														/>
													);
												} else {
													return (
														<AiOutlineStar
															key={i}
															className="mr-1 cursor-pointer"
															color="rgb(246,186,0)"
															size={25}
															onClick={() => setRating(i)}
														/>
													);
												}
											})}
										</div>
									</div>
									<div className="mt-8">
										<h1 className="font-[500] text-[17px]">
											Write a Comment{' '}
											<span className="text-gray-400 !text-[15px]"> (optional)</span>
										</h1>
										<textarea
											onChange={(e) => setComment(e.target.value)}
											className="border mt-3 p-3"
											placeholder="How id your product? write your expression about it"
											name=""
											id=""
											cols="90"
											rows="4"
										></textarea>
									</div>
									<div
										className={`${styles.button} text-white text-[20px] ml-3`}
										onClick={reviewHandler}
									>
										Submit
									</div>
								</div>
							</div>
						</div>
					)}
					<hr />
					<div className="flex justify-end mt-5">
						<h1 className="text-[17px] font-[400]">
							Total Price: <span className="font-[600]">US${order?.totalPrice}</span>
						</h1>
					</div>
					<div className="my-7 800px:flex 800px:justify-between">
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
					<div className=" 800px:flex 800px:justify-between">
						<div>
							<h1 className="text-[18px] font-[600] py-2">Order Status</h1>
							<h1>{order.status}</h1>
						</div>
						<div className="flex flex-col gap-2">
							<Link to={'/'}>
								<Button
									variant="contained"
									// onClick={refundHandler}
								>
									Send Message
								</Button>
							</Link>
							{order.status == 'Delivered' && (
								<Button
									variant="contained"
									onClick={refundHandler}
								>
									Refund
								</Button>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default UserOrderDatails;
