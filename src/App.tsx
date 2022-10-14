import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Box } from '@mui/material'

import { Login, Signup, Profile } from './pages'

function App() {
	return (
		<Box
			display="flex"
			justifyContent="center"
			alignItems="center"
			height="100vh"
			width="100vw"
			sx={{ bgcolor: 'primary.main' }}
		>
			<Routes>
				<Route path="/" element={<Login />} />
				<Route path="/sign-up" element={<Signup />} />
				<Route path="/profile/:userId" element={<Profile />} />
			</Routes>
		</Box>
	)
}

export default App
