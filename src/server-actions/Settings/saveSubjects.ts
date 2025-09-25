'use server'

import jwt from "jsonwebtoken";
import axios from "axios";

export const saveSubjects = async (mySubjects: Object, token: string) => {

    try {
        //Decoded JWT Token
        const decoded = jwt.decode(token) as { role: string };
        console.log(decoded);
        const role = decoded.role;

        console.log(mySubjects);
        const response = await axios.post("http://localhost:8080/api/save-subjects", {mySubjects, token, role})
        console.log(response);

        return "Success";
    }
    catch (error) {
        console.error(error);
        return "Error";
    }
}