import React from 'react';
import styles from '../../../styles/styles';
import {brandingData, categoriesData} from '../../../static/data';
import {useNavigate} from 'react-router-dom';

const Categories = () => {
	const navigate = useNavigate();
	return (
		<>
			<div className={`${styles.section}`}>
				<div className="my-12 bg-white p-5 rounded-md shadow-md grid grid-cols-1 800px:grid-cols-2 1000px:grid-cols-4 gap-2 ">
					{brandingData &&
						brandingData.map((i, index) => {
							return (
								<div
									className="flex items-start flex-col justify-start "
									key={index}
								>
									{/* {i.icon} */}

									<h3 className="font-bold text-sm md:text-base">{i.title}</h3>
									<p className="text-xs md:text-sm">{i.Description}</p>
								</div>
							);
						})}
				</div>
			</div>
			<div
				className={`${styles.section} p-[25px] bg-white grid grid-cols-1 gap-[5px]    md:grid-cols-2 md:gap-[10px] lg:grid-cols-4 lg:gap-[20px] xl:grid-cols-5 xl:gap-[25px] `}
			>
				{categoriesData &&
					categoriesData.map((i, index) => {
						const handleSubmit = (i) => {
							navigate(`/products?category=${i.title}`);
						};
						return (
							<div
								onClick={() => handleSubmit(i)}
								key={index}
								className="p-3 border-gray-300 border-[1px] h-[100px] flex items-center justify-between cursor-pointer overflow-hidden "
							>
								<h3 className="text-lg leading-[1.2]">{i.title}</h3>
								<img
									src={i.image_Url}
									className="w-[120px] h-[90px] object-cover"
									alt=""
								></img>
							</div>
						);
					})}
			</div>
		</>
	);
};

export default Categories;
