import type { Config } from 'jest'
import nextJest from 'next/jest'

const createJestConfig = nextJest({ dir: './' })

const config: Config = {
  testEnvironment: 'jsdom',
  // jsdom's default "browser" export condition makes MSW (via @mswjs/interceptors)
  // resolve its browser-only ESM build instead of the Node build. Clearing the
  // custom export conditions restores the correct Node resolution.
  testEnvironmentOptions: { customExportConditions: [''] },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@domain/(.*)$': '<rootDir>/src/domain/$1',
    '^@application/(.*)$': '<rootDir>/src/application/$1',
    '^@infrastructure/(.*)$': '<rootDir>/src/infrastructure/$1',
    '^@presentation/(.*)$': '<rootDir>/src/presentation/$1',
    '^@store/(.*)$': '<rootDir>/src/store/$1',
    '^@lib/(.*)$': '<rootDir>/src/lib/$1',
  },
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/', '<rootDir>/e2e/'],
  modulePathIgnorePatterns: ['<rootDir>/.next/'],
  collectCoverageFrom: [
    'src/domain/**/*.ts',
    'src/application/**/*.ts',
    'src/infrastructure/http/**/*.ts',
    '!**/*.d.ts',
  ],
}

export default createJestConfig(config)
