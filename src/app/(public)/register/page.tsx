'use client'

import classes from "@/shared/Styles/Register/RegisterPage.module.css"
import {FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField} from "@mui/material";
import React, {useEffect, useState} from "react";
import tryToRegister from "@/server-actions/Register/RegisterActions";
import {redirect} from "next/navigation";
import LoadBackdrop from "@/components/Loading/Backdrop";
import Alert, {type AlertColor, type AlertPropsColorOverrides} from "@mui/material/Alert";


const Register = () => {
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    //student
    const [name, setName] = useState<string>("");
    const [age, setAge] = useState<number>(16);

    const [loading, setLoading] = useState<boolean>(false);

    //CheckBox
    const [selectedRole, setSelectedRole] = useState<String>("Teacher");

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


    const onRegister = async (e: React.MouseEvent<HTMLButtonElement>) => {
        setLoading(true);
        e.preventDefault();

        const response: string | void = await tryToRegister({username, email, password, selectedRole, name, age})
        console.log("response: ", response)

        if(response === "User already exists") {
            setLoading(false);
            setSeverity("error");
            setAlertText(response);
            setIsHidden(false);
        } else if(response === "Successfully registered") {
            redirect('/login');
        }

    }

    const handleRole = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedRole(e.target.value)
    }

    return (
        <div className={classes.mainCon}>
            <form className={classes.formCon}>
                <h2 className={classes.pageName}>Registration</h2>

                <div className={classes.inputCon}>
                    <TextField onChange={(e) => setUsername(e.target.value)} id="username" label="Username" variant="standard" size="small" value={username} type="username" required/>

                    <TextField onChange={(e) => setEmail(e.target.value)} id="email" label="Email" variant="standard" size="small" value={email} type="email" required/>

                    <TextField onChange={(e) => setPassword(e.target.value)} id="password" label="Password" variant="standard" size="small" value={password} type="password" required/>
                </div>

                <FormControl>
                    <FormLabel id="demo-row-radio-buttons-group-label">Select role:</FormLabel>
                    <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                        value={selectedRole}
                        onChange={e => handleRole(e)}
                    >
                        <FormControlLabel value="Teacher" control={<Radio />} label="Teacher" />
                        <FormControlLabel value="Student" control={<Radio />} label="Student" />
                    </RadioGroup>

                    <div style={selectedRole === "Student" ? {display: "flex"} : {display: "none"}} className={classes.studentInfoCon}>
                        <TextField style={{marginBottom: "20px", marginTop: "15px"}} onChange={(e) => setName(e.target.value)} id="name" label="Name" variant="standard" size="small" value={name} type="name" required/>

                        <TextField style={{marginBottom: "20px"}} onChange={(e) => setAge(e.target.value !== "" ? parseInt(e.target.value) : 0)} id="age" label="Age" variant="standard" size="small" value={age} type="number" required/>
                    </div>
                </FormControl>

                <button type="submit" className={classes.submitButton} onClick={(e) => onRegister(e)}>Sign Up</button>
            </form>
            <LoadBackdrop isOpen={loading}></LoadBackdrop>
            <Alert className={classes.alertMessage} style={isHidden ? { visibility: "hidden" } : {visibility: "visible"}} severity={severity} onClose={() => setIsHidden(true)}>{alertText}</Alert>
        </div>
    )
}

export default Register;