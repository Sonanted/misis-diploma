/** @type {import('jest').Config} */
module.exports = {
	testEnvironment: 'jest-environment-jsdom',
	setupFilesAfterFramework: ['<rootDir>/src/test/setup.ts'],
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/src/$1',
	},
	transform: {
		'^.+\\.tsx?$': ['ts-jest', {
			tsconfig: { jsx: 'react-jsx' },
			diagnostics: false,
		}],
	},
};
