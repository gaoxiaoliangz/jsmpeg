const pkg = require('./package.json')
const { exec } = require('child_process')

exec(`sh build-js.sh ${pkg.version}`, (err, stdout) => {
  if (err) {
    return console.error('Error:', err)
  }
  console.log(stdout)
})
