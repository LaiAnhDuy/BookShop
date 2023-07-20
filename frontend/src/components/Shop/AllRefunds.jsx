import {Button} from '@material-ui/core';
import {DataGrid} from '@material-ui/data-grid';
import React, {useEffect} from 'react';
import {
	AiOutlineArrowRight,
	AiOutlineDelete,
	AiOutlineEye,
} from 'react-icons/ai';
import {useDispatch, useSelector} from 'react-redux';
import {Link} from 'react-router-dom';
import {getAllProductsShop} from '../../redux/actions/product';
import {deleteProduct} from '../../redux/actions/product';
import Loader from '../Layout/Loader';
import {getAllOrderShop} from '../../redux/actions/order';

const AllRefunds = () => {
	const {seller} = useSelector((state) => state.seller);

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
						<Link to={`/shop/order/${params.id}`}>
							<Button>
								<AiOutlineArrowRight size={20} />
							</Button>
						</Link>
					</>
				);
			},
		},
	];
	const {orders, isLoading} = useSelector((state) => state.order);
	const ordersData = orders?.filter(
		(order) =>
			order.status == 'Processing refund' || order.status === 'Refund Success'
	);
	const rows = [];
	ordersData &&
		ordersData.forEach((order) =>
			rows.push({
				id: order._id,

				status: order.status,
				total: order.totalPrice,
				itemsQty: order.cart.length,
			})
		);
	useEffect(() => {
		dispatch(getAllOrderShop(seller._id));
	}, []);
	return (
		<>
			{isLoading ? (
				<Loader />
			) : (
				<div className="w-full mx-8 pt-1 mt-10 bg-white">
					<DataGrid
						rows={rows}
						columns={columns}
						pageSize={10}
						disableSelectionOnClick
						autoHeight
					/>
				</div>
			)}
		</>
	);
};

export default AllRefunds;
