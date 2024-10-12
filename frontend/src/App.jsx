import { Navigate, Route, Routes } from "react-router-dom";

import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/auth/login/LoginPage";
import SignUpPage from "./pages/auth/signup/SignUpPage";
import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";

import Sidebar from "./components/common/Sidebar";
import RightPanel from "./components/common/RightPanel";

import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./components/common/LoadingSpinner";

function App() {
	const{data:authUser,isLoading} = useQuery({
		queryKey:["authUser"] , //we assign a queryKey to use it later anywhere. just by refering this queryKey.
		queryFn : async() => {
			try {
				const response = await fetch("/api/v1/users/getme");
				const data = await response.json()
				console.log("App refetched ") ;

				if(data.error) return null ; //if data  contains error obj then return null because user not loggedIn.
				
				return data  ;

			} catch (error) {
				throw new Error(error)
			}
		},
		retry:false , //if query fails then it will not refetch infinitely 
	})

	if (isLoading) {
		return (
			<div className='h-screen flex justify-center items-center'>  {/* spinner element while the data is loading given default by useQuery  */}
				<LoadingSpinner size='lg' />
			</div>
		);
	}

	return (
		<div className='flex max-w-6xl mx-auto'>
			{/* Common component, bc it's not wrapped with Routes */}
			{authUser && <Sidebar />}  {/*if auth user exists then execute Sidebar component */}
			<Routes>
				<Route path='/' element={authUser ? <HomePage /> : <Navigate to='/login' />} />
				<Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to='/' />} /> 
				<Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to='/' />} />
				<Route path='/notifications' element={authUser ? <NotificationPage /> : <Navigate to='/login' />} />
				<Route path='/profile/:username' element={authUser ? <ProfilePage /> : <Navigate to='/login' />} />
			</Routes>
			{authUser && <RightPanel />}
			<Toaster />
		</div>
	);
}

export default App;
