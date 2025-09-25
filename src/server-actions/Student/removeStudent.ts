'use server'

import axios from "axios";

export const removeStudent = async (studentID: string, token: string) => {
    try {
        console.log(token);

        const response = await axios.post("https://studentstoolnext-backend.onrender.com/api/delete-student", {studentID, token});
        console.log(response.data);

        return response.data;
    }
    catch (error) {
        console.log(error);

        return error;
    }
}