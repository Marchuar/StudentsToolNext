'use server'

import axios from "axios";

export const getMyStudents = async (token: string) => {
    try {
        //My students
        const myStudentsResponse = await axios.post("http://localhost:8080/api/get-my-students", token);
        console.log(myStudentsResponse.data);

        return myStudentsResponse.data;
    } catch (error) {
        console.log(error);
        return error;
    }
}