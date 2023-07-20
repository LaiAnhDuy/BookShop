import React, {useState} from 'react';
import {RxCross1} from 'react-icons/rx';
import {IoBagHandleOutline} from 'react-icons/io5';
import {Link} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {backend_url} from '../../server';
import {addToCart, removeFromCart} from '../../redux/actions/cart';
import {toast} from 'react-toastify';

const Cart = ({setOpenCart}) => {
	const [listSelected, setListSelected] = useState([]);
	const dispatch = useDispatch();
	const removeFromCartHandler = (data) => {
		dispatch(removeFromCart(data));
	};
	// const cartData = [];
	const {cart} = useSelector((state) => state.cart);

	const cartSelected = cart.filter((item) => {
		return listSelected.includes(item._id);
	});
	const totalPrice = cart.reduce(
		(total, item) => total + item.discountPrice * item.qty,
		0
	);
	console.log(listSelected);
	return (
		<div className="fixed top-0 left-0 w-full h-screen  bg-[#000000] bg-opacity-[0.3] z-10">
			<div className="fixed top-0 right-0 w-[30%] h-screen z-20 bg-white flex flex-col justify-between shadow-md overflow-y-scroll  ">
				{cart && cart.length === 0 ? (
					<div className="flex relative with-full h-[100vh] justify-center items-center">
						<div className="sticky top-3 right-3">
							<RxCross1
								size={25}
								className="cursor-pointer"
								onClick={() => setOpenCart(false)}
							/>
						</div>
						<h1>Cart is empty</h1>
					</div>
				) : (
					<div className="flex flex-col w-full ">
						<div>
							<div className="float-right mt-3 mr-3">
								<RxCross1
									size={25}
									className="cursor-pointer"
									onClick={() => setOpenCart(false)}
								/>
							</div>
							<div className="flex items-center py-8 pl-4">
								<IoBagHandleOutline size={25} />
								<h4 className="pl-4 text-[20px] font-[500]">{cart.length} items</h4>
							</div>
						</div>

						{/* cart single item */}
						<div className="w-full  border-t min-h-[80vh]">
							{cart &&
								cart.map((i, index) => (
									<CartSingle
										listSelected={listSelected}
										data={i}
										index={index}
										removeFromCartHandler={removeFromCartHandler}
										setListSelected={setListSelected}
									/>
								))}
						</div>
						{/* checkout button */}

						<div className="sticky bottom-0 right-0 w-full bg-slate-50 shadow-md">
							<h3 className="mx-5 mt-5 mb-1">{`Total price(${cart.length} products): USD$${totalPrice}`}</h3>
							<Link to="/checkout">
								<div className="mx-5 mb-5 h-[45px] bg-red-500 rounded-md text-white flex items-center justify-center cursor-pointer">
									<h1 className="text-[18px]">Checkout Now</h1>
								</div>
							</Link>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

const CartSingle = ({
	data,
	removeFromCartHandler,
	setListSelected,
	listSelected,
}) => {
	console.log(listSelected);
	const [selected, setSelected] = useState(false);
	const dispatch = useDispatch();
	// console.log(data);
	const [value, setValue] = useState(data.qty);
	const totalPrice = data.discountPrice * value;
	const increment = () => {
		if (data.stock > data.qty) {
			setValue(value + 1);

			dispatch(addToCart({...data, qty: value + 1}));
			console.log(2);
		} else {
			toast.error('product stock limited');
		}
	};
	const decrement = () => {
		setValue(value > 1 ? value - 1 : 1);
		dispatch(addToCart({...data, qty: value > 1 ? value - 1 : 1}));
	};
	return (
		<div className={selected ? '' : 'opacity-80'}>
			{' '}
			<div className="border-b p-2 flex w-full items-center justify-between">
				<div>
					{/* <input
						onChange={(e) => {
							if (e.target.checked) {
								setListSelected([...listSelected, data._id]);
								setSelected(true);
							} else {
								console.log(listSelected);
								setListSelected(listSelected.filter((item) => item != data._id));
								setSelected(false);
							}
						}}
						type="checkbox"
						className="w-5 h-5 mr-1"
					/> */}
				</div>
				<div className="mr-2">
					<div
						onClick={increment}
						className="cursor-pointer h-[30px] w-[30px] bg-red-600 rounded-full my-4 flex justify-center items-center text-lg"
					>
						+
					</div>
					<h1 className="pl-[10px]">{value}</h1>
					<div
						onClick={decrement}
						className="cursor-pointer h-[30px] w-[30px] bg-gray-400 rounded-full my-4 flex justify-center items-center text-lg"
					>
						-
					</div>
				</div>

				<img
					className=" block w-[100px] h-[50px] object-cover rounded-md"
					alt=""
					src={backend_url + data.images[0]}
				></img>
				<div className="px-[5px] text-[14px] ">
					<h1>{data.name}</h1>
					<h4 className="font-[400] text-[15px] text-[#00000082]">
						${data.discountPrice} * {value}
					</h4>
					<h4 className="font-[600] text-[17px] pt-[3px] text-[#d02222] font-Roboto">
						US${totalPrice}
					</h4>
				</div>
				<div>
					<RxCross1
						size={18}
						className=" block cursor-pointer  "
						onClick={() => removeFromCartHandler(data)}
					/>
				</div>
			</div>
		</div>
	);
};

export default Cart;
