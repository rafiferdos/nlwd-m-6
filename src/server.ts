import { createServer, IncomingMessage, ServerResponse, type Server } from "node:http";
import { routeHandler } from "./routes/route";

const server: Server = createServer((req: IncomingMessage, res: ServerResponse) => {
  routeHandler(req, res)
})

const port = 5000
server.listen(port, () => {
  console.log(`Server is running on ${port}`)
})