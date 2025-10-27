import axios from "axios";

export default async (id) => {
   await axios.delete(`/api/v1/channels/${id}`) 
}