'use client'

import classes from "@/shared/Styles/Student/StudentPage.module.css"
import React, {type FC, useEffect, useState} from "react";

import type {IStudent} from "@/app/(interfaces)/IStudent";
import Alert, {type AlertColor, type AlertPropsColorOverrides} from "@mui/material/Alert";
import type {OverridableStringUnion} from "@mui/types";
import LoadBackdrop from "@/components/Loading/Backdrop";

import jwt from "jsonwebtoken";
import {getAllStudents} from "@/server-actions/Settings/getAllStudents";
import {getMyStudents} from "@/server-actions/Settings/getMyStudents";
import {getMySubjects} from "@/server-actions/Settings/getMySubjects";
import {addStudent} from "@/server-actions/Student/addStudent";
import {removeStudent} from "@/server-actions/Student/removeStudent";

interface StudentPageProps {
    params: Promise<{
        studentID: string;
    }>;
}

const StudentPage: FC<StudentPageProps> = ({params}) => {
    const [student, setStudent] = useState<IStudent>();
    const { studentID } = React.use(params);
    const [studentsList, setStudentsList] = useState<IStudent[]>([]);

    //role Student
    const [isStudent, setIsStudent] = useState<boolean>(false);

    //teacher subjects
    const [mySubjects, setMySubjects] = useState<String[]>([]);
    const [myStudents, setMyStudents] = useState<String[]>([]);

    //CSS
    const [isDisable, setIsDisable] = useState(true);
    const [message, setMessage] = useState<string>("");
    const [isAdded, setIsAdded] = useState<boolean>(false);
    const [isHidden, setIsHidden] = useState<boolean>(true);
    const [severity, setSeverity] = useState<OverridableStringUnion<AlertColor, AlertPropsColorOverrides>>("success");
    const [loading, setLoading] = useState<boolean>(false);

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(()=> {
        const token = localStorage.getItem("token") || "";

        //Decode JWT Token
        const decoded = jwt.decode(token) as { role: string };
        console.log(decoded);
        const role: string = decoded.role;

        if(role === "Student") {
            setIsStudent(true);
        }

        //If User Logged In
        if(token) {
            setIsLoggedIn(true);


            //Loading starts
            setLoading(true);

            getAllStudents().then((response) => {
                console.log("Students are got!: ", response);
                setStudentsList(response);

                //Only Teacher have students
                if(role === "Teacher") {
                    //My students
                    getMyStudents(token).then((response) => {
                        console.log(response);

                        setMyStudents(response);
                    })

                }
            })

            //Only Teacher can add Student and needs Subjects here
            if(role === "Teacher") {
                getMySubjects(token).then((response) => {
                    console.log("Subjects are got!: ", response);

                    setMySubjects(response);
                })
            }

            return setLoading(false);
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    useEffect(() => {
        studentsList.map((student) => {
            if (student.id === studentID) {
                setStudent(student);
            }
        })
    }, [studentsList]);


    useEffect(() => {
        myStudents.map((item) => {
            if(item == student?.id) {
                setIsAdded(true);
            }
        })
    }, [myStudents]);



    useEffect(() => {
        if(!isStudent) {
            setMessage("You don't teach this subjects.");
            setSeverity("error");

            mySubjects.map((subject) => {
                if (student?.subjects.includes(subject.toString())) {
                    console.log(subject);
                    setIsDisable(false);
                    setMessage("You can teach this student.");
                    setSeverity("success");
                }
            })

            setIsHidden(false);
        } else {
            setIsHidden(true);
        }
    }, [student]);


    const onStudentAdded = async () => {
        //Loading
        setLoading(true);

        const token: string = localStorage.getItem("token") || "";

        addStudent(studentID, token).then((response) => {
            console.log(response);

            setMyStudents(response);
        })

        //Loading
        setLoading(false);

        //CSS
        setSeverity("success");
        setIsHidden(false)
        setMessage("Student Added!");
        setIsAdded(true)
    }

    const onStudentRemoved = async () => {
        setLoading(true);

        const token: string = localStorage.getItem("token") || "";

        removeStudent(studentID, token).then((response) => {
            console.log(response);

            setMyStudents(response);
        })

        //CSS
        setSeverity("error");
        setIsHidden(false)
        setMessage("Student Removed!");
        setIsAdded(false)

        //Loading
        setLoading(false);
    }

    return (
        <div className={classes.mainCon}>
            {isLoggedIn ? <>
                    <h1>Student Page</h1>
                    <div className={classes.studentCard}>
                        <h2 className={classes.studentCardTitle}>Student Info:</h2>
                        <p className={classes.studentText}>Hello, I am <b>{student?.name}</b>, i want to learn <b>{student?.subjects[0]}</b> and <b>{student?.subjects[1]}</b></p>
                        {isStudent ? <p>Add student can only Teacher</p> : isAdded ? <button className={classes.studentButton} style = {{background: "white"}} onClick={() => onStudentRemoved()}>Delete student</button> : <button className={classes.studentButton} onClick={() => onStudentAdded()} disabled={isDisable} style={isDisable ? {background: "#dadada", borderColor: "#a6a6a6"} : {background: "white"}}>Add student</button>}
                        <LoadBackdrop isOpen={loading}></LoadBackdrop>
                        <Alert className={classes.addedMessage} style={isHidden ? { visibility: "hidden" } : {visibility: "visible"}} severity={severity} onClose={() => {setIsHidden(true)}}>{message}</Alert>
                    </div>
                </>
                 : <p>Log In, please</p>
            }
        </div>
    )
}

export default StudentPage;