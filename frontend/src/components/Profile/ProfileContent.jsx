import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {backend_url} from '../../server';
import {MdTrackChanges} from 'react-icons/md';
import {
	AiOutlineArrowRight,
	AiOutlineCamera,
	AiOutlineDelete,
} from 'react-icons/ai';
import styles from '../../styles/styles';
import {
	deleteUserAddress,
	loadUser,
	updateUserAddress,
	updateUserInformation,
	updateUserPassword,
} from '../../redux/actions/user';
import {GrUpdate} from 'react-icons/gr';

import axios from '../../redux/actions/axiosConfig';
// import {response} from '../../../../backend/app';
import {toast} from 'react-toastify';
import {RxCross1} from 'react-icons/rx';
import {Country, State} from 'country-state-city';
import {DataGrid} from '@material-ui/data-grid';
import {Link} from 'react-router-dom';
import {Button} from '@material-ui/core';
import {getAllOrderUser} from '../../redux/actions/order';

const ProfileContent = ({active}) => {
	// console.log(Country.getAllCountries());
	console.log('profile', active);
	const dispatch = useDispatch();

	const {isAuthenticated, user, error, successMessage} = useSelector(
		(state) => state.user
	);
	const [name, setName] = useState(user?.name);
	const [email, setEmail] = useState(user?.email);
	const [password, setPassword] = useState('');
	const [avatar, setAvatar] = useState(null);

	const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber);
	const handleImage = async (e) => {
		setAvatar(e.target.files[0]);
		const form = new FormData();
		form.append('image', e.target.files[0]);
		await axios
			.put('/user/update-avatar', form, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			})
			.then((response) => toast.success('Updated avatar successfully'))
			.catch((error) => toast.error(error.response.data.message));
		dispatch(loadUser());
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		dispatch(updateUserInformation(name, email, phoneNumber, password));
	};
	useEffect(() => {
		if (successMessage) {
			toast.success(successMessage);
			dispatch({type: 'clearMessages'});
			dispatch({type: 'clearErrors'});
		}
		if (error) {
			toast.error(error);
			dispatch({type: 'clearErrors'});
			dispatch({type: 'clearMessages'});
		}
	}, [successMessage, error]);
	return (
		<div className="w-full">
			{active === 1 && (
				<div>
					<div className=" flex w-full justify-center ">
						<div className="relative">
							<img
								alt=""
								className="w-[150px] h-[150px] rounded-full object-cover border-[2px] border-red-500"
								src={avatar ? URL.createObjectURL(avatar) : backend_url + user?.avatar}
							></img>
							<div className="w-[30px] h-[30px] bg-[#E3E9EE] rounded-full flex items-center justify-center cursor-pointer absolute bottom-[5px] right-[5px]">
								<input
									type="file"
									id="image"
									className="hidden"
									accept="image/*"
									onChange={handleImage}
								/>
								<label htmlFor="image">
									<AiOutlineCamera />
								</label>
							</div>
						</div>
					</div>
					<br />
					<br />
					<div className=" w-full px-5">
						<form
							onSubmit={handleSubmit}
							aria-required={true}
						>
							<div className="w-full 800px:flex block pb-3">
								<div className=" w-[100%] 800px:w-[50%]">
									<label className="block pb-2">Full Name</label>
									<input
										type="text"
										className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
										required
										value={name}
										onChange={(e) => setName(e.target.value)}
									/>
								</div>
								<div className=" w-[100%] 800px:w-[50%]">
									<label className="block pb-2">Email Address</label>
									<input
										type="email"
										className={`${styles.input} !w-[95%] mb-1 800px:mb-0`}
										required
										value={email}
										onChange={(e) => setEmail(e.target.value)}
									/>
								</div>
							</div>

							<div className="w-full 800px:flex block pb-3">
								<div className=" w-[100%] 800px:w-[50%]">
									<label className="block pb-2">Phone Number</label>
									<input
										type="number"
										className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
										required
										value={phoneNumber}
										onChange={(e) => setPhoneNumber(e.target.value)}
									/>
								</div>

								<div className=" w-[100%] 800px:w-[50%]">
									<label className="block pb-2">Enter your password</label>
									<input
										type="password"
										className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
										required
										value={password}
										onChange={(e) => setPassword(e.target.value)}
									/>
								</div>
							</div>
							<input
								className={`w-[250px] h-[40px] border border-[#3a24db] text-center text-[#3a24db] rounded-[3px] mt-8 cursor-pointer`}
								required
								value="Update"
								type="submit"
							/>
						</form>
					</div>
				</div>
			)}
			{active === 2 && (
				<div>
					<AllOrders />
				</div>
			)}
			{active === 3 && (
				<div>
					<AllRefunds />
				</div>
			)}
			{active === 5 && (
				<div>
					<TrackOrder />
				</div>
			)}
			{active === 6 && (
				<div>
					<ChangePassword />
				</div>
			)}
			{active === 7 && (
				<div>
					<Address />
				</div>
			)}
		</div>
	);
};
const AllOrders = () => {
	const dispatch = useDispatch();
	const columns = [
		{field: 'id', headerName: 'Order Id', minWidth: 130, flex: 0.7},
		{
			field: 'status',
			headerName: 'Status',
			minWidth: 130,
			flex: 0.7,
		},
		{
			field: 'status',
			headerName: 'Status',
			minWidth: 130,
			flex: 0.7,
			cellClassName: (params) => {
				return params.getValue(params.id, 'status') === 'Delivered'
					? 'greenColor'
					: 'redColor';
			},
		},
		{
			field: 'itemsQty',
			headerName: 'Items Qty',
			type: 'number',
			minWidth: 130,
			flex: 0.7,
		},
		{
			field: 'total',
			headerName: 'Total',
			type: 'number',
			minWidth: 130,
			flex: 0.8,
		},
		{
			field: ' ',
			flex: 1,
			minWidth: 150,
			headerName: '',
			type: 'number',
			sortable: false,
			renderCell: (params) => {
				return (
					<>
						<Link to={`/user/order/${params.id}`}>
							<Button>
								<AiOutlineArrowRight size={20} />
							</Button>
						</Link>
					</>
				);
			},
		},
	];
	const {user} = useSelector((state) => state.user);
	const {orders} = useSelector((state) => state.order);
	const rows = [];
	orders &&
		orders.forEach((order) =>
			rows.push({
				id: order._id,

				status: order.status,
				total: order.totalPrice,
				itemsQty: order.cart.length,
			})
		);
	useEffect(() => {
		dispatch(getAllOrderUser(user._id));
	}, []);
	return (
		<div>
			<div style={{height: 400, width: '100%'}}>
				<DataGrid
					rows={rows}
					columns={columns}
					pageSize={10}
					checkboxSelection
					disableSelectionOnClick
					autoHeight
				/>
			</div>
		</div>
	);
};
const AllRefunds = () => {
	const dispatch = useDispatch();
	const columns = [
		{field: 'id', headerName: 'Order Id', minWidth: 130, flex: 0.7},
		{
			field: 'status',
			headerName: 'Status',
			minWidth: 130,
			flex: 0.7,
		},
		{
			field: 'status',
			headerName: 'Status',
			minWidth: 130,
			flex: 0.7,
			cellClassName: (params) => {
				return params.getValue(params.id, 'status') === 'Delivered'
					? 'greenColor'
					: 'redColor';
			},
		},
		{
			field: 'itemsQty',
			headerName: 'Items Qty',
			type: 'number',
			minWidth: 130,
			flex: 0.7,
		},
		{
			field: 'total',
			headerName: 'Total',
			type: 'number',
			minWidth: 130,
			flex: 0.8,
		},
		{
			field: ' ',
			flex: 1,
			minWidth: 150,
			headerName: '',
			type: 'number',
			sortable: false,
			renderCell: (params) => {
				return (
					<>
						<Link to={`/user/order/${params.id}`}>
							<Button>
								<AiOutlineArrowRight size={20} />
							</Button>
						</Link>
					</>
				);
			},
		},
	];
	const {user} = useSelector((state) => state.user);
	const {orders} = useSelector((state) => state.order);
	const rows = [];
	const refundData = orders?.filter(
		(order) => order.status == 'Processing refund'
	);
	refundData &&
		refundData.forEach((order) =>
			rows.push({
				id: order._id,

				status: order.status,
				total: order.totalPrice,
				itemsQty: order.cart.length,
			})
		);
	useEffect(() => {
		dispatch(getAllOrderUser(user._id));
	}, []);

	return (
		<div>
			<div style={{height: 400, width: '100%'}}>
				<DataGrid
					rows={rows}
					columns={columns}
					pageSize={10}
					checkboxSelection
					disableSelectionOnClick
					autoHeight
				/>
			</div>
		</div>
	);
};
const TrackOrder = () => {
	const {user} = useSelector((state) => state.user);
	const {orders} = useSelector((state) => state.order);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getAllOrderUser(user._id));
	}, []);

	const columns = [
		{field: 'id', headerName: 'Order ID', minWidth: 150, flex: 0.7},

		{
			field: 'status',
			headerName: 'Status',
			minWidth: 130,
			flex: 0.7,
			cellClassName: (params) => {
				return params.getValue(params.id, 'status') === 'Delivered'
					? 'greenColor'
					: 'redColor';
			},
		},
		{
			field: 'itemsQty',
			headerName: 'Items Qty',
			type: 'number',
			minWidth: 130,
			flex: 0.7,
		},

		{
			field: 'total',
			headerName: 'Total',
			type: 'number',
			minWidth: 130,
			flex: 0.8,
		},

		{
			field: ' ',
			flex: 1,
			minWidth: 150,
			headerName: '',
			type: 'number',
			sortable: false,
			renderCell: (params) => {
				return (
					<>
						<Link to={`/user/track/order/${params.id}`}>
							<Button>
								<MdTrackChanges size={20} />
							</Button>
						</Link>
					</>
				);
			},
		},
	];

	const row = [];

	orders &&
		orders.forEach((item) => {
			row.push({
				id: item._id,
				itemsQty: item.cart.length,
				total: 'US$ ' + item.totalPrice,
				status: item.status,
			});
		});

	return (
		<div className="pl-8 pt-1">
			<DataGrid
				rows={row}
				columns={columns}
				pageSize={10}
				disableSelectionOnClick
				autoHeight
			/>
		</div>
	);
};
const ChangePassword = () => {
	const dispatch = useDispatch();
	const [oldPassword, setOldPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	const passwordChangeHandler = (e) => {
		e.preventDefault();
		dispatch(updateUserPassword({oldPassword, newPassword, confirmPassword}));
	};

	return (
		<div className="w-full flex justify-center">
			<div className="w-[80%] md:w-[50%]">
				<div className="text-center  ">
					<h1 className="text-[20px] font-[600] p-5">Change password</h1>
				</div>
				<form
					aria-required
					onSubmit={passwordChangeHandler}
					className="flex flex-col items-center"
				>
					<div className=" w-[100%]  ">
						<label className="block pb-1">Enter your old password</label>
						<input
							type="password"
							className={`${styles.input} !w-[95%] mb-5 800px:mb-0`}
							required
							value={oldPassword}
							onChange={(e) => setOldPassword(e.target.value)}
						/>
					</div>
					<div className=" w-[100%]  mt-2">
						<label className="block pb-1">Enter your new password</label>
						<input
							type="password"
							className={`${styles.input} !w-[95%] mb-5 800px:mb-0`}
							required
							value={newPassword}
							onChange={(e) => setNewPassword(e.target.value)}
						/>
					</div>
					<div className=" w-[100%] mt-2">
						<label className="block pb-1">Enter your confirm password</label>
						<input
							type="password"
							className={`${styles.input} !w-[95%] mb-5 800px:mb-0`}
							required
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
						/>
						<input
							className={`w-[95%] h-[40px] border border-[#3a24db] text-center text-[#3a24db] rounded-[3px] mt-8 cursor-pointer`}
							required
							value="Update"
							type="submit"
						/>
					</div>
				</form>
			</div>
		</div>
	);
};
const Address = () => {
	const dispatch = useDispatch();
	const [open, setOpen] = useState(false);
	const [country, setCountry] = useState('');
	const [city, setCity] = useState('');
	const [zipCode, setZipCode] = useState();
	const [address1, setAddress1] = useState('');
	const [address2, setAddress2] = useState('');
	const [addressType, setAddressType] = useState('');
	const {user} = useSelector((state) => state.user);
	// const dispatch = useDispatch();

	const addressTypeData = [
		{
			name: 'Default',
		},
		{
			name: 'Home',
		},
		{
			name: 'Office',
		},
	];

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (addressType === '' || country === '' || city === '') {
			toast.error('Please fill all the fields!');
		} else {
			dispatch(
				updateUserAddress({country, city, address1, address2, zipCode, addressType})
			);
			setOpen(false);
			setCountry('');
			setCity('');
			setAddress1('');
			setAddress2('');
			setZipCode(null);
			setAddressType('');
		}
	};

	const handleDelete = (item) => {
		const id = item._id;
		dispatch(deleteUserAddress(id));
	};
	// useEffect(()=>{},[])

	return (
		<div className="w-full px-5">
			{open && (
				<div className="fixed top-0 right-0 left-0 bottom-0 bg-[#00000025] flex items-center justify-center">
					<div className="h-[80%] bg-white w-[90%] 800px:w-[40%] rounded-lg overflow-y-scroll">
						<div className="flex  justify-end m-2">
							<RxCross1
								size={30}
								className="cursor-pointer"
								onClick={() => setOpen(false)}
							/>
						</div>
						<div className="text-center ">
							<h1 className="text-[18px] font-[500]">Add New Address</h1>
						</div>
						<form
							action=""
							className="m-5"
							onSubmit={handleSubmit}
						>
							<div className="w-full pb-2">
								<label className="block pb-1">Country</label>
								<select
									name=""
									id=""
									value={country}
									onChange={(e) => setCountry(e.target.value)}
									className="w-full border focus:border-blue-500 py-1 rounded-[5px]"
								>
									<option
										value=""
										className="block border pb-2"
										selected
										disabled
									>
										choose your country
									</option>
									{Country &&
										Country.getAllCountries().map((country) => (
											<option value={country.isoCode}>{country.name}</option>
										))}
								</select>
							</div>
							<div className="w-full pb-2">
								<label className="block pb-1">City</label>
								<select
									name=""
									id=""
									value={city}
									onChange={(e) => setCity(e.target.value)}
									className="w-full border py-1 rounded-[5px] focus:border-blue-500"
								>
									<option
										value=""
										className="block border pb-2"
										selected
										disabled
									>
										choose your city
									</option>
									{State &&
										country &&
										State.getStatesOfCountry(country).map((state) => (
											<option value={state.isoCode}>{state.name}</option>
										))}
								</select>
							</div>
							<div className="w-full pb-2">
								<label className="block pb-1">Address 1</label>
								<input
									type="address"
									className={`${styles.input} focus:border-blue-500`}
									required
									value={address1}
									onChange={(e) => setAddress1(e.target.value)}
								/>
							</div>
							<div className="w-full pb-2">
								<label className="block pb-1">Address 2</label>
								<input
									type="address"
									className={`${styles.input} focus:border-blue-500`}
									required
									value={address2}
									onChange={(e) => setAddress2(e.target.value)}
								/>
							</div>
							<div className="w-full pb-2">
								<label className="block pb-1">Zip Code</label>
								<input
									type="number"
									className={`${styles.input} focus:border-blue-500`}
									required
									value={zipCode}
									onChange={(e) => setZipCode(e.target.value)}
								/>
							</div>
							<div className="w-full pb-2">
								<label className="block pb-1">Address Type</label>
								<select
									required
									name=""
									id=""
									value={addressType}
									onChange={(e) => setAddressType(e.target.value)}
									className="w-full border py-1 rounded-[5px] focus:border-blue-500"
								>
									<option
										value=""
										className="block border pb-1"
										selected
										disabled
									>
										choose your address type
									</option>
									{addressTypeData &&
										addressTypeData.map((type) => (
											<option value={type.name}>{type.name}</option>
										))}
								</select>
							</div>
							<div className=" w-full pb-2">
								<input
									type="submit"
									className={`${styles.input} mt-5 cursor-pointer focus:border-r-indigo-500`}
									required
									readOnly
								/>
							</div>
						</form>
					</div>
				</div>
			)}
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-[20px] font-[500]">My Address</h1>
				</div>
				<div
					onClick={() => setOpen(true)}
					className={`${styles.button} text-white`}
				>
					Add new
				</div>
			</div>
			<br />
			{user &&
				user.addresses.map((item, index) => (
					<div
						className="w-full bg-white h-min 800px:h-[70px] rounded-[4px] flex items-center px-3 shadow justify-between pr-10 mb-5"
						key={index}
					>
						<div className="flex items-center">
							<h5 className="pl-5 font-[600]">{item.addressType}</h5>
						</div>
						<div className="pl-8 flex items-center">
							<h6 className="text-[12px] 800px:text-[unset]">
								{item.address1} {item.address2}
							</h6>
						</div>
						<div className="pl-8 flex items-center">
							<h6 className="text-[12px] 800px:text-[unset]">
								{user && user.phoneNumber}
							</h6>
						</div>
						<div className="min-w-[10%] flex items-center justify-between pl-8">
							<AiOutlineDelete
								size={25}
								className="cursor-pointer"
								onClick={() => handleDelete(item)}
							/>
						</div>
					</div>
				))}

			{user && user.addresses.length === 0 && (
				<h5 className="text-center pt-8 text-[18px]">
					You not have any saved address!
				</h5>
			)}
		</div>
	);
};

export default ProfileContent;
