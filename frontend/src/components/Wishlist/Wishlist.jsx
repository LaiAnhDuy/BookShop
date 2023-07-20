import React, {useState} from 'react';
import {RxCross1} from 'react-icons/rx';
import {IoBagHandleOutline} from 'react-icons/io5';
import {Link} from 'react-router-dom';
import {BsCartPlus} from 'react-icons/bs';
import {AiOutlineHeart} from 'react-icons/ai';
import {useDispatch, useSelector} from 'react-redux';
import {addToCart} from '../../redux/actions/cart';
import {toast} from 'react-toastify';
import {backend_url} from '../../server';
import {removeFromWishlist} from '../../redux/actions/wishlist';
const Wishlist = ({setOpenWishlist}) => {
	// const wishlist = [];
	const dispatch = useDispatch();

	const {wishlist} = useSelector((state) => state.wishlist);
	const {cart} = useSelector((state) => state.cart);

	const addToCartHandler = (data) => {
		if (cart && cart.some((i) => i._id == data._id)) {
			toast.error('Product has already been added to cart');
		} else {
			dispatch(addToCart({...data, qty: 1}));
			toast.success('Product is added to cart');
			setOpenWishlist(false);
		}
	};

	const removeFromWishlistHandler = (data) => {
		dispatch(removeFromWishlist(data));
	};
	return (
		<div className="fixed top-0 left-0 w-full h-screen  bg-[#000000] bg-opacity-[0.3] z-10">
			<div className="fixed top-0 right-0 w-[25%] h-screen z-20 bg-white flex flex-col justify-between shadow-md overflow-y-scroll  ">
				{wishlist && wishlist.length === 0 ? (
					<div className="flex with-full h-[100vh] justify-center items-center">
						<div className="fixed top-3 right-3">
							<RxCross1
								size={25}
								className="cursor-pointer"
								onClick={() => setOpenWishlist(false)}
							/>
						</div>
						<h1>Wishlist is empty</h1>
					</div>
				) : (
					<div className="flex flex-col w-full ">
						<div className="fixed mr-3 top-3 right-3">
							<RxCross1
								size={25}
								className="cursor-pointer"
								onClick={() => setOpenWishlist(false)}
							/>
						</div>
						<div className="flex items-center py-8 pl-4">
							<AiOutlineHeart size={25} />
							<h4 className="pl-4 text-[20px] font-[500]">{wishlist.length} items</h4>
						</div>
						{/* wishlist single item */}
						<div className="w-full  border-t">
							{wishlist &&
								wishlist.map((i, index) => (
									<WishlistSingle
										data={i}
										index={index}
										addToCartHandler={addToCartHandler}
										removeFromWishlistHandler={removeFromWishlistHandler}
									/>
								))}
						</div>
						{/* checkout button */}
					</div>
				)}
			</div>
		</div>
	);
};

const WishlistSingle = ({
	data,
	addToCartHandler,
	removeFromWishlistHandler,
}) => {
	// console.log(data);
	const [value, setValue] = useState(1);
	// const totalPrice = data.price * value;

	return (
		<div className="border-b p-4">
			<div className="w-full 800px:flex items-center">
				<div>
					<RxCross1
						className="cursor-pointer 800px:mb-['unset'] 800px:ml-['unset'] mb-2 ml-2"
						onClick={() => removeFromWishlistHandler(data)}
					/>
				</div>
				<img
					src={`${backend_url}${data?.images[0]}`}
					alt=""
					className="w-[100px] h-min ml-2 mr-2 rounded-[5px]"
				/>

				<div className="pl-[5px]">
					<h1>{data.name}</h1>
					<h4 className="font-[600] pt-3 800px:pt-[3px] text-[17px] text-[#d02222] font-Roboto">
						${data.discountPrice}
					</h4>
				</div>
				<div>
					<BsCartPlus
						size={20}
						className="cursor-pointer"
						tile="Add to cart"
						onClick={() => addToCartHandler(data)}
					/>
				</div>
			</div>
		</div>
	);
};

export default Wishlist;
