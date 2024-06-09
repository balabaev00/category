module.exports = {
    moduleFileExtensions: [
        'js',
        'json',
        'ts',
    ],
    testTimeout: 60000,
    rootDir: '.',
    testRegex: '.*\\.(test|spec)\\.ts$',
    transform: {
        '.+\\.(t|j)s$': 'ts-jest',
    },
    'coverageReporters': [
        'text-summary',
        'text',
        'lcov',
    ],
    collectCoverageFrom: [
        '**/*.(t|j)s',
    ],
    coverageDirectory: '../coverage',
    testEnvironment: 'node',
    moduleNameMapper: {
        '^src/(.*)$': '<rootDir>/src/$1',
        '^test/(.*)$': '<rootDir>/test/$1',
    },
};
