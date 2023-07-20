import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useParams} from 'react-router-dom';
import {productData} from '../static/data';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import ProductDetails from '../components/Products/ProductDetails.jsx';
import SuggestedProduct from '../components/Products/SuggestedProduct.jsx';
import axios from '../redux/actions/axiosConfig';
import {getAllProductsShop} from '../redux/actions/product';
import Loader from '../components/Layout/Loader';
const ProductDetailsPage = () => {
	const [isLoading, setIsLoading] = useState(true);
	// console.log(1);
	const dispatch = useDispatch();
	const {id} = useParams();
	const [data, setData] = useState(null);
	useEffect(() => {
		axios
			.get(`/product/get-product/${id}`)
			.then((response) => {
				setData(response.data.product);
				setIsLoading(false);
			})
			.catch((err) => {
				console.log(err);
				setIsLoading(false);
			});
	}, [id]);
	useEffect(() => {
		dispatch(getAllProductsShop(data && data?.shop._id));
	}, [data]);
	useEffect(() => {
		window.scrollTo({
			top: 0,
			left: 0,
			behavior: 'smooth',
		});
	});
	return (
		<div>
			{isLoading ? (
				<Loader />
			) : (
				<div>
					<Header />
					{/* {isLoading && <Loader />} */}
					{data && <ProductDetails data={data} />}
					{data && <SuggestedProduct data={data} />}
					<Footer />
				</div>
			)}
		</div>
	);
};

export default ProductDetailsPage;
