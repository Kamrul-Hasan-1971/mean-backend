const app = require("./app");
const debug = require("debug")("node-angular");
const http = require("http");
const mongoose = require("mongoose");

const normalizePort = val => {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

const onError = error => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const onListening = () => {
  const addr = server.address();
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  debug("Listening on " + bind);
  console.log("Listening on " + bind);
  console.log("addr", addr);
};

const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

const connectDB= async ()=>{
  mongoose
  .connect(
    "mongodb+srv://Hasan1971:"
    +process.env.MONGO_ATLAS_PW+
    "@cluster0.2greaqi.mongodb.net/mean?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("MongoDb Connection failed!");
  });
}


const server = http.createServer(app);
server.on("error", onError);
server.on("listening", onListening);
connectDB().then(()=>{
  server.listen(port);
})
