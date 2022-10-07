import { useEffect, FC } from 'react'
import { Box, Button, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { Circles } from 'react-loader-spinner'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import moment from 'moment'
import { useAppDispatch, useAppSelector } from '../store'
import { clearLoading, loadUser, register } from '../store/actions/auth'

import Input from '../components/Input'
import { phoneRegExp } from '../helpers'

const Signup = () => {
	const navigate = useNavigate()
	const dispatch = useAppDispatch()

	const { isAuthenticated, loading, error } = useAppSelector(state => state.auth)

	useEffect(() => {
		if (loading.status) dispatch(clearLoading())
	}, [])

	useEffect(() => {
		dispatch(loadUser())

		const token = localStorage.getItem('token')
		if (isAuthenticated.status && token) {
			navigate(`/profile/${isAuthenticated.user?._id}`)
		}
		return () => {
			dispatch(clearLoading())
		}
	}, [dispatch, isAuthenticated.status, navigate])

	const formik = useFormik({
		initialValues: {
			firstName: '',
			lastName: '',
			email: '',
			password: '',
			confirmPassword: '',
			birthdate: '',
			company: '',
			eyeColor: '',
			phone: '',
			address: '',
		},
		validationSchema: Yup.object({
			email: Yup.string()
				.email('Invalid email')
				.required('Email is required')
				.min(5, 'Email must be at least 5 characters'),
			password: Yup.string()
				.required('Password is required')
				.min(8, 'Password must be at least 8 characters'),
			confirmPassword: Yup.string()
				.required('Confirm password is required')
				.min(8, 'Password must be at least 8 characters')
				.oneOf([Yup.ref('password'), null], 'Passwords must match'),
			birthdate: Yup.date()
				.required('Birthdate is required')
				.test('DOB', 'User must be at least eighteen years old to register', value => {
					return moment().diff(moment(value), 'years') >= 18
				}),
			firstName: Yup.string().required('First name is required'),
			lastName: Yup.string().required('Last name is required'),
			company: Yup.string(),
			eyeColor: Yup.string(),
			phone: Yup.string().matches(phoneRegExp, 'Phone number is not valid'),
			address: Yup.string(),
		}),
		onSubmit: async values => {
			dispatch(register(values))

			if (isAuthenticated.status) {
				navigate(`/profile/${isAuthenticated.user?._id}`)
			}

			if (error.status) {
				console.error(error.message)
			}
		},
	})

	return (
		<Box
			display="flex"
			flexDirection="column"
			justifyContent="center"
			alignItems="center"
			width="80vw"
			height="85vh"
			margin="auto"
			borderRadius={4}
			my={4}
			sx={{ backgroundColor: 'white' }}
		>
			{loading.status ? (
				<Circles color="skyBlue" />
			) : (
				<>
					<Typography variant="h4" sx={{ mt: 4, mb: 2 }}>
						Sign Up
					</Typography>
					{error.status && <Typography sx={{ color: 'error.main' }}>{error.message}</Typography>}
					<form
						style={{
							display: 'flex',
							flexDirection: 'column',
							width: '80%',
							padding: '2rem',
							overflowY: 'scroll',
							justifyContent: 'space-around',
						}}
						onSubmit={formik.handleSubmit}
					>
						<Box
							display="flex"
							alignItems="center"
							width="100%"
							flexWrap="wrap"
							justifyContent="space-around"
							sx={{ overflowY: 'scroll' }}
						>
							<Input
								id="firstName"
								name="firstName"
								customLabel="First Name"
								type="text"
								value={formik.values.firstName}
								onChange={formik.handleChange}
								error={formik.touched.firstName && Boolean(formik.errors.firstName)}
								helperText={formik.touched.firstName && formik.errors.firstName}
								margin
								required
							/>
							<Input
								id="lastName"
								name="lastName"
								customLabel="Last Name"
								type="text"
								value={formik.values.lastName}
								onChange={formik.handleChange}
								error={formik.touched.lastName && Boolean(formik.errors.lastName)}
								helperText={formik.touched.lastName && formik.errors.lastName}
								margin
								required
							/>
							<Input
								id="email"
								name="email"
								type="email"
								value={formik.values.email}
								onChange={formik.handleChange}
								error={formik.touched.email && Boolean(formik.errors.email)}
								helperText={formik.touched.email && formik.errors.email}
								margin
								required
							/>

							<Input
								id="password"
								name="password"
								type="password"
								value={formik.values.password}
								onChange={formik.handleChange}
								error={formik.touched.password && Boolean(formik.errors.password)}
								helperText={formik.touched.password && formik.errors.password}
								margin
								required
							/>
							<Input
								id="confirmPassword"
								name="confirmPassword"
								customLabel="Confirm Password"
								type="password"
								value={formik.values.confirmPassword}
								onChange={formik.handleChange}
								error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
								helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
								margin
								required
							/>
							<Input
								id="birthdate"
								name="birthdate"
								type="date"
								value={formik.values.birthdate}
								onChange={formik.handleChange}
								error={formik.touched.birthdate && Boolean(formik.errors.birthdate)}
								helperText={formik.touched.birthdate && formik.errors.birthdate}
								margin
								required
							/>
							<Input
								id="company"
								name="company"
								type="text"
								value={formik.values.company}
								onChange={formik.handleChange}
								error={formik.touched.company && Boolean(formik.errors.company)}
								helperText={formik.touched.company && formik.errors.company}
								margin
							/>
							<Input
								id="eyeColor"
								name="eyeColor"
								customLabel="Eye Color"
								type="text"
								value={formik.values.eyeColor}
								onChange={formik.handleChange}
								error={formik.touched.eyeColor && Boolean(formik.errors.eyeColor)}
								helperText={formik.touched.eyeColor && formik.errors.eyeColor}
								margin
							/>
							<Input
								id="phone"
								name="phone"
								type="tel"
								value={formik.values.phone}
								onChange={formik.handleChange}
								error={formik.touched.phone && Boolean(formik.errors.phone)}
								helperText={formik.touched.phone && formik.errors.phone}
								margin
							/>
							<Input
								id="address"
								name="address"
								type="text"
								fullWidth
								value={formik.values.address}
								onChange={formik.handleChange}
								error={formik.touched.address && Boolean(formik.errors.address)}
								helperText={formik.touched.address && formik.errors.address}
								margin
							/>
						</Box>
						<Box display="flex" justifyContent="space-between" mt={4}>
							<Button
								onClick={() => navigate('/')}
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
								RETURN
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
								SUBMIT
							</Button>
						</Box>
					</form>
				</>
			)}
		</Box>
	)
}

export default Signup
