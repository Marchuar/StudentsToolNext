'use client'

import classes from "@/shared/Styles/Student/StudentPage.module.css"
import {useParams} from "next/navigation";
import React, {type FC, useEffect, useState} from "react";

import type {IStudent} from "@/app/(interfaces)/IStudent";
import Alert, {type AlertColor, type AlertPropsColorOverrides} from "@mui/material/Alert";
import type {OverridableStringUnion} from "@mui/types";
import LoadBackdrop from "@/components/Loading/Backdrop";
import axios from "axios";
import jwt from "jsonwebtoken";

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

            const getAllStudents= async () => {
                //all-students
                const response = await axios.get("http://localhost:8080/api/get-all-students");
                setStudentsList(response.data);


                //Only Teacher have students
                if(role === "Teacher") {
                    //My students
                    const myStudentsResponse = await axios.post("http://localhost:8080/api/get-my-students", token);
                    console.log(myStudentsResponse.data);
                    setMyStudents(myStudentsResponse.data);
                }
            }

            getAllStudents().then(() => {
                console.log("Students are got!");
            })

            //Only Teacher can add Student and needs Subjects here
            if(role === "Teacher") {
                const getMySubjects = async () => {
                    const response = await axios.post("http://localhost:8080/api/get-my-subjects", {token, role});
                    setMySubjects(response.data);
                }

                getMySubjects().then(() => {
                    console.log("Subjects are got!");
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

        try {
            const token: string = localStorage.getItem("token") || "";
            console.log(token);

            const response = await axios.post("http://localhost:8080/api/add-student", {studentID, token});
            console.log(response.data);
            setMyStudents(response.data);
        }
        catch (error) {
            console.log(error);
        }


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

        try {
            const token: string = localStorage.getItem("token") || "";
            console.log(token);

            const response = await axios.post("http://localhost:8080/api/delete-student", {studentID, token});
            console.log(response.data);
            setMyStudents(response.data);
        }
        catch (error) {
            console.log(error);
        }

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