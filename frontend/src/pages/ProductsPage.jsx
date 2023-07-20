import React, {useEffect, useState} from 'react';
import Header from '../components/Layout/Header';
// import {allProducts} from '../static/data';
import styles from '../styles/styles';
import ProductCard from '../components/Route/ProductCard/ProductCard';
import Footer from '../components/Layout/Footer';
import {useSearchParams} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {getAllProducts} from '../redux/actions/product';
import Loader from '../components/Layout/Loader';
import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Pagination from '@material-ui/lab/Pagination';
import axios from '../redux/actions/axiosConfig';
// import {response} from '../../../backend/app';
const useStyles = makeStyles((theme) => ({
	root: {
		'& > * + *': {
			marginTop: theme.spacing(2),
		},
	},
}));

const ProductsPage = () => {
	const [pages, setPages] = useState(1);
	const classes = useStyles();
	const [page, setPage] = useState(1);
	const handleChange = (event, value) => {
		setPage(value);
	};

	const dispatch = useDispatch();
	// console.log(1);
	let [searchParams] = useSearchParams();
	const category = searchParams.get('category');
	const [dataProducts, setDataProducts] = useState(null);

	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		setIsLoading(true);
		axios
			.get(`/product/get-all-products-page`, {
				params: {category, page},
			})
			.then((response) => {
				setDataProducts(response.data.products);
				setPages(response.data.totalPages);
				setIsLoading(false);
			});
	}, [category, page]);

	// console.log('productPage');
	return (
		<>
			<Header activeHeading={3} />
			{isLoading ? (
				<Loader />
			) : (
				<div>
					<br />
					<br />
					<div className={`${styles.section}`}>
						<div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12">
							{dataProducts && dataProducts.map((i) => <ProductCard data={i} />)}
						</div>

						{dataProducts && dataProducts.length === 0 ? (
							<h1 className="text-center w-full pb-[100px] text-[20px]">
								No products Found!
							</h1>
						) : null}
					</div>
				</div>
			)}
			{dataProducts && dataProducts.length > 0 && (
				<div>
					{/* <div className=" flex  justify-center px-2">
									<Typography>Page: {page}</Typography>
								</div> */}
					<div className=" flex  justify-center px-2 py-3">
						<Pagination
							count={pages}
							page={page}
							onChange={handleChange}
							size="large"
							color="primary"
							variant="outlined"
						/>
					</div>
				</div>
			)}
			<Footer />
		</>
	);
};

export default ProductsPage;
