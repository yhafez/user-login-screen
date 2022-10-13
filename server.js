import express from 'express'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { Low, JSONFile } from 'lowdb'
import cors from 'cors'
import { v4 as uuidv4 } from 'uuid'
import * as dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import moment from 'moment'
import crypto from 'crypto'
import { authenticateUser, validateFormData } from './middleware.js'

dotenv.config()
const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(join(__dirname, 'public')))
app.use(express.static(join(__dirname, 'dist')))
app.get('/', (req, res) => {
	res.sendFile(join(__dirname, 'dist', 'index.html'))
})

const file = join(__dirname, 'data/users.json')
const adapter = new JSONFile(file)
export const db = new Low(adapter)
db.read()

app.get('/auth/me', authenticateUser, (req, res, next) => {
	try {
		if (req.user) res.json({ user: req.user })
		else res.status(401).json({ message: 'User not found' })
	} catch (e) {
		console.error(e)
		next(e)
	}
})

app.all('/auth/me', (req, res, next) => {
	try {
		if (req.method !== 'GET') {
			res.status(405).json({ message: 'Method not allowed' })
		}
	} catch (e) {
		console.error(e)
		next(e)
	}
})

app.post('/auth/register', validateFormData, async (req, res, next) => {
	try {
		if (typeof req.body !== 'object') {
			return res.status(400).json({ message: 'Invalid request body' })
		}
		const { email, password, name, birthdate, company, eyeColor, phone, address } = req.body
		const { first, last } = name
		if (moment(birthdate, 'YYYY-MM-DD', true).isValid() === false) {
			return res.status(400).json({ message: 'Birthdate must be in the format YYYY-MM-DD' })
		}
		// Check if email is already taken
		const users = db.data.users || []
		const user = users.find(user => user.email === email.trim())
		if (user) {
			return res.status(400).json({ message: 'Email is already taken' })
		}

		// Create user
		const salt = crypto.randomBytes(16).toString('hex')
		const hash = crypto.pbkdf2Sync(password, salt, 10, 64, 'sha1').toString('hex')
		const newUser = {
			_id: uuidv4(),
			guid: uuidv4(),
			isActive: true,
			balance: '$0.00',
			picture: 'https://randomuser.me/api',
			age: moment().diff(birthdate.slice(0, 10), 'years', false),
			eyeColor: eyeColor?.trim(),
			name: {
				first: first.trim(),
				last: last.trim(),
			},
			company: company?.trim(),
			email: email.trim(),
			phone: phone?.trim(),
			address: address?.trim(),
			password: hash,
			salt,
		}
		users.push(newUser)
		db.write()

		const token = process.env.JWT_SECRET && jwt.sign(newUser, process.env.JWT_SECRET)
		if (token) {
			return res.json({ token, user: { ...newUser, password: '', salt: '' } })
		} else {
			return res.status(500).json({ message: 'Error creating token' })
		}
	} catch (e) {
		console.error(e)
		next(e)
	}
})

app.all('/auth/register', (req, res, next) => {
	try {
		if (req.method !== 'POST') {
			res.status(405).json({ message: 'Method not allowed' })
		}
	} catch (e) {
		console.error(e)
		next(e)
	}
})

app.post('/auth/login', async (req, res, next) => {
	try {
		if (typeof req.body !== 'object' || !req.body.email || !req.body.password) {
			return res.status(400).json({ message: 'Invalid request body' })
		}
		const { email, password } = req.body
		const user = email && password && db.data?.users.find(u => u.email === email.trim())
		if (!user) {
			return res.status(400).json({ message: 'User not found' })
		}

		const hash = crypto.pbkdf2Sync(password, user.salt, 10, 64, 'sha1').toString('hex')
		if (hash !== user.password) {
			return res.status(400).json({ message: 'Password is incorrect' })
		}

		const token =
			process.env.JWT_SECRET && jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1d' })

		return res.json({ token, user: { ...user, password: '', salt: '' } })
	} catch (e) {
		console.error(e)
		next(e)
	}
})

app.all('/auth/login', (req, res, next) => {
	try {
		if (req.method !== 'POST') {
			res.status(405).json({ message: 'Method not allowed' })
		}
	} catch (e) {
		console.error(e)
		next(e)
	}
})

app.get('/auth/logout', (req, res, next) => {
	try {
		res.json({ message: 'User logged out' })
	} catch (e) {
		console.error(e)
		next(e)
	}
})

app.all('/auth/logout', (req, res, next) => {
	try {
		if (req.method !== 'GET') {
			res.status(405).json({ message: 'Method not allowed' })
		}
	} catch (e) {
		console.error(e)
		next(e)
	}
})

app.get('/users', authenticateUser, (req, res, next) => {
	try {
		const { page = 1, limit = 10 } = req.query
		const startIndex = (+page - 1) * +limit
		const endIndex = +page * +limit
		const results = {}

		if (db.data && db.data.users) {
			if (endIndex < db.data.users.length) {
				results.next = {
					page: +page + 1,
					limit,
				}
			}
		}

		if (startIndex > 0) {
			results.previous = {
				page: +page - 1,
				limit,
			}
		}

		results.results = db.data?.users.slice(startIndex, endIndex).map(result => {
			return { ...result, password: '', salt: '' }
		})

		return res.json(results)
	} catch (e) {
		console.error(e)
		next(e)
	}
})

app.all('/users', (req, res, next) => {
	try {
		if (req.method !== 'GET') {
			res.status(405).json({ message: 'Method not allowed' })
		}
	} catch (e) {
		console.error(e)
		next(e)
	}
})

app.get('/users/:id', authenticateUser, (req, res, next) => {
	try {
		const user = db.data?.users.find(u => u._id === req.params.id)
		if (!user) {
			return res.status(400).json({ message: 'User not found' })
		}

		return res.json({ ...user, password: '', salt: '' })
	} catch (e) {
		console.error(e)
		next(e)
	}
})

app.put('/users/:id', authenticateUser, validateFormData, async (req, res, next) => {
	try {
		const user = db.data?.users.find(u => u._id === req.params.id)
		if (!user) return res.status(400).json({ message: 'User not found' })

		const { email, name, age, password, company, eyeColor, phone, address } = req.body

		user.email = email.trim()
		user.name.first = name.first.trim()
		user.name.last = name.last.trim()
		user.age = age
		if (company) user.company = company.trim()
		if (eyeColor) user.eyeColor = eyeColor.trim()
		if (phone) user.phone = phone.trim()
		if (address) user.address = address.trim()
		if (password) {
			user.password = crypto.pbkdf2Sync(password, user.salt, 10, 64, 'sha1').toString('hex')
		}

		await db.write()

		req.user = user
		return res.json({ user: { ...user, password: '', salt: '' } })
	} catch (e) {
		console.error(e)
		next(e)
	}
})

app.delete('/users/:id', authenticateUser, async (req, res, next) => {
	try {
		const user = db.data?.users.find(u => u._id === req.params.id)
		if (!user) {
			return res.status(400).json({ message: 'User not found' })
		}

		if (db.data) {
			db.data.users = db.data?.users.filter(u => u._id !== req.params.id)
			await db.write()
			return res.json({ message: 'User deleted successfully' })
		}

		return res.status(500).json({ message: 'Something went wrong' })
	} catch (e) {
		console.error(e)
		next(e)
	}
})

app.all('/users/:id', (req, res, next) => {
	try {
		if (req.method !== 'GET' && req.method !== 'PUT' && req.method !== 'DELETE') {
			res.status(405).json({ message: 'Method not allowed' })
		}
	} catch (e) {
		console.error(e)
		next(e)
	}
})

app.use('*', (req, res, next) => {
	try {
		res.status(404).json({ message: 'Not found' })
	} catch (e) {
		console.error(e)
		next(e)
	}
})

app.use((e, req, res, next) => {
	console.error(e)
	if (res.headersSent) {
		return next(e)
	}
	res.status(500).json({ message: `Something went wrong. ${e.message}` })
})

app.listen(5001, () => {
	console.log('Server started on port 5001')
})

export default app
