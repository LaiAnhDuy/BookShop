import React, {useEffect, useRef, useState} from 'react';
import {categoriesData} from '../../static/data';
import {AiOutlineCloseCircle, AiOutlinePlusCircle} from 'react-icons/ai';
import {useSelector, useDispatch} from 'react-redux';
import {createProduct} from '../../redux/actions/product';
import {toast} from 'react-toastify';
import {useNavigate} from 'react-router-dom';
import * as XLSX from 'xlsx';
import {Button} from '@material-ui/core';
import axios from '../../redux/actions/axiosConfig';

const CreateProduct = () => {
	const [active, setActive] = useState(1);
	return (
		<div className="w-full flex justify-center">
			{active == 1 ? (
				<CreateSingleProduct setActive={setActive} />
			) : (
				<CreateMultipleProducts setActive={setActive}></CreateMultipleProducts>
			)}
		</div>
	);
};
const CreateMultipleProducts = ({setActive}) => {
	const navigate = useNavigate();
	const [productsList, setProductsList] = useState(null);
	const readUploadFile = (e) => {
		var files = e.target.files,
			f = files[0];
		var reader = new FileReader();
		reader.onload = function (e) {
			var data = e.target.result;
			let readedData = XLSX.read(data, {type: 'binary'});
			const wsname = readedData.SheetNames[0];
			const ws = readedData.Sheets[wsname];

			/* Convert array to json*/
			const dataParse = XLSX.utils.sheet_to_json(ws, {header: 1});
			console.log(dataParse);
			// setFileUploaded(dataParse);

			setProductsList(dataParse);
		};
		reader.readAsBinaryString(f);
	};
	const handleCreateMultipleProducts = async (e) => {
		try {
			await axios.post('product/create-multiple-products', {
				products: productsList,
			});
			toast.success('Products created successfully');
			navigate('/dashboard-products');
		} catch (error) {
			toast.error(error);
		}
	};
	return (
		<div className="w-[90%] x bg-white shadow h-[80vh] overflow-y-scroll rounded-md p-3">
			<div className="w-full flex justify-between">
				<div
					className="text-center text-[18px] font-[500] w-[50%] text-gray-400 opacity-75
				"
				>
					<span
						className="cursor-pointer"
						onClick={() => setActive(1)}
					>
						Tạo một sản phẩm
					</span>
				</div>
				<div className="text-center text-[18px] font-[500] w-[50%]   text-red-500   ">
					<span className="cursor-pointer"> Tạo nhiều sản phẩm</span>
				</div>
			</div>
			<div className="w-full h-full flex items-center justify-center">
				<input
					type="file"
					name="upload"
					id="upload"
					onChange={readUploadFile}
					accept=".xlsx"
				/>
				<Button
					variant="contained"
					color="primary"
					onClick={handleCreateMultipleProducts}
				>
					Create
				</Button>
			</div>
		</div>
	);
};

const CreateSingleProduct = ({setActive}) => {
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [category, setCategory] = useState('');
	// const [tags, setTags] = useState('');
	const [originalPrice, setOriginalPrice] = useState();
	const [discountPrice, setDiscountPrice] = useState();
	const [stock, setStock] = useState();
	const [images, setImages] = useState([]);
	const dispatch = useDispatch();
	const {error, success, product} = useSelector((state) => state.product);
	const {seller} = useSelector((state) => state.seller);
	const navigate = useNavigate();
	const handleChangeUpload = (e) => {
		const arrayFiles = Array.from(e.target.files);
		setImages((images) => [...images, ...arrayFiles]);
	};

	const handleCloseImage = (index) => {
		let copyImages = [...images];
		copyImages.splice(index, 1);
		setImages(copyImages);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const formData = new FormData();
		images.map((image) => formData.append('images', image));
		formData.append('name', name);
		formData.append('description', description);
		formData.append('category', category);
		formData.append('originalPrice', originalPrice);
		formData.append('discountPrice', discountPrice);
		formData.append('stock', stock);
		formData.append('shopId', seller._id);
		dispatch(createProduct(formData));
	};
	const isInitialMount = useRef(true);

	useEffect(() => {
		if (isInitialMount.current) {
			// Skip the code on component mount
			isInitialMount.current = false;
		} else {
			// Code to run when error or success changes
			if (error) {
				toast.error(error);
			}
			if (success) {
				toast.success('Created Successfully');
				navigate('/dashboard-products');
			}
		}
	}, [dispatch, error, success, product, navigate]);
	return (
		<div className="w-[90%]  bg-white shadow h-[80vh] overflow-y-scroll rounded-md p-3">
			<div className="w-full flex justify-between">
				<div
					className="text-center text-[18px] font-[500] w-[50%]  text-red-500
				"
				>
					<span className="cursor-pointer">Tạo một sản phẩm</span>
				</div>
				<div className="text-center text-[18px] font-[500] w-[50%] text-gray-400 opacity-75  ">
					<span
						className="cursor-pointer"
						onClick={() => setActive(2)}
					>
						{' '}
						Tạo nhiều sản phẩm
					</span>
				</div>
			</div>

			<form onSubmit={handleSubmit}>
				<div className="w-full py-2">
					<label htmlFor="name">Tên *</label>
					<input
						type="text"
						id="name"
						value={name}
						className="block border w-full py-1 px-2 mt-1 rounded-md  focus:ring-blue-500 focus:border-blue-500 "
						placeholder="Nhập tên sản phẩm của bạn..."
						onChange={(e) => setName(e.target.value)}
						required
					/>
				</div>
				<div className="w-full py-2">
					<label htmlFor="description">Mô tả sản phẩm *</label>
					<textarea
						required
						rows="7"
						type="text"
						name="description"
						value={description}
						className="mt-2 appearance-none block w-full pt-2 px-3 border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
						onChange={(e) => setDescription(e.target.value)}
						placeholder="Nhập mô tả sản phẩm..."
					></textarea>
				</div>
				<div className="w-full py-2">
					<label htmlFor="category">Thể loại *</label>
					<select
						className="w-full  border h-[35px] mt-1 rounded-[5px]"
						name=""
						value={category}
						id="category"
						onChange={(e) => setCategory(e.target.value)}
						required
					>
						<option
							value=""
							selected
							disabled
						>
							Chọn thể loại
						</option>
						{categoriesData &&
							categoriesData.map((item) => (
								<option
									value={item.title}
									key={item.title}
								>
									{item.title}
								</option>
							))}
					</select>
				</div>
				<div className="w-full py-2">
					<label htmlFor="originalPrice">Giá gốc</label>
					<input
						type="number"
						id="originalPrice"
						value={originalPrice}
						className="block border  w-full py-1 px-2 mt-1 rounded-md  focus:ring-blue-500 focus:border-blue-500 "
						placeholder="Nhập giá gốc cho sản phẩm của bạn..."
						onChange={(e) => setOriginalPrice(e.target.value)}
					/>
				</div>
				<div className="w-full py-2">
					<label htmlFor="discountPrice"> Giá (có chiết khấu)</label>
					<input
						type="number"
						id="discountPrice"
						value={discountPrice}
						className="block border  w-full py-1 px-2 mt-1 rounded-md  focus:ring-blue-500 focus:border-blue-500 "
						placeholder="Nhập giá cho sản phẩm của bạn..."
						onChange={(e) => setDiscountPrice(e.target.value)}
						required
					/>
				</div>
				<div className="w-full py-2">
					<label htmlFor="stock"> Số lượng</label>
					<input
						type="number"
						id="stock"
						value={stock}
						className="block border  w-full py-1 px-2 mt-1 rounded-md  focus:ring-blue-500 focus:border-blue-500 "
						placeholder="Nhập số lượng ..."
						onChange={(e) => setStock(e.target.value)}
						required
					/>
				</div>

				<div className="w-full py-2">
					<label htmlFor="upload"> Tải lên hình ảnh sản phẩm</label>
					<input
						type="file"
						id="upload"
						multiple
						accept="image/png, image/jpeg"
						hidden
						onChange={handleChangeUpload}
						required
					/>
					<div className="flex flex-wrap gap-2">
						<label htmlFor="upload">
							<AiOutlinePlusCircle
								size={30}
								className="mt-3 text-blue-400"
							/>
						</label>
						{images &&
							images.map((image, index) => (
								<div className="relative">
									<img
										src={URL.createObjectURL(image)}
										alt=""
										className="object-cover w-[100px] h-[100px] "
									/>
									<AiOutlineCloseCircle
										className="w-5 h-5 absolute top-0 right-0 text-red-500 cursor-pointer"
										onClick={() => handleCloseImage(index)}
									/>
								</div>
							))}
					</div>
				</div>
				<input
					type="submit"
					value="Create"
					className="mt-2 cursor-pointer appearance-none text-center block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
				/>
			</form>
		</div>
	);
};

export default CreateProduct;
