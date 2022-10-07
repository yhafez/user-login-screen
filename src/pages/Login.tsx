import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store'
import { Box, Button, Typography } from '@mui/material'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Circles } from 'react-loader-spinner'

import Logo from '../assets/logo.png'
import Input from '../components/Input'
import { login, clearLoading, loadUser } from '../store/actions/auth'

const Login = () => {
	const dispatch = useAppDispatch()
	const navigate = useNavigate()
	const { isAuthenticated, loading, error } = useAppSelector(state => state.auth)

	useEffect(() => {
		if (loading.status) dispatch(clearLoading())
	}, [])

	useEffect(() => {
		async function dispatchLoadUser() {
			await dispatch(loadUser())
		}

		try {
			dispatchLoadUser()

			const token = localStorage.getItem('token')
			if (isAuthenticated.status && token) navigate(`/profile/${isAuthenticated.user?._id}`)

			return () => dispatch(clearLoading())
		} catch (err) {
			console.error(err)

			return () => {
				dispatch(clearLoading())
			}
		}
	}, [isAuthenticated.status])

	const formik = useFormik({
		initialValues: {
			email: '',
			password: '',
		},
		validationSchema: Yup.object({
			email: Yup.string().email('Invalid email address').required('Email is required'),
			password: Yup.string()
				.min(6, 'Password must be at least 6 characters')
				.required('Password is required'),
		}),
		onSubmit: async values => {
			try {
				await dispatch(login(values))

				const token = localStorage.getItem('token')
				if (isAuthenticated.status && token) navigate(`/profile/${isAuthenticated.user?._id}`)
			} catch (err) {
				console.error(err)

				return () => {
					dispatch(clearLoading())
				}
			}
		},
	})

	return (
		<Box
			display="flex"
			flexDirection="column"
			justifyContent="center"
			alignItems="center"
			width="28rem"
			height="30rem"
			margin="auto"
			borderRadius={4}
			sx={{ backgroundColor: 'white' }}
		>
			{loading.status ? (
				<Circles color="skyBlue" />
			) : (
				<>
					<img src={Logo} alt="Smart Pump" style={{ width: '8rem', padding: '1rem' }} />
					<Typography sx={{ color: 'error.main' }}>
						{error.status && error.statusCode !== 401 && error.statusCode !== 403 && error.message}
					</Typography>
					<form onSubmit={formik.handleSubmit}>
						<Input
							id="email"
							name="email"
							type="email"
							customLabel="Username"
							value={formik.values.email}
							onChange={formik.handleChange}
							error={formik.touched.email && Boolean(formik.errors.email)}
							helperText={formik.touched.email && formik.errors.email}
						/>
						<Input
							id="password"
							name="password"
							type="password"
							value={formik.values.password}
							onChange={formik.handleChange}
							error={formik.touched.password && Boolean(formik.errors.password)}
							helperText={formik.touched.password && formik.errors.password}
						/>

						<Box display="flex" width="100%" justifyContent="space-between" mt={4}>
							<Button
								onClick={() => navigate('/sign-up')}
								variant="contained"
								type="button"
								sx={{
									backgroundColor: 'lightGray',
									color: 'black',
									fontWeight: '600',
									fontSize: '1.2rem',
									width: '6rem',
								}}
							>
								SIGNUP
							</Button>
							<Button
								variant="contained"
								type="submit"
								sx={{
									backgroundColor: 'lightGray',
									color: 'black',
									fontWeight: '600',
									fontSize: '1.2rem',
									width: '6rem',
								}}
							>
								LOGIN
							</Button>
						</Box>
					</form>
				</>
			)}
		</Box>
	)
}

export default Login
