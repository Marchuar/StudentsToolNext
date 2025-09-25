'use server'

import axios from "axios";

export const addStudent = async (studentID: string, token: string) => {
    try {
        console.log(token);

        const response = await axios.post("http://localhost:8080/api/add-student", {studentID, token});

        return response.data;
    }
    catch (error) {
        console.log(error);

        return error;
    }
}