import React, {useEffect, useState} from 'react';
import {GrClose} from 'react-icons/gr';
import {Link} from 'react-router-dom';
import styles from '../../../styles/styles';
import {AiOutlineMessage, AiOutlineHeart, AiFillHeart} from 'react-icons/ai';
import {backend_url} from '../../../server';
import {useDispatch, useSelector} from 'react-redux';
import {toast} from 'react-toastify';
import {addToCart} from '../../../redux/actions/cart';
import {
	addToWishlist,
	removeFromWishlist,
} from '../../../redux/actions/wishlist';

const ProductDetailsCard = ({setOpen, data}) => {
	const dispatch = useDispatch();
	const {cart} = useSelector((state) => state.cart);
	const {wishlist} = useSelector((state) => state.wishlist);

	const handleMessageSubmit = () => {};
	const [count, setCount] = useState(1);
	const [click, setClick] = useState(false);

	const decrementCount = () => {
		if (count > 1) setCount(count - 1);
	};

	const incrementCount = () => {
		setCount(count + 1);
	};
	const addToWishlistHandler = () => {
		setClick(true);
		dispatch(addToWishlist(data));
	};

	const removeFromWishlistHandler = () => {
		setClick(false);
		dispatch(removeFromWishlist(data));
	};

	const addToCartHandler = () => {
		const isItemExist = cart.find((item) => item._id == data._id);
		if (isItemExist) {
			toast.error('item already exists in cart');
		} else if (data.stock >= count) {
			dispatch(addToCart({...data, qty: count}));
			toast.success('item added to cart successfully');
		} else {
			toast.error('Product stock limited!');
		}
	};

	useEffect(() => {
		if (wishlist && wishlist.some((item) => item._id == data._id)) {
			setClick(true);
		}
	}, []);
	return (
		<div className="bg-[#fff]">
			{data && (
				<div
					onScroll={(e) => {
						e.preventDefault();
					}}
					className="fixed w-full h-full top-0 left-0 bg-gray-500 bg-opacity-50 z-40 flex items-center justify-center"
				>
					<div className="w-[90%] h-[90%]  bg-white 800px:w-[60%] 800px:h-[75vh] rounded-md shadow-sm relative p-4 overflow-y-scroll">
						<GrClose
							size={20}
							className="absolute right-1 top-1 "
							onClick={() => setOpen(false)}
						/>
						<div className="w-full 800px:flex">
							<div className="w-full 800px:w-[50%]">
								<img
									src={`${backend_url}${data.images && data.images[0]}`}
									className="w-full object-cover "
								></img>
								<div className="flex">
									<Link
										to={`/shop/preview/${data.shop._id}`}
										className="flex"
									>
										<img
											className="mr-2 w-[50px] h-[50px] rounded-full object-cover"
											src={backend_url + data.shop.avatar}
										></img>
										<div className="h-[50px]">
											<h3 className={styles.shop_name}>{data.shop.name}</h3>
											<h5 className=" mt-[-10px] text-[15px]">({data.ratings}) Ratings</h5>
										</div>
									</Link>
								</div>
								<div
									className={`${styles.button} bg-[#000] mt-7 rounded-[4px] h-11`}
									onClick={handleMessageSubmit}
								>
									<span className="text-white">
										Send message <AiOutlineMessage className="ml-1 inline-block" />
									</span>
								</div>
								<h5 className="text-[16px] text-[red] mt-5">
									{data.sold_out} Sold out
								</h5>
							</div>
							<div className="w-full 800px:w-[50%] p-1">
								<h1 className={styles.productTitle}>{data.name}</h1>
								<p>{data.description}</p>
								<div className="flex pt-3">
									<h4 className={`${styles.productDiscountPrice}`}>
										{data.discountPrice}$
									</h4>
									<h3 className={`${styles.price}`}>
										{data.originalPrice ? data.originalPrice + '$' : null}
									</h3>
								</div>
								<div className="flex items-center justify-between mt-12 pr-1">
									<div className="flex items-center">
										<button
											onClick={decrementCount}
											className="w-[40px] h-[40px] bg-green-500 text-[20px] rounded"
										>
											-
										</button>
										<button className="w-[43px] h-[43px] bg-gray-400 text-[20px] rounded">
											{count}
										</button>
										<button
											onClick={incrementCount}
											className="w-[40px] h-[40px] bg-green-500 text-[20px] rounded"
										>
											+
										</button>
									</div>
									<div>
										{click ? (
											<AiFillHeart
												size={30}
												className="cursor-pointer"
												onClick={removeFromWishlistHandler}
												color="red"
												title="Remove from wishlist"
											/>
										) : (
											<AiOutlineHeart
												size={30}
												className="cursor-pointer"
												onClick={addToWishlistHandler}
												title="Add to wishlist"
											/>
										)}
									</div>
								</div>
								<div
									className={`${styles.button} text-white mt-5 rounded-sm`}
									onClick={addToCartHandler}
								>
									Add to cart
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default ProductDetailsCard;
