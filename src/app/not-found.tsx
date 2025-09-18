import PAGES from "@/config/config";
import Link from "next/link";
import classes from "@/shared/Styles/Not-Found/NotFoundPage.module.css"

const NotFound = () => {
    return (
        <div className={classes.mainCon}>
            <p className={classes.errorText}><b>404</b></p>
            <h1>Page not found</h1>
            <Link href={PAGES.HOME.link} className={classes.link}><p>Back to Home Page</p></Link>
        </div>
    )
}

export default NotFound;