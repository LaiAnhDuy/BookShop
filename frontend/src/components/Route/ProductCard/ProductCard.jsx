import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import Rating from '@material-ui/lab/Rating';
// import styles from '../../../styles/styles';
import ProductDetailsCard from '../ProductDetailsCard/ProductDetailsCard.jsx';
import {
	AiOutlineHeart,
	AiFillHeart,
	AiOutlineShoppingCart,
	AiOutlineEye,
} from 'react-icons/ai';
import {backend_url} from '../../../server.js';
import {useDispatch, useSelector} from 'react-redux';
import {
	removeFromWishlist,
	addToWishlist,
} from '../../../redux/actions/wishlist.js';

import {addToCart} from '../../../redux/actions/cart.js';
import {toast} from 'react-toastify';

const ProductCard = ({data}) => {
	const {cart} = useSelector((state) => state.cart);
	const {wishlist} = useSelector((state) => state.wishlist);
	const dispatch = useDispatch();
	// console.log(data);

	const [click, setClick] = useState(false);
	const [open, setOpen] = useState(false);

	const addToCartHandler = () => {
		const isItemExists = cart && cart.find((i) => i._id === data._id);
		if (isItemExists) {
			toast.error('Item already in cart!');
		} else if (data.stock < 1) {
			toast.error('The product is temporarily out of stock');
		} else {
			dispatch(
				addToCart({
					...data,
					qty: 1,
				})
			);
			toast.success('Item added to cart successfully');
		}
	};

	const removeFromWishlistHandler = () => {
		setClick(false);
		dispatch(removeFromWishlist(data));
	};

	const addToWishlistHandler = () => {
		setClick(true);
		dispatch(addToWishlist(data));
	};

	useEffect(() => {
		if (wishlist && wishlist.some((item) => item._id == data._id)) {
			setClick(true);
		} else setClick(false);
	}, [wishlist]);
	return (
		<div className=" w-full h-[370px] bg-white rounded-lg shadow-sm p-3 relative cursor-pointer">
			<Link to={`/product/${data._id}`}>
				<img
					src={`${backend_url}${data.images && data.images[0]}`}
					alt=""
					className="w-full h-[170px] object-contain"
				></img>
			</Link>
			<Link to={`/shop/preview/${data.shop._id}`}>
				<h5 className="text-blue-400 py-3">{data.shop.name}</h5>
			</Link>
			<Link to={`/product/${data._id}`}>
				<h4 className="pb-3 font-[500]">
					{data.name.length > 40 ? data.name.slice(0, 40) + '...' : data.name}
				</h4>
				<Rating
					name="half-rating"
					defaultValue={data.ratings}
					precision={0.1}
					readOnly
				/>
				<div className="flex content-center justify-between py-2">
					<div className="flex items-start">
						<h5 className="font-[500] text-[18px] pr-2">
							{data.Price === 0 ? '' : data.discountPrice + '$'}
						</h5>
						<h4 className="font-[500] text-[15px] pr-2 text-red-600 line-through mt-[-2px]">
							{data.originalPrice}
						</h4>
					</div>
					<span className="font-[400] text-[17px] text-[#68d284]">
						{data?.sold_out} sold
					</span>
				</div>
			</Link>

			{/* options */}
			<div>
				{click ? (
					<AiFillHeart
						size={22}
						className="absolute top-5 right-2"
						onClick={removeFromWishlistHandler}
						color="red"
						title="Remove from wishlist"
					/>
				) : (
					<AiOutlineHeart
						size={22}
						className="absolute top-5 right-2"
						onClick={addToWishlistHandler}
						title="Add to wishlist"
					/>
				)}
				<AiOutlineEye
					size={22}
					className="cursor-pointer absolute right-2 top-14"
					onClick={() => setOpen(!open)}
					color="#333"
					title="Quick view"
				/>
				<AiOutlineShoppingCart
					size={25}
					className="cursor-pointer absolute right-2 top-24"
					onClick={addToCartHandler}
					color="#444"
					title="Add to cart"
				/>
				{open && (
					<ProductDetailsCard
						setOpen={setOpen}
						data={data}
					></ProductDetailsCard>
				)}
			</div>
		</div>
	);
};

export default ProductCard;
