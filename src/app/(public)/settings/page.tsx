'use client'

import styles from "@/shared/Styles/Settings/SettingsPage.module.css"
import React, {useEffect, useState} from "react";
import LoginAlarm from "@/app/(public)/login/LoginAlarm";
import Student from "@/app/(public)/students/Student";
import type {IStudent} from "@/app/(interfaces)/IStudent";
import axios from "axios";
import LoadBackdrop from "@/components/Loading/Backdrop";
import type {AlertColor} from "@mui/material/Alert";
import Alert from "@mui/material/Alert";

//Select Box
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import jwt from "jsonwebtoken";


const SettingsPage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [myStudents, setMyStudents] = useState<String[]>([]);
    const [allStudents, setAllStudents] = useState<IStudent[]>([]);

    //check role
    const [isStudent, setIsStudent] = useState<boolean>(false);

    const [mySubjects, setMySubjects] = useState<string[]>([]);
    const [subjectOptions, setSubjectOptions] = useState<string[]>(["IT", "Math", "English", "France", "Biology", "Physic"])

    //Select Box
    const [selectedValue, setSelectedValue] = useState<string>(subjectOptions[0]);
    const [inputValue, setInputValue] = useState<string>("");

    //loading
    const [loading, setLoading] = useState(false);

    //Alert
    const [severity, setSeverity] = useState<AlertColor>("success");
    const [alertText, setAlertText] = useState<string>("");
    const [isHidden, setIsHidden] = useState<boolean>(true);

    const myStudentObjects = allStudents.filter(student =>
        myStudents.includes(student.id)
    );

    useEffect(() => {
        const token = localStorage.getItem("token") || "";

        //login check
        if(token) {
            console.log(token);
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }

        if(token) {
            //Decode JWT Token
            const decoded = jwt.decode(token) as { role: string };
            console.log(decoded);
            const role: string = decoded.role;

            if(role === "Student") {
                setIsStudent(true);
            }

            if(!isStudent) {
                //get All Students
                const getAllStudents = async () => {
                    setLoading(true);

                    try {
                        //My students
                        const myStudentsResponse = await axios.post("http://localhost:8080/api/get-my-students", token);
                        console.log(myStudentsResponse.data);
                        setMyStudents(myStudentsResponse.data);

                        //All students
                        const response = await axios.get("http://localhost:8080/api/get-all-students");
                        setAllStudents(response.data);
                    } catch (error) {
                        console.log(error);
                    }
                }

                getAllStudents().then(() => {
                    console.log("My students fetched!");
                    console.log(myStudents);
                })
            }



            //get my subjects
            const getMySubjects = async () => {
                //All students
                const decoded = jwt.decode(token) as { role: string };
                console.log(decoded);
                const role = decoded.role;

                const response = await axios.post("http://localhost:8080/api/get-my-subjects", {token, role});
                setMySubjects(response.data || []);
            }

            getMySubjects().then(() => {
                console.log("My subjects fetched!");
                setLoading(false);
            })
        }
    }, [])

    useEffect(() => {
        setSubjectOptions(subjectOptions.filter(subject => !mySubjects.includes(subject)));
    }, [mySubjects]);

    const onAddSubject = () => {
        if(mySubjects.includes(selectedValue)) {
            setSeverity("error");
            setAlertText("You already have this subject");
            setIsHidden(false);
        } else {
            setMySubjects((mySubjects) => [...mySubjects, selectedValue])
        }
    }

    const onDeleteSubject = (subject: string) => {
        setMySubjects(mySubjects => mySubjects.filter(item => item !== subject));
    }

    const onSaveSubjects = async () => {
        setLoading(true);

        try {
            const token = localStorage.getItem("token") || "";

            //Decoded JWT Token
            const decoded = jwt.decode(token) as { role: string };
            console.log(decoded);
            const role = decoded.role;

            console.log(mySubjects);
            const response = await axios.post("http://localhost:8080/api/save-subjects", {mySubjects, token, role})
            console.log(response);


            setSeverity("success");
            setIsHidden(false);
            setAlertText("Saved successfully.");
        }
        catch (error) {
            console.log(error);
            setSeverity("error");
            setIsHidden(false);
            setAlertText("Failed!");
        }

        setLoading(false);
    }

    return (
        <div className={styles.mainCon}>
            {isLoggedIn ?
                <div className={styles.mainCon}>
                    <h1>Settings Page</h1>

                    <div className={styles.mainInfoCon}>
                        <div style={isStudent ? {display: "none"} : {display: "flex"}} className={styles.myInfoCon}>
                            <p className={styles.myInfoText}>My students: </p>
                            {myStudentObjects.map((student: IStudent) => (
                                <Student key={student.id} student={student}/>
                            ))}
                        </div>

                        <div className={styles.myInfoCon}>
                            <p className={styles.myInfoText}>My subjects: </p>
                            {mySubjects.map((subject: String) => (
                                <div key={subject.toString()} className={styles.mySubjectsCon}>
                                    <p className={styles.subjectName}><b>{subject.toString()}</b></p>
                                    <button className={styles.deleteButton} onClick={() => onDeleteSubject(subject.toString())}>delete</button>
                                </div>

                            ))}

                            <div className={styles.addSubjectCon}>
                                <Autocomplete
                                    value={selectedValue}
                                    onChange={(event: any, newValue: string | null) => {
                                        setSelectedValue(newValue || "");
                                    }}
                                    inputValue={inputValue}
                                    onInputChange={(event, newInputValue) => {
                                        setInputValue(newInputValue);
                                    }}
                                    id="controllable-states-demo"
                                    options={subjectOptions}
                                    sx={{ width: 300 }}
                                    renderInput={(params) => <TextField {...params} label="Subjects" />}
                                />

                                <button className={styles.addButton} onClick={() => onAddSubject()}>+ Add Subject</button>
                                <button className={styles.addButton} onClick={() => onSaveSubjects()}>Save</button>
                            </div>

                            <Alert className={styles.alertMessage} style={isHidden ? { visibility: "hidden" } : {visibility: "visible"}} severity={severity} onClose={() => setIsHidden(true)}>{alertText}</Alert>
                        </div>
                    </div>


                    <LoadBackdrop isOpen={loading}></LoadBackdrop>
                </div>
                : <LoginAlarm />}
        </div>
    )
}

export default SettingsPage;