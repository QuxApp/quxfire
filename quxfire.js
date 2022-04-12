const { initializeApp, applicationDefault, cert } = require('firebase-admin/app')
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore')
const fs = require('fs-extra')

const quxbase = new Map()

module.exports = {
  auth(name, json) {
    fs.writeFileSync(`${name}.json`, json)
    const serviceAccount = JSON.parse(fs.readFileSync(`${name}.json`))
    initializeApp({
      credential: cert(serviceAccount)
    })
    fs.unlinkSync(`${name}.json`)
    module.exports.db = getFirestore()
  },
  put(collection, doc, input) {
    if (typeof(collection) === 'string' && typeof(doc) === 'string' && typeof(input) === 'object') {
      module.exports.db.collection(collection).doc(doc).set(input)
      .then(() => {
        console.log("Document successfully written!");
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });
    } else {
      console.log('Invalid parameters!\ncollection: string\ndoc: string\ninput: object')
      console.log(`You typed: ${typeof(collection), typeof(doc), typeof(input)}`)
    }
  },
  grab(collection, doc) {
    return module.exports.db.collection(collection).doc(doc).get()
  },
  use(collection, doc, foo) {
    return module.exports.db.collection(collection).doc(doc).get().then((item) => {
      foo(item)
    })
  },
  write(file, content) {
    fs.writeFile(file, content)
  },
  local: {
    db: quxbase,
    add(key, value) {
      if (quxbase.get(key) !== undefined) {
        quxbase.set(key, value)
      }
    }
  }
}