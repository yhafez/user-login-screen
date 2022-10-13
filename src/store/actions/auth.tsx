import { createSlice } from '@reduxjs/toolkit'
import { RootState, AppDispatch } from '..'

const initialState: AuthState = {
	token: localStorage.getItem('token') || null,

	isAuthenticated: {
		status: false,
		user: null,
	},
	loading: {
		status: true,
		message: null,
	},
	error: {
		status: false,
		message: null,
		statusCode: null,
	},
	success: {
		status: false,
		message: null,
	},
	users: [],
}

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		registerSuccess: (state, action) => {
			localStorage.setItem('token', action.payload.token)
			return {
				...state,
				...action.payload,
				isAuthenticated: {
					status: true,
					user: action.payload.user,
				},
				loading: {
					status: false,
					message: null,
				},
				error: {
					status: false,
					message: null,
					statusCode: null,
				},
				success: {
					status: true,
					message: 'Registration successful',
				},
			}
		},
		registerFail: (state, action) => {
			localStorage.removeItem('token')
			return {
				...state,
				token: null,
				isAuthenticated: {
					status: false,
					user: null,
				},
				loading: {
					status: false,
					message: null,
				},
				error: {
					status: true,
					message: action.payload.message,
					statusCode: action.payload.statusCode,
				},
				success: {
					status: false,
					message: null,
				},
			}
		},
		userLoaded: (state, action) => {
			localStorage.setItem('token', action.payload.token)
			return {
				...state,
				isAuthenticated: {
					status: true,
					user: action.payload.user,
				},
				loading: {
					status: false,
					message: null,
				},
				error: {
					status: false,
					message: null,
					statusCode: null,
				},
				success: {
					status: false,
					message: null,
				},
			}
		},
		authError: (state, action) => {
			localStorage.removeItem('token')
			return {
				...state,
				token: null,
				isAuthenticated: {
					status: false,
					user: null,
				},
				loading: {
					status: false,
					message: null,
				},
				error: {
					status: true,
					message: action.payload.message,
					statusCode: action.payload.statusCode,
				},
				success: {
					status: false,
					message: null,
				},
			}
		},
		loginSuccess: (state, action) => {
			localStorage.setItem('token', action.payload.token)
			return {
				...state,
				...action.payload,
				isAuthenticated: {
					status: true,
					user: action.payload.user,
				},
				loading: {
					status: false,
					message: null,
				},
				error: {
					status: false,
					message: null,
					statusCode: null,
				},
				success: {
					status: true,
					message: 'Login successful',
				},
			}
		},
		loginFail: (state, action) => {
			localStorage.removeItem('token')
			return {
				...state,
				token: null,
				isAuthenticated: {
					status: false,
					user: null,
				},
				loading: {
					status: false,
					message: null,
				},
				error: {
					status: true,
					message: action.payload.message,
					statusCode: action.payload.statusCode,
				},
				success: {
					status: false,
					message: null,
				},
			}
		},
		logout: state => {
			localStorage.removeItem('token')
			return {
				...state,
				token: null,
				isAuthenticated: {
					status: false,
					user: null,
				},
				loading: {
					status: false,
					message: null,
				},
				error: {
					status: false,
					message: null,
					statusCode: null,
				},
				success: {
					status: true,
					message: 'Logout successful',
				},
			}
		},
		fetchUsers: (state, action) => {
			return {
				...state,
				users: action.payload,
				loading: {
					status: false,
					message: null,
				},
				error: {
					status: false,
					message: null,
					statusCode: null,
				},
				success: {
					status: true,
					message: 'Users fetched successfully',
				},
				isAuthenticated: {
					status: true,
					user: state.isAuthenticated.user,
				},
				token: state.token,
			}
		},

		fetchUserById: state => {
			return {
				...state,
				loading: {
					status: false,
					message: null,
				},
				error: {
					status: false,
					message: null,
					statusCode: null,
				},
				success: {
					status: true,
					message: 'User fetched successfully',
				},
				isAuthenticated: {
					status: true,
					user: state.isAuthenticated.user,
				},
				token: state.token,
				users: state.users,
			}
		},

		setLoading: (state, action) => {
			return {
				...state,
				loading: {
					status: true,
					message: action.payload,
				},
			}
		},

		authenticate: (state, action) => {
			return {
				...state,
				loading: {
					status: true,
					message: action.payload,
				},
				error: {
					status: false,
					message: null,
					statusCode: null,
				},
				success: {
					status: false,
					message: null,
				},

				isAuthenticated: {
					status: false,
					user: null,
				},
			}
		},

		setUserUpdated: (state, action) => {
			return {
				...state,
				loading: {
					status: false,
					message: null,
				},
				error: {
					status: false,
					message: null,
					statusCode: null,
				},
				success: {
					status: true,
					message: 'User updated successfully',
				},
				isAuthenticated: {
					status: true,
					user: action.payload.user,
				},
			}
		},

		userUpdateError: (state, action) => {
			return {
				...state,
				loading: {
					status: false,
					message: null,
				},
				error: {
					status: true,
					message: action.payload.message,
					statusCode: action.payload.statusCode,
				},
				success: {
					status: false,
					message: null,
				},
				isAuthenticated: {
					status: true,
					user: state.isAuthenticated.user,
				},
			}
		},

		clearErrors: state => {
			return {
				...state,
				error: {
					status: false,
					message: null,
					statusCode: null,
				},
			}
		},

		clearUsers: state => {
			return {
				...state,
				users: [],
			}
		},

		clearUser: state => {
			return {
				...state,
				isAuthenticated: {
					status: false,
					user: null,
				},
			}
		},

		clearLoading: state => {
			return {
				...state,
				loading: {
					status: false,
					message: null,
				},
			}
		},

		clearSuccess: state => {
			return {
				...state,
				success: {
					status: false,
					message: null,
				},
			}
		},

		clearAuth: state => {
			return {
				...state,
				isAuthenticated: {
					status: false,
					user: null,
				},
			}
		},

		clearAll: state => {
			return {
				...state,
				isAuthenticated: {
					status: false,
					user: null,
				},
				loading: {
					status: false,
					message: null,
				},
				error: {
					status: false,
					message: null,
					statusCode: null,
				},
				success: {
					status: false,
					message: null,
				},
				users: [],
			}
		},
	},
})

export const {
	registerSuccess,
	registerFail,
	userLoaded,
	authError,
	loginSuccess,
	loginFail,
	logout,
	fetchUsers,
	setLoading,
	clearErrors,
	clearSuccess,
	clearUsers,
	clearUser,
	clearLoading,
	clearAuth,
	clearAll,
	authenticate,
	setUserUpdated,
	userUpdateError,
} = authSlice.actions

export default authSlice.reducer

// Selectors

export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated
export const selectLoading = (state: RootState) => state.auth.loading
export const selectError = (state: RootState) => state.auth.error
export const selectSuccess = (state: RootState) => state.auth.success
export const selectUsers = (state: RootState) => state.auth.users
export const selectUser = (state: RootState) => state.auth.isAuthenticated.user

// Actions

export const loadUser = () => async (dispatch: AppDispatch) => {
	dispatch(setLoading('Loading user...'))
	try {
		const token = localStorage.getItem('token')

		if (token) {
			const res = await fetch('/api/auth/me', {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			})
			const data = await res.json()
			if (data && data.user) dispatch(userLoaded({ user: data.user, token }))
			else {
				dispatch(
					authError({
						message: data.message,
						statusCode: res.status,
					}),
				)
			}
		} else {
			dispatch(authError({ message: 'No token found', statusCode: 401 }))
		}
	} catch (e: any) {
		dispatch(authError({ message: e.message, statusCode: 500 }))
	}
}

export const register = (formData: RegisterFormData) => async (dispatch: AppDispatch) => {
	dispatch(setLoading('Registering user...'))
	try {
		const res = await fetch('/api/auth/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				...formData,
				name: {
					first: formData.firstName,
					last: formData.lastName,
				},
			}),
		})

		const data = await res.json()
		if (data && data.token && data.user)
			dispatch(registerSuccess({ token: data.token, user: data.user }))
		else dispatch(registerFail({ message: data.message, statusCode: res.status }))
	} catch (e: any) {
		dispatch(registerFail({ message: e.message, statusCode: 500 }))
	}
}

export const login = (formData: LoginFormData) => async (dispatch: AppDispatch) => {
	dispatch(setLoading('Logging in...'))
	try {
		const res = await fetch('/api/auth/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(formData),
		})
		const data = await res.json()
		if (data && data.token && data.user)
			dispatch(loginSuccess({ token: data.token, user: data.user }))
		else dispatch(loginFail({ message: data.message, statusCode: 500 }))
	} catch (e: any) {
		dispatch(loginFail(e))
	}
}

export const logoutUser = () => async (dispatch: AppDispatch) => {
	dispatch(setLoading('Logging out...'))
	try {
		const res = await fetch('/api/auth/logout')
		const data = await res.json()

		if (data) await dispatch(logout())
		else dispatch(authError({ message: data.message, statusCode: res.status }))
	} catch (e: any) {
		dispatch(authError({ message: e.message, statusCode: 500 }))
	}
}

export const fetchAllUsers = () => async (dispatch: AppDispatch) => {
	dispatch(setLoading('Fetching users...'))
	try {
		const res = await fetch('/api/users')
		const data = await res.json()

		if (data && data.users) {
			dispatch(fetchUsers(data.users))
		} else {
			dispatch(authError({ message: data.message, statusCode: res.status }))
		}
	} catch (e: any) {
		dispatch(authError({ message: e.message, statusCode: 500 }))
	}
}

export const updateUser =
	(id: string, formData: UpdateUserFormData) => async (dispatch: AppDispatch) => {
		dispatch(setLoading('Updating user...'))

		try {
			const res = await fetch(`/api/users/${id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
				body: JSON.stringify(formData),
			})

			const data = await res.json()
			if (data && data.user) {
				dispatch(setUserUpdated({ user: data.user }))
			} else {
				dispatch(userUpdateError({ message: data.message, statusCode: res.status }))
			}
		} catch (e: any) {
			dispatch(userUpdateError({ message: e.message, statusCode: 500 }))
		}
	}

export const deleteUser = (id: string) => async (dispatch: AppDispatch) => {
	dispatch(setLoading('Deleting user...'))
	try {
		const res = await fetch(`/api/users/${id}`, {
			method: 'DELETE',
		})
		const data = await res.json()

		if (data && data.message) {
			dispatch(clearUser())
		} else {
			dispatch(authError({ message: data.message, statusCode: res.status }))
		}
	} catch (e: any) {
		dispatch(authError({ message: e.message, statusCode: 500 }))
	}
}

// Utils

export const tokenConfig = (getState: () => RootState) => {
	const token = getState().auth.token
	const config = {
		headers: {
			'Content-Type': 'application/json',
			' x-auth-token': token,
			Authorization: `Bearer ${token}`,
		},
	}
	return config
}

// Types

export interface User {
	_id: string
	guid: string
	isActive: boolean
	balance: string
	picture: string
	age: number
	eyeColor: string
	name: {
		first: string
		last: string
	}
	company: string
	email: string
	salt: string
	password: string
	phone: string
	address: string
}

export interface AuthState {
	token: string | null
	isAuthenticated: {
		status: boolean
		user: User | null
	}
	loading: {
		status: boolean
		message: string | null
	}

	error: {
		status: boolean
		message: string | null
		statusCode: number | null
	}

	success: {
		status: boolean
		message: string | null
	}

	users: User[] | null
}

export interface RegisterFormData {
	email: string
	password: string
	birthdate: string
	eyeColor?: string
	firstName: string
	lastName: string
	company?: string
	phone?: string
	address?: string
}

export interface LoginFormData {
	email: string
	password: string
}

export interface UpdateUserFormData {
	email?: string
	password?: string
	age?: number | string | null | undefined
	eyeColor?: string
	name: {
		first?: string
		last?: string
	}
	company?: string
	salt?: string
	phone?: string
	address?: string
}
