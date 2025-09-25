'use server'

import axios from "axios";

export const getAllStudents = async () => {
    try {
        //All students
        const response = await axios.get("https://studentstoolnext-backend.onrender.com/api/get-all-students");

        return response.data;
    } catch (error) {
        console.log(error);
        return error;
    }
}