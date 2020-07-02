
import path from 'path'
import program from 'commander'
import yeomanEnv from 'yeoman-environment'
import pckJson from '../package.json'
import dotenv from 'dotenv'

dotenv.config({ 'path': path.join(__dirname, '..', '.env') })

const env = yeomanEnv.createEnv()
  .register(require.resolve('../lib/commands/create'), 'create')

program
  .version(pckJson.version, '-v, --version')

program
  .command('create [cmd]')
  .description('脚手架工具')
  .action(async (cmd = 'component', opts) => {
    let { username, italent } = opts
    env.run(`create ${cmd}`, { username, italent })
  })

program.parse(process.argv)
