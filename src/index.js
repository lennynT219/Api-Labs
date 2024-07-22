import app from './server.js'
import connection from './database.js'

app.listen(app.get('port'), () => {
  console.log(`Server on :  http://localhost:${app.get('port')}`)
})

connection()
