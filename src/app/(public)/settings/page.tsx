'use client'

import styles from "@/shared/Styles/Settings/SettingsPage.module.css"
import React, {useEffect, useState} from "react";
import LoginAlarm from "@/app/(public)/login/LoginAlarm";
import Student from "@/app/(public)/students/Student";
import type {IStudent} from "@/app/(interfaces)/IStudent";
import LoadBackdrop from "@/components/Loading/Backdrop";
import type {AlertColor} from "@mui/material/Alert";
import Alert from "@mui/material/Alert";

//Select Box
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import jwt from "jsonwebtoken";
import {getAllStudents} from "@/server-actions/Settings/getAllStudents";
import {getMyStudents} from "@/server-actions/Settings/getMyStudents";
import {getMySubjects} from "@/server-actions/Settings/getMySubjects";
import {saveSubjects} from '@/server-actions/Settings/saveSubjects';


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
                setLoading(true);

                getAllStudents().then((response) => {
                    console.log("All students fetched!: ", response);

                    setAllStudents(response);
                })

                getMyStudents(token).then((response) => {
                    console.log("My students fetched!: ", response);

                    setMyStudents(response);

                    setLoading(false);
                })
            }

            getMySubjects(token).then((response) => {
                console.log("My subjects fetched!: ", response);

                setMySubjects(response || []);
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

    const onSaveSubjects = () => {
        setLoading(true);
        const token = localStorage.getItem("token") || "";

        saveSubjects(mySubjects, token).then((response) => {
            console.log("Saved subjects fetched!: ", response);

            if(response === "Success") {
                console.log(response);

                setSeverity("success");
                setIsHidden(false);
                setAlertText("Saved successfully.");

            } else if (response === "Error") {
                console.log(response);

                setSeverity("error");
                setIsHidden(false);
                setAlertText("Failed!");

            }

        })

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