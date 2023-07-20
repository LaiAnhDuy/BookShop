import React from 'react';
import {useNavigate} from 'react-router-dom';
import {RxPerson} from 'react-icons/rx';
import {HiOutlineReceiptRefund, HiOutlineShoppingBag} from 'react-icons/hi';
import {AiOutlineLogin, AiOutlineMessage} from 'react-icons/ai';
import {TbAddressBook} from 'react-icons/tb';
import {RiLockPasswordLine} from 'react-icons/ri';
import {MdOutlineTrackChanges} from 'react-icons/md';
import axios from 'axios';
import {server} from '../../server';
import {toast} from 'react-toastify';
import {useDispatch} from 'react-redux';
// import {logout} from '../../redux/actions/user';
// import {useNavigate} from 'react-router-dom';
const ProfileSideBar = ({active, setActive}) => {
	// const dispatch = useDispatch();
	console.log('profileSideBar', active);
	const navigate = useNavigate();
	const logoutHandler = () => {
		axios
			.get(`${server}/user/logout`, {withCredentials: true})
			.then((res) => {
				toast.success(res.data.message);
				window.location.reload(true);

				navigate('/login');
			})
			.catch((e) => {
				console.log(e.response.data.message);
			});
	};

	return (
		<div className="bg-white shadow-sm rounded-md p-4 pt-8">
			<div
				className="flex items-center cursor-pointer w-full mb-8"
				onClick={() => setActive(1)}
			>
				<RxPerson
					size={20}
					color={active === 1 ? 'red' : ''}
				/>
				<span
					className={`pl-3 hidden ${active === 1 ? 'text-[red]' : ''} 800px:block `}
				>
					Profile
				</span>
			</div>
			<div
				className="flex items-center cursor-pointer w-full mb-8"
				onClick={() => setActive(2)}
			>
				<HiOutlineShoppingBag
					size={20}
					color={active === 2 ? 'red' : ''}
				/>
				<span
					className={`pl-3 hidden ${active === 2 ? 'text-[red]' : ''} 800px:block `}
				>
					Orders
				</span>
			</div>
			<div
				className="flex items-center cursor-pointer w-full mb-8"
				onClick={() => setActive(3)}
			>
				<HiOutlineReceiptRefund
					size={20}
					color={active === 3 ? 'red' : ''}
				/>
				<span
					className={`pl-3 hidden ${active === 3 ? 'text-[red]' : ''} 800px:block `}
				>
					Refunds
				</span>
			</div>
			<div
				className="flex items-center cursor-pointer w-full mb-8"
				onClick={() => setActive(4) || navigate('/inbox')}
			>
				<AiOutlineMessage
					size={20}
					color={active === 4 ? 'red' : ''}
				/>
				<span
					className={`pl-3 hidden ${active === 4 ? 'text-[red]' : ''} 800px:block `}
				>
					Inbox
				</span>
			</div>
			<div
				className="flex items-center cursor-pointer w-full mb-8"
				onClick={() => setActive(5)}
			>
				<MdOutlineTrackChanges
					size={20}
					color={active === 5 ? 'red' : ''}
				/>
				<span
					className={`pl-3 ${active === 5 ? 'text-[red]' : ''} 800px:block hidden`}
				>
					Track Order
				</span>
			</div>

			<div
				className="flex items-center cursor-pointer w-full mb-8"
				onClick={() => setActive(6)}
			>
				<RiLockPasswordLine
					size={20}
					color={active === 6 ? 'red' : ''}
				/>
				<span
					className={`pl-3 ${active === 6 ? 'text-[red]' : ''} 800px:block hidden`}
				>
					Change Password
				</span>
			</div>

			<div
				className="flex items-center cursor-pointer w-full mb-8"
				onClick={() => setActive(7)}
			>
				<TbAddressBook
					size={20}
					color={active === 7 ? 'red' : ''}
				/>
				<span
					className={`pl-3 ${active === 7 ? 'text-[red]' : ''} 800px:block hidden`}
				>
					Address
				</span>
			</div>

			<div
				className="single_item flex items-center cursor-pointer w-full mb-8"
				onClick={logoutHandler}
			>
				<AiOutlineLogin
					size={20}
					color={active === 8 ? 'red' : ''}
				/>
				<span
					className={`pl-3 ${active === 8 ? 'text-[red]' : ''} 800px:block hidden`}
				>
					Log out
				</span>
			</div>
		</div>
	);
};

export default ProfileSideBar;
