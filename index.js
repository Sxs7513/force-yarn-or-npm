const os = require("os")
const exec = require("child_process").exec;
const program = require('commander')

program
    .version('0.0.1')
    .option('-f, --force <n>', 'force npm or yarn')
    .parse(process.argv)

const forceTarget = ['npm', 'yarn'].indexOf(program.force) !== - 1
    ? program.force
    : "yarn"

const reg = forceTarget == "npm"
    ? `\"npm-cli\"`
    : `\"yarn.js\"`

const command = os.platform() == 'win32'
    ? `echo \"%npm_execpath%\" | findstr ${reg} || (echo fail)`
    : `echo \"$npm_execpath\" | grep -q ${reg} || (echo fail)`

function check() {
  return new Promise((r, j) => {
    exec(command, function (
      err,
      stdot,
      stderr
    ) {
      if (stdot.indexOf("fail") !== -1) {
        console.warn(`-------------------⚠️ Use ${forceTarget} not ${['npm', 'yarn'].filter(item => item !== forceTarget)[0]}! ⚠️-------------------`);
        process.exit(1);
      }
      r();
    });
  });
}

async function main() {
  await check();
}

main();
