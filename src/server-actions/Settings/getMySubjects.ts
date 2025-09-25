'use server'

import jwt from "jsonwebtoken";
import axios from "axios";

export const getMySubjects = async (token: string) => {

    try{
        //All my subjects
        const decoded = jwt.decode(token) as { role: string };
        console.log(decoded);
        const role = decoded.role;

        const response = await axios.post("https://studentstoolnext-backend.onrender.com/api/get-my-subjects", {token, role});
        return response.data;
    } catch(error) {
        return error;
    }
}