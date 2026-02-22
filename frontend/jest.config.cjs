module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/jest.setup.js'],
  moduleNameMapper: {
    '\\.(scss|css)$': 'identity-obj-proxy'
  },
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest'
  }
};
