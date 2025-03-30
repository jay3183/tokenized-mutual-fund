// generateAbiTypes.ts
import { execSync } from 'child_process'
import path from 'path'

const configPath = path.join(__dirname, 'wagmi.config.ts')
execSync(`npx wagmi generate -c ${configPath}`, { stdio: 'inherit' })