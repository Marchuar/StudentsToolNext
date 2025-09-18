import Link from "next/link";
import classes from "@/shared/Styles/Login/LoginAlarm.module.css"


const LoginAlarm = () => {
    return (
        <div className={classes.mainCon}>
            <p className={classes.alarmText}>To use this page, <Link href="/login">log in</Link> to your account</p>
        </div>
    )
}

export default LoginAlarm;