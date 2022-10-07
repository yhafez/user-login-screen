import moment from 'moment'
import jwt from 'jsonwebtoken'
import { db } from './server.js'

import { phoneRegex, emailRegex, passwordRegex } from './src/helpers.js'

export const authenticateUser = async (req, res, next) => {
	try {
		const authHeader = req.headers.authorization
		if (!authHeader) {
			return res.status(401).json({ message: 'No authorization header' })
		}

		const token = authHeader.split(' ')[1]
		if (!token || token === '' || token === 'null') {
			return res.status(401).json({ message: 'No token found' })
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
			if (err) {
				return res.status(403).json({ message: 'Invalid token' })
			}
			return decoded
		})

		if (!decoded) {
			return res.status(401).json({ message: 'Invalid token' })
		}

		const user = db.data?.users.find(u => u._id === decoded._id)
		if (!user) {
			return res.status(401).json({ message: 'User not found' })
		}

		req.user = user
		next()
	} catch (err) {
		next(err)
	}
}

export const validateFormData = (req, res, next) => {
	try {
		const { email, password, name, birthdate, age, company, eyeColor, phone, address } = req.body
		// Validate required fields
		if (
			!name ||
			!name?.first?.trim() ||
			!name?.last?.trim() ||
			!email ||
			!password ||
			(!birthdate && !age)
		) {
			return res.status(400).json({ message: 'Please fill all the fields' })
		}

		// Validate email
		if (!email.includes('@')) {
			return res.status(400).json({ message: 'Please enter a valid email' })
		}
		if (email.length > 50) {
			return res.status(400).json({ message: 'Email is too long' })
		}
		if (email.length < 5) {
			return res.status(400).json({ message: 'Email is too short' })
		}
		if (email.includes(' ')) {
			return res.status(400).json({ message: 'Email cannot contain spaces' })
		}
		if (emailRegex.test(email) === false) {
			return res.status(400).json({ message: 'Email is not valid' })
		}

		// Validate password
		if (password.length < 8) {
			return res.status(400).json({ message: 'Password is too short' })
		}
		if (password.length > 30) {
			return res.status(400).json({ message: 'Password is too long' })
		}
		if (password.includes(' ')) {
			return res.status(400).json({ message: 'Password cannot contain spaces' })
		}
		if (passwordRegex.test(password) === false) {
			return res.status(400).json({ message: 'Password is not valid' })
		}
		if (!password.match(/[a-z]/)) {
			return res
				.status(400)
				.json({ message: 'Password must contain at least one lowercase letter' })
		}
		if (!password.match(/[A-Z]/)) {
			return res
				.status(400)
				.json({ message: 'Password must contain at least one uppercase letter' })
		}
		if (!password.match(/[0-9]/)) {
			return res.status(400).json({ message: 'Password must contain at least one number' })
		}
		if (!password.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)) {
			return res.json({ message: 'Password must contain at least one special character' })
		}

		// Validate phone
		if (phone && phone.length < 10) {
			return res.status(400).json({ message: 'Phone is too short' })
		}
		if (phone && phone.length > 15) {
			return res.status(400).json({ message: 'Phone is too long' })
		}
		if (phone && phone?.includes(' ')) {
			return res.status(400).json({ message: 'Phone cannot contain spaces' })
		}
		if (phone && phoneRegex.test(phone) === false) {
			return res.status(400).json({ message: 'Phone is not valid' })
		}

		// Validate birthdate
		if (birthdate) {
			if (!birthdate.startsWith('19') && !birthdate.startsWith('20')) {
				return res.status(400).json({ message: 'Birthdate is not valid' })
			}
			if (moment(birthdate).isAfter(moment())) {
				return res.status(400).json({ message: 'Birthdate cannot be in the future' })
			}
			if (moment(birthdate).isBefore(moment().subtract(100, 'years'))) {
				return res.status(400).json({ message: 'Birthdate cannot be more than 100 years ago' })
			}
			if (moment().diff(moment(birthdate), 'years') < 18) {
				return res.status(400).json({ message: 'You must be at least 18 years old' })
			}
			if (birthdate.includes(' ')) {
				return res.status(400).json({ message: 'Birthdate cannot contain spaces' })
			}
			if (typeof birthdate !== 'string') {
				return res.status(400).json({ message: 'Birthdate must be a string' })
			}
			if (moment(birthdate.slice(0, 10), 'YYYY-MM-DD', true).isValid() === false) {
				return res.status(400).json({ message: 'Birthdate must be in the format YYYY-MM-DD' })
			}
		}

		// Validate eye color
		if (
			eyeColor &&
			![
				'blue',
				'brown',
				'green',
				'hazel',
				'grey',
				'gray',
				'amber',
				'blue-gray',
				'blue-grey',
				'heterochromia',
			].includes(eyeColor)
		) {
			return res.status(400).json({ message: 'Please select a valid eye color' })
		}
		if (eyeColor?.includes(' ')) {
			return res.status(400).json({ message: 'Eye color cannot contain spaces' })
		}

		// Validate address
		if (address && address.length > 100) {
			return res.status(400).json({ message: 'Address is too long' })
		}
		if (address && address.length < 3) {
			return res.status(400).json({ message: 'Address is too short' })
		}

		// Validate company
		if (company && company.length > 100) {
			return res.status(400).json({ message: 'Company is too long' })
		}
		if (company && company.length < 2) {
			return res.status(400).json({ message: 'Company is too short' })
		}
		if (company && company === ' ') {
			return res.status(400).json({ message: 'Company cannot be an empty value' })
		}

		// Validate first name
		if (name.first.length > 50) {
			return res.status(400).json({ message: 'First name is too long' })
		}
		if (name.first.length < 2) {
			return res.status(400).json({ message: 'First name is too short' })
		}
		if (!name.first.match(/^[a-zA-Z]+$/)) {
			return res.status(400).json({ message: 'First name must contain only letters' })
		}

		// Validate last name
		if (name.last.length > 50) {
			return res.status(400).json({ message: 'Last name is too long' })
		}
		if (name.last.length < 2) {
			return res.status(400).json({ message: 'Last name is too short' })
		}
		if (!name.last.match(/^[a-zA-Z']+$/)) {
			return res.status(400).json({ message: 'Last name must contain only letters' })
		}

		next()
	} catch (err) {
		console.error(err)
		return res.status(500).json({ message: 'Internal server error' })
	}
}
