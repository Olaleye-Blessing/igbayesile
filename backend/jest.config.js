/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  roots: ['<rootDir>'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.ts?$',
  // transform: {
  //   // '^.+\\.[tj]sx?$' to process js/ts with `ts-jest`
  //   // '^.+\\.m?[tj]sx?$' to process js/ts/mjs/mts with `ts-jest`
  //   '^.+\\.tsx?$': [
  //     'ts-jest',
  //     {
  //       // ts-jest configuration goes here
  //     },
  //   ],
  // },
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  // forceExit: true,
  // clearMocks: true
};
