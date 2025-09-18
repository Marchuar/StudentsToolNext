'use client'

import Link from "next/link";
import PAGES from "@/config/config";
import styles from "@/components/Header/header.module.css"
import logo from "@/shared/Images/logo.png"
import Image from "next/image";
import {redirect, usePathname} from "next/navigation";
import {useEffect, useState} from "react";

const Header = () => {
    const pathname = usePathname();
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    const getAuthData = () => {
        const token = localStorage.getItem("token");

        if (token) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }

    useEffect(() => {
        getAuthData();

        // Listen for storage updates
        const handleStorageChange = () => getAuthData();
        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, [])

    const onLogOut = () => {
        localStorage.removeItem("token");

        setIsLoggedIn(false);

        // Notify other tabs and force Header rerender
        window.dispatchEvent(new Event("storage"));

        redirect("/login")
    }

    return (
        <header className={styles.mainCon}>
            <div className={styles.logoCon}>
                <Link href={PAGES.HOME.link}><Image src={logo} alt="logo" className={styles.logo}/></Link>
            </div>

            <nav className={styles.navCon}>
                <Link className={pathname == '/' ? styles.linkUnderLine : styles.link} href={PAGES.HOME.link}>{PAGES.HOME.title}</Link>
                <Link className={pathname == '/students' ? styles.linkUnderLine : styles.link} href={PAGES.STUDENTS.link}>{PAGES.STUDENTS.title}</Link>
                <Link className={pathname == '/settings' ? styles.linkUnderLine : styles.link} href={PAGES.SETTINGS.link}>{PAGES.SETTINGS.title}</Link>
            </nav>
            {!isLoggedIn ?
            <div className={styles.logRegCon}>
                <Link className={pathname == '/login' ? styles.linkUnderLine : styles.link} href={PAGES.LOGIN.link}>{PAGES.LOGIN.title}</Link>
                <Link className={pathname == '/register' ? styles.linkUnderLine : styles.link} href={PAGES.REGISTER.link}>{PAGES.REGISTER.title}</Link>
            </div> : <button className={styles.logoutButton} onClick={onLogOut}>Log Out</button>}
        </header>
    )
}

export default Header;