import XSvg from "../svgs/X";

import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { Link, Navigate } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { asyncHandler } from "../../../../backend/src/utils/asyncHandler";
import { useState } from "react";

const Sidebar = () => {
	const queryClient = useQueryClient();
	const { mutate: logoutMutation,isPending } = useMutation({ //logout mutation query for logout functionality  in sidebar 
		mutationFn: async () => { // It returns a mutation function which is used to update/post methods in DB
			try {
				const res = await fetch("/api/v1/users/logout", {
					method: "POST",
				});
				const data = await res.json();

			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: () => {
			console.log("onsuccess ");
			const {data } = queryClient.invalidateQueries({ queryKey: ["authUser"] }); //refetches the data after an update 
			//the invalidateQueries goes to the origin of its useQuery and executes it 
			//In this scenario the invalidateQueries({ queryKey: ["authUser"] }) refers to the origin useQuery()  in App.jsx
			// executes the query for new info and also excutes the App.jsx return component/routes.
			//In this way we are able to achieve the logout functionality ..
			toast.success("User Loggedout");
		},
		onError: () => {
			toast.error("Logout failed"); //pops a toast
		},
	});
	const { data: authUser } = useQuery({ queryKey: ["authUser"] });
	console.log(authUser , "Sidebar") ;

	return (
		<div className='md:flex-[2_2_0] w-18 max-w-52'>
			<div className='sticky top-0 left-0 h-screen flex flex-col border-r border-gray-700 w-20 md:w-full'>
				<Link to='/' className='flex justify-center md:justify-start'>
					<XSvg className='px-2 w-12 h-12 rounded-full fill-white hover:bg-stone-900' /> {/* X/Twitter logo  */}
				</Link>
				<ul className='flex flex-col gap-3 mt-4'>
					<li className='flex justify-center md:justify-start'>
						<Link
							to='/'
							className='flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
						>
							<MdHomeFilled className='w-8 h-8' />
							<span className='text-lg hidden md:block'>Home</span> {/*  Home link */}
						</Link>
					</li>
					<li className='flex justify-center md:justify-start'>
						<Link
							to='/notifications'
							className='flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
						>
							<IoNotifications className='w-6 h-6' />
							<span className='text-lg hidden md:block'>Notifications</span> {/* Link to notifications  */}
						</Link>
					</li>

					<li className='flex justify-center md:justify-start'>
						<Link
							to={`/profile/${authUser?.data?.username}`} //Dynamic link where the data is from authUser for  username.
							//this link handovers the operation to <Route> matching  with this link to="/route"
							// Also it's a params route where /profile/:username. we can access the dynamic username from params.
							className='flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
						>
							<FaUser className='w-6 h-6' />
							<span className='text-lg hidden md:block'>Profile</span>
						</Link>
					</li>
				</ul>
				{authUser && (
					<Link
						to={`/profile/${authUser.data?.username}`}
						className='mt-auto mb-10 flex gap-2 items-start transition-all duration-300 hover:bg-[#494848] py-2 px-4 rounded-full'
					>
						<div className='avatar hidden md:inline-flex'> 
							<div className='w-8 rounded-full'>
								<img src={authUser?.data?.profileImage || "/avatar-placeholder.png"} />
							</div>
						</div>
						<div className='flex justify-between flex-1'>
							<div className='hidden md:block'>
								<p className='text-white font-bold text-sm w-20 truncate'>{authUser.data?.fullName}</p>
								<p className='text-slate-500 text-sm'>@{authUser.data?.username}</p>
							</div>
							<BiLogOut
								className='w-5 h-5 cursor-pointer'
								onClick={(e) => {
									e.preventDefault();
									logoutMutation(); //this button triggers the logout functionality 
								}}
							/>
						</div>
					</Link>
				)}
			</div>
		</div>
	);
};
export default Sidebar;
