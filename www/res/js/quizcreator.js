const jsonfile = require('jsonfile')

const file = 'datatest.json'
const obj = {
    id: "",
    title: "",
        questions: [
        {
            q: "",
            img: "",
            source: "",
            opt1: "",
            opt2: "",
            opt3: "",
            opt4: "",
            answer: ""
        }
    ]
}

JSON.stringify(obj, null, '\t')

jsonfile.writeFile(file, obj, { flag: 'a' }, function (err) {
    if (err) console.error(err)
  })