import {createServer, IncomingMessage, type Server, ServerResponse} from "node:http";
import {routeHandler} from "./routes/route";
import config from "./config";

const server: Server = createServer((req: IncomingMessage, res: ServerResponse) => {
  routeHandler(req, res)
})

const port = config.port
server.listen(port, () => {
  console.log(`Server is running on ${port}`)
})