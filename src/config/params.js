import { Command } from 'commander'

const program = new Command();

program
    .option('-d, --debug', "Variable de debug", false)
    .option('-p, --port <port>', "Numero puerto", 8080)
    .option('-m, --mode <mode>', "Ambiente", 'development')

program.parse()

/* console.log("options =>", program.opts()) */

export default program.opts();