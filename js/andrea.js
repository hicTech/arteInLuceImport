const {exec} = require('child_process')

exports.curl = function (url, callback = (err, output) => undefined, options = {method:'GET'}) {
  let method = options.method.toUpperCase()

  exec(`curl -X ${method} -k \"${url}\"`, (error, stdout, stderr) => {
    callback(error, stdout || stderr)
  })
}