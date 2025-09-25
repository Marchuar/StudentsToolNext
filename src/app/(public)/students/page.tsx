'use client'

import Student from "@/app/(public)/students/Student";
import type {IStudent} from "@/app/(interfaces)/IStudent";
import styles from "@/shared/Styles/Students/StudentsPage.module.css"
import {useEffect, useState} from "react";
import LoginAlarm from "@/app/(public)/login/LoginAlarm";
import axios from "axios";
import LoadBackdrop from "@/components/Loading/Backdrop";
import {getAllStudents} from "@/server-actions/Settings/getAllStudents";


const StudentsPage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [studentsList, setStudentsList] = useState<IStudent[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if(token) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }

        if(token) {
            setLoading(true);

            getAllStudents().then((response) => {
                console.log("Students are fetched successfully: ", response);

                setStudentsList(response)

                setLoading(false);
            })
        }
    }, [])

    return(
        <div className={styles.mainCon}>
            {isLoggedIn ? <>
                <h1>Students Page</h1>
                <div className={styles.studentsCon}>

                    {studentsList.map((student: IStudent) => {
                        return (
                            <Student key={student.id} student={student}/>
                        )
                    })}
                </div>
                <LoadBackdrop isOpen={loading}></LoadBackdrop>
            </> : <LoginAlarm/>}
        </div>

    )
}

export default StudentsPage;