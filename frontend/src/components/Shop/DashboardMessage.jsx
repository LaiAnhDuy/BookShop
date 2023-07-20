import axios from '../../redux/actions/axiosConfig';
import React, {useEffect, useState} from 'react';
import {AiOutlineArrowRight} from 'react-icons/ai';
import {HiArrowCircleRight} from 'react-icons/hi';
import {useSelector} from 'react-redux';
import {toast} from 'react-toastify';
import {TfiGallery} from 'react-icons/tfi';

const DashboardMessage = () => {
	const [open, setOpen] = useState(false);
	const [currentChat, setCurrentChat] = useState(null);
	const [conversations, setConversations] = useState(null);
	const {seller} = useSelector((state) => state.seller);
	useEffect(() => {
		axios
			.get(`/conversation/get-all-conversations-seller/${seller._id}`)
			.then((response) => {
				setConversations(response.data.conversations);
			})
			.catch((error) => toast.error(error.message));
	}, [seller]);

	return (
		<div className="w-[90%] shadow-2xl rounded-md bg-white h-[85vh] p-4 overflow-y-scroll m-auto">
			{!open && (
				<>
					<h1 className="text-center font-Poppins text-[18px] font-[500] pb-5">
						All Messages
					</h1>
					{/* all conversation */}
					{conversations &&
						conversations.map((conversation) => (
							<ConversationCard
								data={conversation}
								setCurrentChat={setCurrentChat}
								setOpen={setOpen}
							/>
						))}
				</>
			)}
			{open && <SellerInbox setOpen={setOpen} />}
		</div>
	);
};

const SellerInbox = ({setOpen}) => {
	return (
		<div className="w-full h-full flex flex-col justify-between">
			<div className="w-full flex items-center justify-between bg-gray-100 rounded-sm shadow-2xl p-2 ">
				<div className="flex items-center">
					<img
						src="http://localhost:3001/shop1.png"
						className="block w-[50px] h-[50px] rounded-full"
						alt=""
					/>
					<h1 className="pl-2">Nguyen Van A</h1>
				</div>
				<AiOutlineArrowRight
					size={20}
					className="cursor-pointer"
					onClick={() => setOpen(false)}
				/>
			</div>

			{/* messages */}
			<div className="w-full h-[65vh] overflow-y-scroll px-2 pt-4">
				<div className="flex w-full justify-start pb-3">
					<img
						src="http://localhost:3001/shop1.png"
						className="block w-[30px] h-[30px] rounded-full"
						alt=""
					/>
					<div className="bg-green-400 w-max max-w-[60%] px-2 py-1 mx-2 rounded-[15px]">
						<p>Hello guy</p>
					</div>
				</div>
				<div className="flex w-full justify-end">
					<div className="bg-green-400 max-w-[60%] px-2 py-1 mx-2 rounded-[15px]">
						<p>
							dda d mowf oroif anhs kieem anh ddao luif a soo tieng loa tieng troong
							vaan rox rang
						</p>
					</div>
				</div>
			</div>

			{/* send message*/}
			<form
				action=""
				aria-required={true}
			>
				<div className="flex relative items-center">
					<div className="w-[30px]">
						<input
							type="file"
							name=""
							id="image"
							className="hidden"
							// onChange={handleImageUpload}
						/>
						<label htmlFor="image">
							<TfiGallery
								className="cursor-pointer"
								size={20}
							/>
						</label>
					</div>
					<input
						type="text"
						placeholder="Aa"
						className="block  w-full leading-[10px] px-3 py-2 rounded-xl bg-gray-200  border "
					/>
					<input
						type="submit"
						id="send-message"
						hidden
					/>
					<label htmlFor="send-message">
						<HiArrowCircleRight
							size={26}
							className="absolute right-2 top-2 cursor-pointer"
						/>
					</label>
				</div>
			</form>
		</div>
	);
};

const ConversationCard = ({data, setCurrentChat, setOpen}) => {
	return (
		<div
			className="w-full  px-2 flex items-center py-3 hover:bg-gray-300 cursor-pointer rounded-md
    "
			onClick={() => {
				setOpen(true);
				setCurrentChat(data);
			}}
		>
			<div className="relative">
				<img
					src="http://localhost:3001/shop1.png"
					className="block w-[50px] h-[50px] rounded-full"
					alt=""
				/>
				<div className="absolute z-20 top-1 right-1 w-3 h-3 rounded-full bg-green-600 "></div>
			</div>

			<div className="ml-3 flex flex-col justify-center">
				<h1 className="font-[400]">Nguyen van a</h1>
				<p>hello..</p>
			</div>
		</div>
	);
};

export default DashboardMessage;
