'use server'

import axios from "axios";

export const removeStudent = async (studentID: string, token: string) => {
    try {
        console.log(token);

        const response = await axios.post("http://localhost:8080/api/delete-student", {studentID, token});
        console.log(response.data);

        return response.data;
    }
    catch (error) {
        console.log(error);

        return error;
    }
}