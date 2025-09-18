'use client'

import type {IStudent} from "@/app/(interfaces)/IStudent";
import classes from "@/shared/Styles/Students/Student.module.css"
import Link from "next/link";
import PAGES from "@/config/config";
import {useState} from "react";
import LoadBackdrop from "@/components/Loading/Backdrop";

const Student = ({student} : {student: IStudent}) => {
    const [isLoading, setIsLoading] = useState(false);

    const showLoading = () => {
        setIsLoading(true);
    }

    return (
        <Link href={PAGES.STUDENT.link + student.id} className={classes.link} onClick={showLoading}>
            <div className={classes.studentCon}>
                <p><b>Student's name:</b> {student.name}</p>
                <p><b>Student's age:</b> {student.age}</p>
                <p><b>Student's subjects:</b> {student.subjects.map((subject) => <b key={subject}>{subject} </b>)}</p>
            </div>

            <LoadBackdrop isOpen={isLoading}></LoadBackdrop>
        </Link>
    )
}

export default Student;