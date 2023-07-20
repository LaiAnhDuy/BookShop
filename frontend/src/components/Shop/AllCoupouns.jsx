import {Button} from '@material-ui/core';
import {DataGrid} from '@material-ui/data-grid';
import React, {useEffect, useState} from 'react';
import {AiOutlineDelete, AiOutlineEye} from 'react-icons/ai';
import {useDispatch, useSelector} from 'react-redux';
import {Link} from 'react-router-dom';
import {getAllProductsShop} from '../../redux/actions/product';
import {deleteProduct} from '../../redux/actions/product';
import Loader from '../Layout/Loader';
import styles from '../../styles/styles';
import {RxCross1} from 'react-icons/rx';
import {toast} from 'react-toastify';

import axios from '../../redux/actions/axiosConfig';

const AllCoupons = () => {
	const [open, setOpen] = useState(false);
	const {seller} = useSelector((state) => state.seller);

	const [isLoading, setIsLoading] = useState(true);
	const {products} = useSelector((state) => state.product);
	console.log(products);

	const [name, setName] = useState('');
	const [value, setValue] = useState(null);
	const [minAmount, setMinAmout] = useState(null);
	const [maxAmount, setMaxAmount] = useState(null);
	const [selectedProduct, setSelectedProduct] = useState(null);
	const [coupouns, setCoupouns] = useState(null);

	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getAllProductsShop(seller?._id));
		axios
			.get(`/coupounCode/get-all-coupoun-shop/${seller._id}`)
			.then((res) => {
				setCoupouns(res.data.coupouns);
				setIsLoading(false);
			})
			.catch((error) => {
				setIsLoading(false);
			});
	}, []);

	const handleDelete = (id) => {
		// dispatch(deleteProduct(id));
		// window.location.reload();
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const {data} = await axios.post('/coupounCode/create-coupoun-code', {
				name,
				value,
				minAmount,
				maxAmount,
				selectedProduct,
				shopId: seller._id,
			});

			toast.success('Created Success');
			window.location.reload();
		} catch (error) {
			toast.error(error.response.data.message);
		}
	};

	const columns = [
		{field: 'id', headerName: 'Coupoun Code Id', minWidth: 150, flex: 0.7},
		{
			field: 'name',
			headerName: 'Name',
			minWidth: 180,
			flex: 1.4,
		},
		{
			field: 'discount',
			headerName: 'Discount percent',
			minWidth: 100,
			flex: 0.6,
		},

		{
			field: 'Delete',
			flex: 0.8,
			minWidth: 120,
			headerName: '',
			type: 'number',
			sortable: false,
			renderCell: (params) => {
				return (
					<>
						<Button onClick={() => handleDelete(params.id)}>
							<AiOutlineDelete size={20} />
						</Button>
					</>
				);
			},
		},
	];

	const row = [];

	coupouns &&
		coupouns.forEach((item) => {
			row.push({
				id: item._id,
				name: item.name,
				discount: `${item.value} %`,
			});
		});

	return (
		<>
			{isLoading ? (
				<Loader />
			) : (
				<div className="w-full mx-8 pt-1 mt-10 bg-white">
					<div className="flex justify-end">
						<div
							className={`${styles.button} !w-[180px]  `}
							onClick={() => setOpen(true)}
						>
							<span className=" text-white">Create coupoun code</span>
						</div>
					</div>
					<DataGrid
						rows={row}
						columns={columns}
						pageSize={10}
						disableSelectionOnClick
						autoHeight
					/>
					{/* modal create coupon */}
					{open && (
						<div className="fixed top-0 left-0 w-full h-screen bg-[#00000033] z-20 flex items-center justify-center">
							<div className="w-[90%] h-[80vh] bg-white shadow-md p-4 800px:w-[40%] rounded-md overflow-y-scroll">
								<div className="flex justify-end">
									<RxCross1
										size={30}
										className="cursor-pointer"
										onClick={() => setOpen(false)}
									/>
								</div>
								<h5 className="text-[30px] font-Poppins text-center">
									Create Coupon code
								</h5>
								<form onSubmit={handleSubmit}>
									<br />
									<div>
										<label className="pb-2">
											Name <span className="text-red-500">*</span>
										</label>
									</div>
									<input
										onChange={(e) => {
											setName(e.target.value);
										}}
										type="text"
										placeholder="Enter your coupon code name"
										className="w-full h-[35px] px-3 border border-gray-300  rounded-[3px]  text-[14px] focus:outline-none focus:ring-blue-600 focus:border-blue-600 "
									/>
									<br />
									<div>
										<label className="pb-2">
											Discount Percentenge <span className="text-red-500">*</span>
										</label>
										<input
											type="text"
											name="value"
											value={value}
											required
											className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
											onChange={(e) => setValue(e.target.value)}
											placeholder="Enter your coupon code value..."
										/>
									</div>
									<br />
									<div>
										<label className="pb-2">Min Amount</label>
										<input
											type="number"
											name="value"
											value={minAmount}
											className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
											onChange={(e) => setMinAmout(e.target.value)}
											placeholder="Enter your coupon code min amount..."
										/>
									</div>
									<br />
									<div>
										<label className="pb-2">Max Amount</label>
										<input
											type="number"
											name="value"
											value={maxAmount}
											className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
											onChange={(e) => setMaxAmount(e.target.value)}
											placeholder="Enter your coupon code max amount..."
										/>
									</div>
									<br />
									<div>
										<label className="pb-2">Selected Product</label>
										<select
											className="w-full mt-2 border h-[35px] rounded-[5px]"
											value={selectedProduct}
											onChange={(e) => setSelectedProduct(e.target.value)}
										>
											<option
												value="Choose your selected products"
												disabled
												selected
											>
												Choose a selected product
											</option>
											{products &&
												products.map((i) => (
													<option
														value={i._id}
														key={i.name}
													>
														{i.name}
													</option>
												))}
										</select>
									</div>
									<br />
									<div>
										<input
											type="submit"
											value="Create"
											className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm cursor-pointer hover:opacity-70"
										/>
									</div>
								</form>
							</div>
						</div>
					)}
				</div>
			)}
		</>
	);
};

export default AllCoupons;
