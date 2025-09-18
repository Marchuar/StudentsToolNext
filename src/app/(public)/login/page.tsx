'use client'

import classes from "@/shared/Styles/Login/LoginPage.module.css"
import {TextField} from "@mui/material";
import React, {useEffect, useState} from "react";
import tryToLogin from "@/server-actions/Login/LoginActions";
import {redirect} from "next/navigation";
import LoadBackdrop from "@/components/Loading/Backdrop";
import tryToRegister from "@/server-actions/Register/RegisterActions";
import Alert, {type AlertColor} from "@mui/material/Alert";


const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    //Alert
    const [severity, setSeverity] = useState<AlertColor>("success");
    const [alertText, setAlertText] = useState<string>("");
    const [isHidden, setIsHidden] = useState<boolean>(true);

    //Check if user Logged In
    useEffect(() => {
        const token = localStorage.getItem("token")

        if(token) {
            redirect('/')
        }
    }, [])

    const onEmailEnter = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setEmail(e.target.value);
    }

    const onPasswordEnter = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setPassword(e.target.value);
    }

    const onLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
        setLoading(true);
        e.preventDefault()

        const response: string | void = await tryToLogin({email, password})
        console.log("response: ", response)

        if(response === "Login failed. Invalid data!" || response === "Login failed") {
            setLoading(false);
            setSeverity("error");
            setAlertText(response);
            setIsHidden(false);
        } else if(response === "Successfully logged in") {
            redirect('/');
        }
    }

    return (
        <div className={classes.mainContainer}>
            <form className={classes.formCon}>
                <h2 className={classes.pageName}>Login</h2>

                <div className={classes.inputCon}>
                    <TextField onChange={(e) => onEmailEnter(e)} id="email" label="Email" variant="standard" size="small" value={email} type="email" required/>

                    <TextField onChange={(e) => onPasswordEnter(e)} id="password" label="Password" variant="standard" size="small" value={password} type="password" required/>
                </div>

                <button type="submit" className={classes.submitButton} onClick={(e) => onLogin(e)}>Sign In</button>
            </form>
            <LoadBackdrop isOpen={loading}></LoadBackdrop>
            <Alert className={classes.alertMessage} style={isHidden ? { visibility: "hidden" } : {visibility: "visible"}} severity={severity} onClose={() => setIsHidden(true)}>{alertText}</Alert>
        </div>
    )
}

export default Login;