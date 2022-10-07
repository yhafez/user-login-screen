import { createElement } from 'react'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { rootReducer } from '../store'

import { RootState } from '../store'
import App from '../App'
import Input from '../components/Input'
import { Login, Profile, Signup } from '../pages'

import { InputProps } from '../components/Input'

export interface ITest {
	name: string
	component: TComponent
	props?: TProps
}

export type TComponent = typeof Input | typeof Login | typeof Profile | typeof Signup | typeof App
export type TProps = InputProps

const tests: ITest[] = [
	{
		name: 'Input',
		component: Input,
		props: {
			id: 'test',
			name: 'test',
			type: 'text',
			value: 'test',
			onChange: () => {},
			error: false,
			helperText: 'test',
			margin: false,
			required: false,
			fullWidth: false,
			customLabel: 'test',
			disabled: false,
			onKeyDown: () => {},
		},
	},
	{
		name: 'Login',
		component: Login,
	},
	{
		name: 'Profile',
		component: Profile,
	},
	{
		name: 'Signup',
		component: Signup,
	},
]

export const renderWithRouterAndStore = (component: TComponent, props?: TProps) => {
	const store = configureStore({
		reducer: rootReducer,
		preloadedState: {} as RootState,
	})

	return render(
		<Provider store={store}>
			<MemoryRouter>{createElement(component, props)}</MemoryRouter>
		</Provider>,
	)
}

beforeEach(() => {
	jest.resetModules()
})

beforeAll(() => {
	jest.spyOn(console, 'error').mockImplementation(() => {})
})

afterAll(() => {
	jest.restoreAllMocks()
})

afterEach(() => {
	jest.clearAllMocks()
})

describe('App', () => {
	tests.forEach(test => {
		it(`renders ${test.name} without crashing`, () => {
			renderWithRouterAndStore(test.component, test.props)
		})

		it(`renders ${test.name} correctly`, () => {
			const { container } = renderWithRouterAndStore(test.component, test.props)
			expect(container).toMatchSnapshot()
		})
	})
})
