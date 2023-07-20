import React from 'react';
import {useNavigate} from 'react-router-dom';
import styles from '../../styles/styles';

const DropDown = ({categoriesData, setDropdown}) => {
	const navigate = useNavigate();
	const submitHandle = (i) => {
		navigate(`/products?category=${i.title}`);
		// window.location.reload();
	};

	return (
		<div className="z-[1000] absolute top-[60px] left-0  pb-4 w-full bg-white rounded-b-md shadow-sm">
			{categoriesData &&
				categoriesData.length > 0 &&
				categoriesData.map((i, index) => {
					return (
						<div
							key={index}
							className={styles.noramlFlex}
							onClick={(e) => {
								submitHandle(i);
							}}
						>
							<img
								alt=""
								src={i.image_Url}
								className="w-6 h-6 ml-2 my-5  object-contain select-none "
							></img>
							<h3 className="m-3 select-none">{i.title}</h3>
						</div>
					);
				})}
		</div>
	);
};

export default DropDown;
