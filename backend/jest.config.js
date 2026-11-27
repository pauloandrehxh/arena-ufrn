export default {
    testEnvironment: 'node',
    transform: {},
    clearMocks: true,
    modulePathIgnorePatterns: [
        '<rootDir>/.stryker-tmp/',
    ],
    testPathIgnorePatterns: [
        '/node_modules/',
        '/.stryker-tmp/',
    ],
    collectCoverageFrom: [
        'src/**/*.js',
        '!src/lib/prisma.js'
    ]
};