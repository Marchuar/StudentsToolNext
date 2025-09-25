import axios, {AxiosError} from "axios";
import type {User} from "@/app/(interfaces)/LoginReg/IUser";
import {redirect} from "next/navigation";
import type {StudentInfo} from "@/app/(interfaces)/LoginReg/IStudentInfo";



interface IRegisterProps {
    username: string;
    email: string;
    password: string;
    selectedRole: String;
    name: string;
    age: number;
}

const tryToRegister = async ({username, email, password, selectedRole, name, age} :IRegisterProps) => {
    const user: User = { username, email, password };
    const studentInfo: StudentInfo = {name, age};

    console.log(user);

    try {
        console.log(selectedRole);
        const response = await axios.post("https://studentstoolnext-backend.onrender.com/api/add-user", {user, selectedRole, studentInfo});

        console.log(response.data.token);
        window.dispatchEvent(new Event("storage"));

        return response.data.token;
    } catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 409) {
            console.log(axiosError.response?.data);
            return "User already exists";
        }
        return "Registration failed"; // fallback for other errors
    }
}

export default tryToRegister;