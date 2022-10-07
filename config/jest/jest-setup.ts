import '@testing-library/jest-dom'

window.matchMedia =
	window.matchMedia ||
	function () {
		return {
			matches: false,
			addListener: function () {},
			removeListener: function () {},
		}
	}

Object.defineProperty(URL, 'createObjectURL', {
	writable: true,
	value: jest.fn(),
})
