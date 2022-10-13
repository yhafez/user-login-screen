import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Box, Button, Typography, Alert } from '@mui/material'
import { Circles } from 'react-loader-spinner'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useAppDispatch, useAppSelector } from '../store'

import {
	updateUser,
	clearLoading,
	clearSuccess,
	clearErrors,
	loadUser,
	logoutUser,
	UpdateUserFormData,
} from '../store/actions/auth'
import Input from '../components/Input'
// @ts-ignore
import { phoneRegex } from '../helpers'
import userThumbnail from '../assets/profile.jpg'

const Profile = () => {
	const { id } = useParams()
	const navigate = useNavigate()
	const dispatch = useAppDispatch()
	const { isAuthenticated, loading, error, success } = useAppSelector(state => state.auth)
	const [profile, setProfile] = useState<UpdateUserFormData>()
	const [isEdit, setIsEdit] = useState(false)

	useEffect(() => {
		if (loading.status) dispatch(clearLoading())
	}, [])

	useEffect(() => {
		if (!localStorage.getItem('token')) return
		async function dispatchLoadUser() {
			await dispatch(loadUser())
		}
		if (!id || id === 'undefined' || id === 'null') {
			if (isAuthenticated.status && isAuthenticated.user) setProfile(isAuthenticated.user)
		} else {
			try {
				dispatchLoadUser()

				if (isAuthenticated.status && isAuthenticated.user) {
					setProfile(isAuthenticated.user)
				}

				return () => dispatch(clearLoading())
			} catch (e) {
				console.error(e)

				return () => {
					dispatch(clearLoading())
				}
			}
		}
	}, [isAuthenticated.status])

	useEffect(() => {
		if (error.status) {
			setTimeout(() => {
				dispatch(clearErrors())
			}, 3000)
		}
	}, [error.status])

	useEffect(() => {
		if (success.status) {
			setTimeout(() => {
				dispatch(clearSuccess())
			}, 3000)
		}
	}, [success.status])

	const handleLogout = async () => {
		async function dispatchLogoutUser() {
			await dispatch(logoutUser())
			navigate('/')
		}

		try {
			await dispatchLogoutUser()
			return () => {
				dispatch(clearLoading())
			}
		} catch (e) {
			console.error(e)
			return () => {
				dispatch(clearLoading())
			}
		}
	}

	useEffect(() => {
		if (profile) {
			formik.setValues({
				firstName: profile.name.first || '',
				lastName: profile.name.last || '',
				email: profile.email || '',
				phone: profile.phone || '',
				address: profile.address || '',
				age: profile.age || '',
				company: profile.company || '',
				eyeColor: profile.eyeColor || '',
				password: '',
				confirmPassword: '',
			})
		}
	}, [profile])

	const formik = useFormik({
		initialValues: {
			firstName: profile?.name?.first || '',
			lastName: profile?.name?.last || '',
			email: profile?.email || '',
			password: '',
			confirmPassword: '',
			phone: profile?.phone || '',
			address: profile?.address || '',
			age: profile?.age || '',
			company: profile?.company || '',
			eyeColor: profile?.eyeColor || '',
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
			company: Yup.string(),
			eyeColor: Yup.string(),
			phone: Yup.string().matches(phoneRegex, 'Phone number is not valid'),
			address: Yup.string(),
		}),
		onSubmit: async values => {
			async function dispatchUpdateUser() {
				if (id)
					await dispatch(
						updateUser(id, { ...values, name: { first: values.firstName, last: values.lastName } }),
					)
				const token = localStorage.getItem('token')

				if (isAuthenticated.status && isAuthenticated.user && token)
					setProfile(isAuthenticated.user)
				if (isAuthenticated.user?._id !== id) navigate(`/profile/${isAuthenticated.user?._id}`)
				if (!isAuthenticated.user) navigate('/')

				setIsEdit(false)

				return () => {
					dispatch(clearLoading())
				}
			}

			try {
				await dispatchUpdateUser()
				return () => {
					dispatch(clearLoading())
				}
			} catch (e) {
				console.error(e)
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
					<Box
						display="flex"
						flexDirection="column"
						justifyContent="center"
						alignItems="center"
						width="100%"
						margin="auto"
						borderRadius={4}
						my={4}
						sx={{ backgroundColor: 'white' }}
					>
						<img
							src={userThumbnail}
							alt="User thumbnail"
							width="100"
							height="100"
							style={{
								borderRadius: '50%',
								objectFit: 'cover',
								objectPosition: 'center',
							}}
						/>
					</Box>
					<Box display="flex" justifyContent="space-around" mt={4} width="30%">
						<Box display="flex" flexDirection="column" alignItems="center">
							<Typography sx={{ position: 'relative', top: '0', color: 'black' }}>
								{isAuthenticated.user?.balance}
							</Typography>
							<Button
								variant="contained"
								type="button"
								sx={{
									backgroundColor: 'lightGray',
									color: 'black',
									fontWeight: '600',
									fontSize: '1rem',
									width: '6rem',
								}}
							>
								BALANCE
							</Button>
						</Box>
						<Box display="flex" flexDirection="column" alignItems="center">
							<Box height="1.5rem" />
							{isEdit ? (
								<Button
									variant="contained"
									type="submit"
									sx={{
										backgroundColor: 'primary.main',
										color: 'black',
										fontWeight: '600',
										fontSize: '1rem',
										width: '6rem',
									}}
									onClick={() => {
										formik.handleSubmit()
									}}
								>
									SAVE
								</Button>
							) : (
								<Button
									onClick={() => setIsEdit(isEdit => !isEdit)}
									variant="contained"
									type="button"
									sx={{
										backgroundColor: 'lightGray',
										color: 'black',
										fontWeight: '600',
										fontSize: '1rem',
										width: '6rem',
									}}
								>
									EDIT
								</Button>
							)}
						</Box>
					</Box>
					{error.status && error.statusCode !== 401 && error.statusCode !== 403 && (
						<Alert
							severity="error"
							sx={{
								width: '88%',
								textAlign: 'center',
								my: '2rem',
								mr: '1rem',
							}}
						>
							<Typography>{error.message}</Typography>
						</Alert>
					)}
					{success.status && (
						<Alert
							severity="success"
							sx={{
								width: '88%',
								textAlign: 'center',
								my: '2rem',
								mr: '1rem',
							}}
						>
							<Typography>{success.message}</Typography>
						</Alert>
					)}
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
							justifyContent="center"
							width="100%"
							flexWrap="wrap"
							sx={{ overflowY: 'scroll' }}
						>
							<Input
								id="firstName"
								name="firstName"
								customLabel="First Name"
								type="text"
								value={formik.values.firstName}
								onChange={formik.handleChange}
								error={isEdit && formik.touched.firstName && Boolean(formik.errors.firstName)}
								helperText={isEdit && formik.touched.firstName && formik.errors.firstName}
								margin
								required={isEdit}
								disabled={!isEdit}
							/>
							<Input
								id="lastName"
								name="lastName"
								customLabel="Last Name"
								type="text"
								value={formik.values.lastName}
								onChange={formik.handleChange}
								error={isEdit && formik.touched.lastName && Boolean(formik.errors.lastName)}
								helperText={isEdit && formik.touched.lastName && formik.errors.lastName}
								margin
								required={isEdit}
								disabled={!isEdit}
							/>
							<Input
								id="email"
								name="email"
								type="email"
								value={formik.values.email}
								onChange={formik.handleChange}
								error={isEdit && formik.touched.email && Boolean(formik.errors.email)}
								helperText={isEdit && formik.touched.email && formik.errors.email}
								margin
								required={isEdit}
								disabled={!isEdit}
							/>

							<Input
								id="password"
								name="password"
								type="password"
								value={formik.values.password}
								onChange={formik.handleChange}
								error={isEdit && formik.touched.password && Boolean(formik.errors.password)}
								helperText={isEdit && formik.touched.password && formik.errors.password}
								margin
								required={isEdit}
								disabled={!isEdit}
							/>
							<Input
								id="confirmPassword"
								name="confirmPassword"
								customLabel="Confirm Password"
								type="password"
								value={formik.values.confirmPassword}
								onChange={formik.handleChange}
								error={
									isEdit && formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)
								}
								helperText={
									isEdit && formik.touched.confirmPassword && formik.errors.confirmPassword
								}
								margin
								required={isEdit}
								disabled={!isEdit}
							/>
							<Input
								id="age"
								name="age"
								type="text"
								value={formik.values.age}
								onChange={formik.handleChange}
								error={isEdit && formik.touched.age && Boolean(formik.errors.age)}
								helperText={isEdit && formik.touched.age && formik.errors.age}
								margin
								required={isEdit}
								disabled
							/>
							<Input
								id="company"
								name="company"
								type="text"
								value={formik.values.company}
								onChange={formik.handleChange}
								error={isEdit && formik.touched.company && Boolean(formik.errors.company)}
								helperText={isEdit && formik.touched.company && formik.errors.company}
								margin
								disabled={!isEdit}
							/>
							<Input
								id="eyeColor"
								name="eyeColor"
								customLabel="Eye Color"
								type="text"
								value={formik.values.eyeColor}
								onChange={formik.handleChange}
								error={isEdit && formik.touched.eyeColor && Boolean(formik.errors.eyeColor)}
								helperText={isEdit && formik.touched.eyeColor && formik.errors.eyeColor}
								margin
								disabled={!isEdit}
							/>
							<Input
								id="phone"
								name="phone"
								type="tel"
								value={formik.values.phone}
								onChange={formik.handleChange}
								error={isEdit && formik.touched.phone && Boolean(formik.errors.phone)}
								helperText={isEdit && formik.touched.phone && formik.errors.phone}
								margin
								disabled={!isEdit}
							/>
							<Input
								id="address"
								name="address"
								type="text"
								value={formik.values.address}
								onChange={formik.handleChange}
								error={isEdit && formik.touched.address && Boolean(formik.errors.address)}
								helperText={isEdit && formik.touched.address && formik.errors.address}
								margin
								disabled={!isEdit}
								fullWidth
							/>
						</Box>
					</form>
					<Button variant="contained" color="error" onClick={handleLogout} sx={{ mb: '3rem' }}>
						Logout
					</Button>
				</>
			)}
		</Box>
	)
}

export default Profile
