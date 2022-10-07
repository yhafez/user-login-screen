import chai from 'chai'
import chaiHttp from 'chai-http'
import { faker } from '@faker-js/faker'
import moment from 'moment'
import jwt from 'jsonwebtoken'
import { v4 as uuid } from 'uuid'

chai.use(chaiHttp)
const expect = chai.expect
const baseUrl = 'http://localhost:5001'
const request = chai.request(baseUrl)

const eyeColors = [
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
]
const user = {
	_id: uuid(),
	email: faker.internet.email(),
	password: faker.internet.password(12, false, /[A-Z]/, 'Aa1!'),
	name: {
		first: faker.name.firstName(),
		last: faker.name.lastName(),
	},
	firstName: faker.name.firstName(),
	lastName: faker.name.lastName(),
	birthdate: moment(faker.date.past(10, 2000)).format('YYYY-MM-DD'),
	company: faker.company.name(),
	eyeColor: eyeColors[Math.floor(Math.random() * eyeColors.length)],
	phone: faker.phone.number('+1-###-###-###'),
	address: faker.address.streetAddress(),
}
const urlRegex = /^https?:\/\/[^\s$.?#].[^\s]*$/
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const addressRegex = /^[0-9]+ [a-zA-Z ]+$/
const token = jwt.sign(
	{ _id: user._id, email: user.email, user: { ...user, id: user._id, name: user.firstName } },
	process.env.JWT_SECRET,
	{
		expiresIn: '1m',
	},
)

describe('POST /auth/register', () => {
	it('should create a new user', async () => {
		const res = await request.post('/auth/register').send(user)
		expect(res).to.have.status(200)
		expect(res.body).to.be.an('object')
		expect(res.body).to.have.property('user')
		expect(res.body.user).to.have.property('_id')
		expect(res.body.user).to.have.property('guid')
		expect(res.body.user).to.have.property('isActive')
		expect(res.body.user).to.have.property('balance')
		expect(res.body.user).to.have.property('picture')
		expect(res.body.user).to.have.property('age')
		expect(res.body.user).to.have.property('name')
		expect(res.body.user.name).to.have.property('first')
		expect(res.body.user.name).to.have.property('last')
		expect(res.body.user).to.have.property('email')
		expect(res.body.user).to.have.property('password')
		expect(res.body.user).to.have.property('company')
		expect(res.body.user).to.have.property('eyeColor')
		expect(res.body.user).to.have.property('phone')
		expect(res.body.user).to.have.property('address')
		expect(res.body.user).to.have.property('salt')
		expect(res.body).to.have.property('token')

		expect(res.body.user._id).to.be.a('string')
		expect(res.body.user.guid).to.be.a('string')
		expect(res.body.user.isActive).to.be.a('boolean')
		expect(res.body.user.balance).to.be.a('string')
		expect(res.body.user.picture).to.be.a('string')
		expect(res.body.user.age).to.be.a('number')
		expect(res.body.user.name.first).to.be.a('string')
		expect(res.body.user.name.last).to.be.a('string')
		expect(res.body.user.email).to.be.a('string')
		expect(res.body.user.password).to.be.a('string')
		expect(res.body.user.company).to.be.a('string')
		expect(res.body.user.eyeColor).to.be.a('string')
		expect(res.body.user.phone).to.be.a('string')
		expect(res.body.user.address).to.be.a('string')
		expect(res.body.user.salt).to.be.a('string')
		expect(res.body.token).to.be.a('string')

		expect(res.body.user._id).to.not.be.empty
		expect(res.body.user.guid).to.not.be.empty
		expect(res.body.user.balance).to.not.be.empty
		expect(res.body.user.picture).to.not.be.empty
		expect(res.body.user.name.first).to.not.be.empty
		expect(res.body.user.name.last).to.not.be.empty
		expect(res.body.user.email).to.not.be.empty
		expect(res.body.user.password).to.be.empty
		expect(res.body.user.company).to.not.be.empty
		expect(res.body.user.eyeColor).to.not.be.empty
		expect(res.body.user.phone).to.not.be.empty
		expect(res.body.user.address).to.not.be.empty
		expect(res.body.user.salt).to.be.empty
		expect(res.body.token).to.not.be.empty

		expect(res.body.user.email).to.equal(user.email)
		expect(res.body.user.name.first).to.equal(user.name.first)
		expect(res.body.user.name.last).to.equal(user.name.last)
		expect(res.body.user.company).to.equal(user.company)
		expect(res.body.user.eyeColor).to.equal(user.eyeColor)
		expect(res.body.user.phone).to.equal(user.phone)
		expect(res.body.user.address).to.equal(user.address)
		expect(res.body.user.age).to.equal(moment().diff(user.birthdate, 'years'))

		expect(res.body.user.isActive).to.be.true

		expect(res.body.user.age).to.be.at.least(18)
		expect(res.body.user.age).to.be.at.most(100)

		expect(res.body.user.balance).to.equal('$0.00')
		expect(res.body.user.picture).to.match(urlRegex)
		expect(res.body.user.email).to.match(emailRegex)
		expect(res.body.user.address).to.match(addressRegex)

		user._id = res.body.user._id
	})

	it('should return 400 if user already exists', async () => {
		const res = await request.post('/auth/register').send(user)
		expect(res).to.have.status(400)
		expect(res.body).to.be.an('object')
		expect(res.body).to.have.property('message')
		expect(res.body.message).to.be.a('string')
		expect(res.body.message).to.equal('Email is already taken')
	})

	it('should return 400 if email is invalid', async () => {
		const res = await request.post('/auth/register').send({
			...user,
			email: 'invalidEmail',
		})
		expect(res).to.have.status(400)
		expect(res.body).to.be.an('object')
		expect(res.body).to.have.property('message')
		expect(res.body.message).to.be.a('string')
		expect(res.body.message).to.equal('Please enter a valid email')

		const res2 = await request.post('/auth/register').send({
			...user,
			email: 'invalidEmail@',
		})
		expect(res2).to.have.status(400)

		const res3 = await request.post('/auth/register').send({
			...user,
			email: 'invalidEmail@invalidEmail',
		})
		expect(res3).to.have.status(400)

		const res4 = await request.post('/auth/register').send({
			...user,
			email: 'invalidEmail@invalidEmail.',
		})
		expect(res4).to.have.status(400)

		const res5 = await request.post('/auth/register').send({
			...user,
			email: '',
		})
		expect(res5).to.have.status(400)
	})

	it('should return 400 if password is invalid', async () => {
		const res = await request.post('/auth/register').send({
			...user,
			email: faker.internet.email(),
			password: '123',
		})
		expect(res).to.have.status(400)
		expect(res.body).to.be.an('object')
		expect(res.body).to.have.property('message')
		expect(res.body.message).to.be.a('string')
		expect(res.body.message).to.equal('Password is too short')

		const res2 = await request.post('/auth/register').send({
			...user,
			email: faker.internet.email(),
			password: '',
		})
		expect(res2).to.have.status(400)
	})

	it('should return 400 if firstName is invalid', async () => {
		const res = await request.post('/auth/register').send({
			...user,
			email: faker.internet.email(),
			name: {
				first: '',
				last: user.lastName,
			},
		})
		expect(res).to.have.status(400)
		expect(res.body).to.be.an('object')
		expect(res.body).to.have.property('message')
		expect(res.body.message).to.be.a('string')
		expect(res.body.message).to.equal('Please fill all the fields')
	})

	it('should return 400 if lastName is invalid', async () => {
		const res = await request.post('/auth/register').send({
			...user,
			email: faker.internet.email(),
			name: {
				first: user.firstName,
				last: '',
			},
		})
		expect(res).to.have.status(400)
		expect(res.body).to.be.an('object')
		expect(res.body).to.have.property('message')
		expect(res.body.message).to.be.a('string')
		expect(res.body.message).to.equal('Please fill all the fields')
	})

	it('should return 400 if birthdate is invalid', async () => {
		const res = await request.post('/auth/register').send({
			...user,
			email: faker.internet.email(),
			birthdate: 'invalidDate',
		})
		expect(res).to.have.status(400)
		expect(res.body).to.be.an('object')
		expect(res.body).to.have.property('message')
		expect(res.body.message).to.be.a('string')
		expect(res.body.message).to.equal('Birthdate is not valid')

		const res2 = await request.post('/auth/register').send({
			...user,
			email: faker.internet.email(),
			birthdate: '',
		})
		expect(res2).to.have.status(400)
	})
})

describe('POST /auth/login', () => {
	it('should return 200 if credentials are valid', async () => {
		const res = await request.post('/auth/login').send({
			email: user.email,
			password: user.password,
		})
		expect(res).to.have.status(200)
		expect(res.body).to.be.an('object')
		expect(res.body).to.have.property('token')
		expect(res.body.token).to.be.a('string')
	})

	it('should return 400 if email is invalid', async () => {
		const res = await request.post('/auth/login').send({
			email: 'invalidEmail',
			password: user.password,
		})
		expect(res).to.have.status(400)
		expect(res.body).to.be.an('object')
		expect(res.body).to.have.property('message')
		expect(res.body.message).to.be.a('string')
		expect(res.body.message).to.equal('User not found')

		const res2 = await request.post('/auth/login').send({
			email: '',
			password: user.password,
		})
		expect(res2).to.have.status(400)
	})

	it('should return 400 if password is invalid', async () => {
		const res = await request.post('/auth/login').send({
			email: user.email,
			password: 'invalidPassword',
		})
		expect(res).to.have.status(400)
		expect(res.body).to.be.an('object')
		expect(res.body).to.have.property('message')
		expect(res.body.message).to.be.a('string')
		expect(res.body.message).to.equal('Password is incorrect')

		const res2 = await request.post('/auth/login').send({
			email: user.email,
			password: '',
		})
		expect(res2).to.have.status(400)
	})
})

describe('GET /auth/me', () => {
	it('should return 200 if token is valid', async () => {
		const res = await request.get('/auth/me').set('Authorization', `Bearer ${token}`)
		expect(res).to.have.status(200)
		expect(res.body).to.be.an('object')
		expect(res.body).to.have.property('user')
		expect(res.body.user).to.be.an('object')
		expect(res.body.user).to.have.property('id')
		expect(res.body.user.id).to.be.a('string')
		expect(res.body.user).to.have.property('name')
		expect(res.body.user.name).to.be.a('string')
		expect(res.body.user).to.have.property('email')
		expect(res.body.user.email).to.be.a('string')
		expect(res.body.user).to.have.property('birthdate')
		expect(res.body.user.birthdate).to.be.a('string')
		expect(res.body.user).to.have.property('company')
		expect(res.body.user.company).to.be.a('string')
		expect(res.body.user).to.have.property('eyeColor')
		expect(res.body.user.eyeColor).to.be.a('string')
		expect(res.body.user).to.have.property('phone')
		expect(res.body.user.phone).to.be.a('string')
		expect(res.body.user).to.have.property('address')
		expect(res.body.user.address).to.be.a('string')
	})

	it('should return 403 if token is invalid', async () => {
		const res = await request.get('/auth/me').set('Authorization', 'Bearer invalidToken')
		expect(res).to.have.status(403)
		expect(res.body).to.be.an('object')
		console.log(res.body)
		expect(res.body).to.have.property('message')
		expect(res.body.message).to.be.a('string')
		expect(res.body.message).to.equal('Forbidden')
	})
})

describe('GET /auth/logout', () => {
	it('should return 200', async () => {
		const res = await request.get('/auth/logout')
		expect(res).to.have.status(200)
		expect(res.body).to.be.an('object')
		expect(res.body).to.have.property('message')
		expect(res.body.message).to.be.a('string')
		expect(res.body.message).to.equal('User logged out')
	})
})

describe('GET /users', () => {
	it('should return 200', async () => {
		const res = await request.get('/users').set('Authorization', `Bearer ${token}`)
		expect(res).to.have.status(200)
		expect(res.body).to.be.an('object')
		expect(res.body).to.have.property('results')
		expect(res.body.results).to.be.an('array')
		expect(res.body.results[0]).to.have.property('_id')
		expect(res.body.results[0]._id).to.be.a('string')
		expect(res.body.results[0]).to.have.property('guid')
		expect(res.body.results[0].guid).to.be.a('string')
		expect(res.body.results[0]).to.have.property('isActive')
		expect(res.body.results[0].isActive).to.be.a('boolean')
		expect(res.body.results[0]).to.have.property('balance')
		expect(res.body.results[0].balance).to.be.a('string')
		expect(res.body.results[0]).to.have.property('picture')
		expect(res.body.results[0].picture).to.be.a('string')
		expect(res.body.results[0]).to.have.property('age')
		expect(res.body.results[0].age).to.be.a('number')
		expect(res.body.results[0]).to.have.property('eyeColor')
		expect(res.body.results[0].eyeColor).to.be.a('string')
		expect(res.body.results[0]).to.have.property('name')
		expect(res.body.results[0].name).to.be.an('object')
		expect(res.body.results[0].name).to.have.property('first')
		expect(res.body.results[0].name.first).to.be.a('string')
		expect(res.body.results[0].name).to.have.property('last')
		expect(res.body.results[0].name.last).to.be.a('string')
		expect(res.body.results[0]).to.have.property('password')
		expect(res.body.results[0].password).to.be.a('string')
		expect(res.body.results[0].password).to.be.empty
		expect(res.body.results[0]).to.have.property('email')
		expect(res.body.results[0].email).to.be.a('string')
		expect(res.body.results[0]).to.have.property('phone')
		expect(res.body.results[0].phone).to.be.a('string')
		expect(res.body.results[0]).to.have.property('address')
		expect(res.body.results[0].address).to.be.a('string')
		expect(res.body.results[0]).to.have.property('salt')
		expect(res.body.results[0].salt).to.be.a('string')
		expect(res.body.results[0].salt).to.be.empty
	})

	it('should return 200 if query is valid', async () => {
		const res = await request.get('/users?name=John').set('Authorization', `Bearer ${token}`)
		expect(res).to.have.status(200)
		expect(res.body).to.be.an('object')
		expect(res.body).to.have.property('results')
		expect(res.body.results).to.be.an('array')
		expect(res.body.results[0]).to.have.property('_id')
		expect(res.body.results[0]._id).to.be.a('string')
		expect(res.body.results[0]).to.have.property('guid')
		expect(res.body.results[0].guid).to.be.a('string')
		expect(res.body.results[0]).to.have.property('isActive')
		expect(res.body.results[0].isActive).to.be.a('boolean')
		expect(res.body.results[0]).to.have.property('balance')
		expect(res.body.results[0].balance).to.be.a('string')
		expect(res.body.results[0]).to.have.property('picture')
		expect(res.body.results[0].picture).to.be.a('string')
		expect(res.body.results[0]).to.have.property('age')
		expect(res.body.results[0].age).to.be.a('number')
		expect(res.body.results[0]).to.have.property('eyeColor')
		expect(res.body.results[0].eyeColor).to.be.a('string')
		expect(res.body.results[0]).to.have.property('name')
		expect(res.body.results[0].name).to.be.an('object')
		expect(res.body.results[0].name).to.have.property('first')
		expect(res.body.results[0].name.first).to.be.a('string')
		expect(res.body.results[0].name).to.have.property('last')
		expect(res.body.results[0].name.last).to.be.a('string')
		expect(res.body.results[0]).to.have.property('password')
		expect(res.body.results[0].password).to.be.a('string')
		expect(res.body.results[0].password).to.be.empty
		expect(res.body.results[0]).to.have.property('email')
		expect(res.body.results[0].email).to.be.a('string')
		expect(res.body.results[0]).to.have.property('phone')
		expect(res.body.results[0].phone).to.be.a('string')
		expect(res.body.results[0]).to.have.property('address')
		expect(res.body.results[0].address).to.be.a('string')
		expect(res.body.results[0]).to.have.property('salt')
		expect(res.body.results[0].salt).to.be.a('string')
		expect(res.body.results[0].salt).to.be.empty
	})
})

describe('GET /users/:id', () => {
	it('should return 401 if token is not provided', async () => {
		const res = await request.get(`/users/${user._id}`)
		expect(res).to.have.status(401)
		expect(res.body).to.be.an('object')
		expect(res.body).to.have.property('message')
		expect(res.body.message).to.be.a('string')
		expect(res.body.message).to.equal('Unauthorized')
	})

	it('should return 403 if token is invalid', async () => {
		const res = await request.get(`/users/${user._id}`).set('Authorization', 'Bearer invalidToken')
		expect(res).to.have.status(403)
		expect(res.body).to.be.an('object')
		expect(res.body).to.have.property('message')
		expect(res.body.message).to.be.a('string')
		expect(res.body.message).to.equal('Forbidden')
	})

	it('should return 400 if user is not found', async () => {
		const res = await request.get('/users/invalidId').set('Authorization', `Bearer ${token}`)
		expect(res).to.have.status(400)
		expect(res.body).to.be.an('object')
		expect(res.body).to.have.property('message')
		expect(res.body.message).to.be.a('string')
		expect(res.body.message).to.equal('User not found')
	})

	it('should return 200 if user is found', async () => {
		const res = await request.get(`/users/${user._id}`).set('Authorization', `Bearer ${token}`)
		expect(res).to.have.status(200)
		expect(res.body).to.be.an('object')
		expect(res.body).to.have.property('_id')
		expect(res.body._id).to.be.a('string')
		expect(res.body).to.have.property('guid')
		expect(res.body.guid).to.be.a('string')
		expect(res.body).to.have.property('isActive')
		expect(res.body.isActive).to.be.a('boolean')
		expect(res.body).to.have.property('balance')
		expect(res.body.balance).to.be.a('string')
		expect(res.body).to.have.property('picture')
		expect(res.body.picture).to.be.a('string')
		expect(res.body).to.have.property('age')
		expect(res.body.age).to.be.a('number')
		expect(res.body).to.have.property('eyeColor')
		expect(res.body.eyeColor).to.be.a('string')
		expect(res.body).to.have.property('name')
		expect(res.body.name).to.be.an('object')
		expect(res.body.name).to.have.property('first')
		expect(res.body.name.first).to.be.a('string')
		expect(res.body.name).to.have.property('last')
		expect(res.body.name.last).to.be.a('string')
		expect(res.body).to.have.property('company')
		expect(res.body.company).to.be.a('string')
		expect(res.body).to.have.property('email')
		expect(res.body.email).to.be.a('string')
		expect(res.body).to.have.property('phone')
		expect(res.body.phone).to.be.a('string')
		expect(res.body).to.have.property('address')
		expect(res.body.address).to.be.a('string')
	})
})

describe('PUT /users/:id', () => {
	it('should return 401 if token is not provided', async () => {
		const res = await request.put(`/users/${user._id}`).send({
			name: {
				first: 'John',
				last: 'Doe',
			},
			birthdate: '1990-01-01',
			password: '123456789aA!',
			email: user.email,
		})
		expect(res).to.have.status(401)
		expect(res.body).to.be.an('object')
		expect(res.body).to.have.property('message')
		expect(res.body.message).to.be.a('string')
		expect(res.body.message).to.equal('Unauthorized')
	})

	it('should return 403 if token is invalid', async () => {
		const res = await request
			.put(`/users/${user._id}`)
			.set('Authorization', 'Bearer invalidToken')
			.send({
				name: {
					first: 'John',
					last: 'Doe',
				},
				birthdate: '1990-01-01',
				password: '123456789aA!',
				email: user.email,
			})
		expect(res).to.have.status(403)
		expect(res.body).to.be.an('object')
		expect(res.body).to.have.property('message')
		expect(res.body.message).to.be.a('string')
		expect(res.body.message).to.equal('Forbidden')
	})

	it('should return 400 if id is not a valid uuid', async () => {
		const res = await request
			.put('/users/invalidId')
			.set('Authorization', `Bearer ${token}`)
			.send({
				name: {
					first: 'John',
					last: 'Doe',
				},
				birthdate: '1990-01-01',
				password: '123456789aA!',
				email: user.email,
			})
		expect(res).to.have.status(400)
		expect(res.body).to.be.an('object')
		expect(res.body).to.have.property('message')
		expect(res.body.message).to.be.a('string')
		expect(res.body.message).to.equal('User not found')
	})

	it('should return 200 if user is found', async () => {
		const res = await request
			.put(`/users/${user._id}`)
			.set('Authorization', `Bearer ${token}`)
			.send({
				name: {
					first: 'John',
					last: 'Doe',
				},
				birthdate: '1990-01-01',
				password: '123456789aA!',
				email: user.email,
			})
		expect(res).to.have.status(200)
		expect(res.body).to.be.an('object')
		expect(res.body).to.have.property('_id')
		expect(res.body._id).to.be.a('string')
		expect(res.body).to.have.property('guid')
		expect(res.body.guid).to.be.a('string')
		expect(res.body).to.have.property('isActive')
		expect(res.body.isActive).to.be.a('boolean')
		expect(res.body).to.have.property('balance')
		expect(res.body.balance).to.be.a('string')
		expect(res.body).to.have.property('picture')
		expect(res.body.picture).to.be.a('string')
		expect(res.body).to.have.property('age')
		expect(res.body.age).to.be.a('number')
		expect(res.body).to.have.property('eyeColor')
		expect(res.body.eyeColor).to.be.a('string')
		expect(res.body).to.have.property('name')
		expect(res.body.name).to.be.an('object')
		expect(res.body.name).to.have.property('first')
		expect(res.body.name.first).to.be.a('string')
		expect(res.body.name).to.have.property('last')
		expect(res.body.name.last).to.be.a('string')
		expect(res.body).to.have.property('company')
		expect(res.body.company).to.be.a('string')
		expect(res.body).to.have.property('email')
		expect(res.body.email).to.be.a('string')
		expect(res.body).to.have.property('phone')
		expect(res.body.phone).to.be.a('string')
		expect(res.body).to.have.property('address')
		expect(res.body.address).to.be.a('string')
	})

	it('should return 200 if user is found and update only the fields sent', async () => {
		const res = await request
			.put(`/users/${user._id}`)
			.set('Authorization', `Bearer ${token}`)
			.send({
				name: {
					first: 'John',
					last: 'Doe',
				},
				birthdate: '1990-01-01',
				password: '123456789aA!',
				email: user.email,
			})
		expect(res).to.have.status(200)
		expect(res.body).to.be.an('object')
		expect(res.body).to.have.property('_id')
		expect(res.body._id).to.be.a('string')
		expect(res.body).to.have.property('guid')
		expect(res.body.guid).to.be.a('string')
		expect(res.body).to.have.property('isActive')
		expect(res.body.isActive).to.be.a('boolean')
		expect(res.body).to.have.property('balance')
		expect(res.body.balance).to.be.a('string')
		expect(res.body).to.have.property('picture')
		expect(res.body.picture).to.be.a('string')
		expect(res.body).to.have.property('age')
		expect(res.body.age).to.be.a('number')
		expect(res.body).to.have.property('eyeColor')
		expect(res.body.eyeColor).to.be.a('string')
		expect(res.body).to.have.property('name')
		expect(res.body.name).to.be.an('object')
		expect(res.body.name).to.have.property('first')
		expect(res.body.name.first).to.be.a('string')
		expect(res.body.name).to.have.property('last')
		expect(res.body.name.last).to.be.a('string')
		expect(res.body).to.have.property('company')
		expect(res.body.company).to.be.a('string')
		expect(res.body).to.have.property('email')
		expect(res.body.email).to.be.a('string')
		expect(res.body).to.have.property('phone')
		expect(res.body.phone).to.be.a('string')
		expect(res.body).to.have.property('address')
		expect(res.body.address).to.be.a('string')
	})
})

describe('DELETE /users/:id', () => {
	let newUser
	beforeEach(async () => {
		newUser = await request.post('/auth/register').send({
			email: faker.internet.email(),
			password: '123456aA!',
			name: {
				first: 'test',
				last: 'test',
			},
			birthdate: '1990-01-01',
		})
	})

	it('should return 401 if no token is provided', async () => {
		const res = await request.delete(`/users/${newUser.body.user._id}`)
		expect(res).to.have.status(401)
		expect(res.body).to.be.an('object')
		expect(res.body).to.have.property('message')
		expect(res.body.message).to.be.a('string')
		expect(res.body.message).to.be.equal('Unauthorized')
	})

	it('should return 403 if token is invalid', async () => {
		const res = await request
			.delete(`/users/${newUser.body.user._id}`)
			.set('Authorization', `Bearer ${token}1`)
		expect(res).to.have.status(403)
		expect(res.body).to.be.an('object')
		expect(res.body).to.have.property('message')
		expect(res.body.message).to.be.a('string')
		expect(res.body.message).to.be.equal('Forbidden')
	})

	it('should return 400 if user is not found', async () => {
		const res = await request.delete(`/users/invalidId`).set('Authorization', `Bearer ${token}`)
		expect(res).to.have.status(400)
		expect(res.body).to.be.an('object')
		expect(res.body).to.have.property('message')
		expect(res.body.message).to.be.a('string')
		expect(res.body.message).to.be.equal('User not found')
	})

	it('should return 200 if user is found', async () => {
		const newUser = await request.post('/auth/register').send({
			email: faker.internet.email(),
			password: '123456aA!',
			name: {
				first: 'test',
				last: 'test',
			},
			birthdate: '1990-01-01',
		})
		const res = await request
			.delete(`/users/${newUser.body.user._id}`)
			.set('Authorization', `Bearer ${token}`)
		expect(res).to.have.status(200)
		expect(res.body).to.be.an('object')
		expect(res.body).to.have.property('message')
		expect(res.body.message).to.be.a('string')
		expect(res.body.message).to.be.equal('User deleted successfully')
	})
})
