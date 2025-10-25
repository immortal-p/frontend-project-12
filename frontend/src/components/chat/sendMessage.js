import axios from "axios";

export default async function sendMessage(msg) {
    await axios.post("/api/v1/messages", msg);
}
