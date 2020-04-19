
const jsonfile = require('jsonfile')

const file = 'datatest.json'

jsonfile.writeFile(file, obj, { flag: 'a' }, function (err) {
    if (err) console.error(err)
    console.log('Write Complete');
  })