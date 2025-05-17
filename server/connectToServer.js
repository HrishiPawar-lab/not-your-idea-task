import http from "http";
import { PORT } from "./index.js";
import { app } from "./index.js";
import { initSocketIo } from "./utils/socket.js";

const connectToServer = () => {
    try {
        const server = http.createServer(app);
        initSocketIo(server);
        server.listen(PORT, () => console.log("Listening on " + PORT));
        server.on("error", (error) => {
            console.error("Error in server: ", error);
        });
    } catch (error) {
        console.log("Error in connecting to server: ", error);
    }
}

export default connectToServer;