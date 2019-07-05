let app = require("./app");
var cors = require('cors')

app.use(cors({}));

//socket io for game
let server = require("http").createServer(app);
let io = require("socket.io").listen(server),
  socket = require("./socket")(io);
// io.origins('*'| ['http://localhost:3000']);
io.origins(() => { })
let port = process.env.PORT || port;
server.listen(port, 'http://3.17.161.232:1304/', () => {
  console.log('Server listening on port ' + port);
});
