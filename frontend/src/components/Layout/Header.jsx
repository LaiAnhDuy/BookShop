import React, {useState} from 'react';
import styles from '../../styles/styles';
import {Link} from 'react-router-dom';
import {categoriesData} from '../../static/data';
// import {Navbar} from './Navbar.jsx';
import {
	AiOutlineSearch,
	AiOutlineMenu,
	AiOutlineShoppingCart,
} from 'react-icons/ai';
import {RxCross1} from 'react-icons/rx';
import {IoIosArrowForward} from 'react-icons/io';
import {BiMenuAltLeft} from 'react-icons/bi';
import {IoIosArrowDown} from 'react-icons/io';
import DropDown from './DropDown.jsx';
import Navbar from './Navbar.jsx';
import {AiOutlineHeart} from 'react-icons/ai';
import {FaRegUserCircle} from 'react-icons/fa';
import {backend_url} from '../../server';
import {useSelector} from 'react-redux';
import Cart from '../Cart/Cart.jsx';
import Wishlist from '../Wishlist/Wishlist.jsx';

const Header = ({activeHeading}) => {
	const {wishlist} = useSelector((state) => state.wishlist);

	// const [openSearch, setOpenSearch] = useState(false);
	const [openCart, setOpenCart] = useState(false);
	const [openWishlist, setOpenWishlist] = useState(false);
	const {isAuthenticated, user} = useSelector((state) => state.user);
	const {isSeller} = useSelector((state) => state.seller);
	const {cart} = useSelector((state) => state.cart);
	// console.log(user, isAuthenticated);
	const [searchTerm, setSearchTerm] = useState('');
	const [searchData, setSearchData] = useState(null);
	const [active, setActive] = useState(false);
	const [dropDown, setDropDown] = useState(false);
	const [open, setOpen] = useState(false);
	window.addEventListener('scroll', () => {
		if (window.scrollY > 70) {
			setActive(true);
		} else {
			setActive(false);
		}
	});
	const {allProducts} = useSelector((state) => state.product);
	const handleSearchChange = (e) => {
		const term = e.target.value;
		setSearchTerm(term);
		const filteredProducts =
			allProducts &&
			allProducts?.filter((product) => {
				return product.name.toLowerCase().includes(term.toLowerCase());
			});
		setSearchData(filteredProducts);
		// console.log(searchData?.length);
	};
	return (
		<>
			<div className={`${styles.section}`}>
				<div className="hidden 800px:flex 800px:h-[50px] 800px:my-[20px] 800px:items-center 800px:justify-between">
					<div>
						<Link to="/">
						<img
							src="https://shopo.quomodothemes.website/assets/images/logo.svg"
							alt=""
						/>
						</Link>
					</div>
					<div className="w-[50%] relative">
						<input
							type="text"
							placeholder="Tìm kiếm..."
							className="h-[40px] w-full px-2 border-blue-600 border-2 rounded-md"
							value={searchTerm}
							onChange={handleSearchChange}
							// onFocus={() => setOpenSearch(true)}
							// onBlur={() => setOpenSearch(false)}
						></input>
						<AiOutlineSearch
							size={28}
							className="absolute top-1.5 right-2 cursor-pointer"
						/>
						{searchTerm && searchData && searchData.length > 0 ? (
							<div
								className="w-full absolute min-h-[30vh] max-h-[90vh] overflow-y-scroll bg-slate-50 shadow-sm-2 z-10 p-4"
								// onFocus={(e) => {
								// 	e.preventDefault();
								// 	setOpenSearch(true);
								// 	console.log(1);
								// }}
							>
								{searchData &&
									searchData.map((i, index) => {
										return (
											<Link to={`/product/${i._id}`}>
												<div className="w-full flex items-start py-3">
													<img
														alt=""
														src={backend_url + i.images[0]}
														className="w-[40px] h-[40px] mr-[10px]"
													></img>
													<h1>{i.name}</h1>
												</div>
											</Link>
										);
									})}
							</div>
						) : null}
					</div>
					<div className={styles.button}>
						<Link to={isSeller ? '/dashboard' : '/shop-create'}>
							<h1 className="text-white flex items-center">
								{isSeller ? 'Bảng điều khiển' : 'Tạo tài khoản'}{' '}
								<IoIosArrowForward className="ml-1" />
							</h1>
						</Link>
					</div>
				</div>
			</div>
			<div
				className={`${
					active ? 'fixed top-0 left-0 z-10 shadow-sm' : ''
				} hidden transition  bg-blue-700 w-full h-[70px] 800px:flex`}
			>
				<div
					className={`${styles.section} relative ${styles.noramlFlex} justify-between `}
				>
					{/* categories */}
					<div
						onClick={() => setDropDown(!dropDown)}
						className=" relative h-[60px] w-[260px] mt-[10px] bg-white text-center rounded-t-md hidden 1000px:block cursor-pointer"
					>
						<BiMenuAltLeft
							size={30}
							className="absolute left-4 top-3"
						/>
						<span className="leading-[60px] text-xl font-bold cursor-pointer ">
							Thể loại
						</span>
						<IoIosArrowDown
							size={20}
							className="absolute right-4 top-5 cursor-pointer"
						/>
						{dropDown && (
							<DropDown
								categoriesData={categoriesData}
								setDropDown={setDropDown}
							></DropDown>
						)}
					</div>

					{/* navItem */}
					<div
						className={styles.noramlFlex}
						// style={{width: '300px', height: '50px'}}
					>
						<Navbar active={activeHeading} />
					</div>

					<div className="flex">
						<div className="pr-4 ">
							<div
								className="relative cursor-pointer "
								onClick={() => setOpenWishlist(!openWishlist)}
							>
								<AiOutlineHeart
									size={30}
									color="rgba(255, 255, 255, 0.83)"
								/>
								<div className="flex justify-center items-center text-white w-4 h-4 absolute top-0 right-0 rounded-full bg-[#3bc177] text-[12px] ">
									{wishlist.length}
								</div>
							</div>
						</div>
						<div className="pr-4 ">
							<div
								className="relative cursor-pointer "
								onClick={() => setOpenCart(!openCart)}
							>
								<AiOutlineShoppingCart
									size={30}
									color="rgba(255, 255, 255, 0.83)"
								/>
								<div className="flex justify-center items-center text-white w-4 h-4 absolute top-0 right-0 rounded-full bg-[#3bc177] text-[12px] ">
									{cart.length}
								</div>
							</div>
						</div>
						<div className="pr-4 ">
							<div className="relative cursor-pointer ">
								{isAuthenticated ? (
									<Link to="/profile">
										<img
											alt=""
											className="w-[30px] h-[30px] rounded-full object-cover"
											src={`${backend_url}/${user.avatar}`}
										></img>
									</Link>
								) : (
									<Link to="/login">
										<FaRegUserCircle
											size={30}
											color="rgba(255, 255, 255, 0.83)"
										/>
									</Link>
								)}
							</div>
						</div>

						{/* cart popup */}
						{openCart && <Cart setOpenCart={setOpenCart} />}
						{openWishlist && <Wishlist setOpenWishlist={setOpenWishlist} />}
					</div>
				</div>
			</div>
			{/* mobile header */}
			<div className="w-full h-[60px] 800px:hidden">
				<div className="fixed z-10 top-0 left-0 flex justify-between items-center w-full h-[60px] bg-white 800px:hidden">
					<div className="ml-5">
						<AiOutlineMenu
							size={30}
							onClick={() => setOpen(true)}
							className="cursor-pointer"
						/>
					</div>
					<div>
						<Link to="/">
							<img
								src="https://shopo.quomodothemes.website/assets/images/logo.svg"
								alt=""
								className="mt-3 cursor-pointer"
							/>
						</Link>
					</div>
					<div className=" relative mr-5">
						<AiOutlineShoppingCart size={30} />
						<span className="absolute top-0 right-0 bg-green-500 w-4 h-4 leading-4 text-center rounded-full text-white">
							{cart.length}
						</span>
					</div>

					{/* headerSidebar */}
					{open && (
						<div className="fixed w-full h-full z-10 top-0 left-0 bg-[#00000032]">
							<div className="fixed w-[60%] bg-white top-0 left-0 h-screen overflow-y-scroll z-20">
								<div className="flex w-full m-4 justify-between items-center">
									<div
										className="relative cursor-pointer "
										// onClick={() => setOpenWishlist(!openWishlist)}
									>
										<AiOutlineHeart size={30} />
										<div className="flex justify-center items-center text-white w-4 h-4 absolute top-0 right-0 rounded-full bg-[#3bc177] text-[12px] ">
											0
										</div>
									</div>

									<RxCross1
										size={30}
										className="mr-6"
										onClick={() => setOpen(false)}
									/>
								</div>
								<div
									className="my-8 w-[90%] mx-auto h-[40px] relative"
									// onFocus={() => setOpenSearch(true)}
									// onBlur={() => setOpenSearch(false)}
								>
									<input
										type="text"
										placeholder="Tìm kiếm..."
										className="h-[40px] w-full px-2 border-blue-600 border-2 rounded-md"
										value={searchTerm}
										onChange={handleSearchChange}
									></input>
									<AiOutlineSearch
										size={28}
										className="absolute top-1.5 right-2 cursor-pointer"
									/>
									{searchTerm && searchData && searchData.length > 0 ? (
										<div className="absolute min-h-[30vh] bg-slate-50 shadow-sm-2 z-10 p-4">
											{searchData &&
												searchData.map((i, index) => {
													return (
														<Link to={`/product/${i.id}`}>
															<div className="w-full flex items-start py-3">
																<img
																	alt=""
																	src={i.image_Url[0].url}
																	className="w-[40px] h-[40px] mr-[10px]"
																></img>
																<h1>{i.name}</h1>
															</div>
														</Link>
													);
												})}
										</div>
									) : null}
								</div>
								<Navbar active={activeHeading} />
								<br />
								<div className={`${styles.button} text-white ml-5`}>
									<Link to="/shop-create">Become a seller</Link>
								</div>
								<br />
								<br />
								<div className="relative cursor-pointer flex justify-center ">
									{isAuthenticated ? (
										<Link to="/profile">
											<img
												alt=""
												className="w-[60px] h-[60px] rounded-full object-cover"
												src={`${backend_url}/${user?.avatar}`}
											></img>
										</Link>
									) : (
										<Link to="/login">
											<FaRegUserCircle
												size={60}
												color="rgba(255, 255, 255, 0.83)"
											/>
										</Link>
									)}
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</>
	);
};

export default Header;
