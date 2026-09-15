export default {
    testEnvironment: 'node',
    transform: {},
    clearMocks: true,
    collectCoverageFrom: [
        'src/**/*.js',
        '!src/lib/prisma.js'
    ]
};