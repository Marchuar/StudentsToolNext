import type {User} from "@/app/(interfaces)/LoginReg/IUser";
import axios, {AxiosError} from "axios";
import jwt from "jsonwebtoken";

interface ILoginProps {
    email: string;
    password: string;
}

const tryToLogin = async ({email, password} :ILoginProps) => {
    const user: User = {
        email,
        password,
    }

    console.log(user);

    try {

        const response = await axios.post("http://localhost:8080/api/login-user", user)

        localStorage.setItem("token", response.data.token);
        console.log(response.data.token);
        //decode JWT
        const decoded = jwt.decode(response.data.token) as { role: string };
        console.log(decoded);

        // Force Header to rerender
        window.dispatchEvent(new Event("storage"));

        return "Successfully logged in";
    }
    catch (error) {
        const axiosError = error as AxiosError;
        console.log(error);
        if (axiosError.response?.status === 401) {
            console.log(axiosError.response?.data);
            return "Login failed. Invalid data!";
        }
        return "Login failed"; // fallback for other errors
    }
}

export default tryToLogin;