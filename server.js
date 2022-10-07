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

app.get('/auth/me', authenticateUser, (req, res) => {
	res.json({ user: req.user })
})

app.post('/auth/register', validateFormData, async (req, res, next) => {
	try {
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
			age: moment().diff(birthdate.slice(0, 10), 'years', false, 'YYYY-MM-DD'),
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

		// Create token
		const token = jwt.sign(newUser, process.env.JWT_SECRET)

		return res.json({ token, user: { ...newUser, password: '', salt: '' } })
	} catch (err) {
		console.error(error)
		next(err)
	}
})

app.post('/auth/login', async (req, res) => {
	try {
		const { email, password } = req.body
		const user = db.data?.users.find(u => u.email === email.trim())
		if (!user) {
			return res.status(400).json({ message: 'User not found' })
		}

		const hash = crypto.pbkdf2Sync(password, user.salt, 10, 64, 'sha1').toString('hex')
		if (hash !== user.password) {
			return res.status(400).json({ message: 'Password is incorrect' })
		}

		const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1d' })

		return res.json({ token, user: { ...user, password: '', salt: '' } })
	} catch (err) {
		next(err)
	}
})

app.get('/auth/logout', (req, res, next) => {
	try {
		res.json({ message: 'User logged out' })
	} catch (err) {
		next(err)
	}
})

app.get('/users', authenticateUser, (req, res, next) => {
	try {
		const { page = 1, limit = 10 } = req.query
		const startIndex = (page - 1) * limit
		const endIndex = page * limit
		const results = {}

		if (db.data && db.data.users) {
			if (endIndex < db.data.users.length) {
				results.next = {
					page: page + 1,
					limit,
				}
			}
		}

		if (startIndex > 0) {
			results.previous = {
				page: page - 1,
				limit,
			}
		}

		results.results = db.data?.users.slice(startIndex, endIndex).map(result => {
			return { ...result, password: '', salt: '' }
		})

		return res.json(results)
	} catch (err) {
		next(err)
	}
})

app.get('/users/:id', authenticateUser, (req, res, next) => {
	try {
		const user = db.data?.users.find(u => u._id === req.params.id)
		if (!user) {
			return res.status(400).json({ message: 'User not found' })
		}

		return res.json({ ...user, password: '', salt: '' })
	} catch (err) {
		next(err)
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
	} catch (err) {
		console.log(err)
		next(err)
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
	} catch (err) {
		next(err)
	}
})

app.use('*', (req, res) => {
	res.status(404).json({ message: 'Not found' })
})

app.use((err, req, res, next) => {
	console.error(err)
	res.status(500).json({ message: 'Something went wrong' })
})

app.listen(5001, () => {
	console.log('Server started on port 5001')
})

export default app
