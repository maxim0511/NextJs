import style from './Main.module.css'
import Link from "next/link";
import Image from 'next/image';
import ImgSrc from './Header.png'
import {  useEffect, useState } from 'react';
import Router from 'next/router';


export function Main({children}: JSX.ElementChildrenAttribute){
    const [auth,setAuth]=useState('');
    const [activeRout,setActiveRout]=useState({pathname:''});
    useEffect(()=>{
        if (sessionStorage.getItem('isAuth') !== null){
             setAuth(sessionStorage.getItem('isAuth'));
        } else {
            setAuth('');
        }
    },[auth])
    useEffect(()=>{
        setActiveRout(Router)
    },[])
    const logout = ()=> {
        sessionStorage.clear();
        setAuth('');
    }
    const logIn=()=>{
        Router.push('/')
    }
    return (
        <div>
                <header className={style.Header}>
                    <div  className={style.Header_img} >
                        <Link href={'/'} ><Image src={ImgSrc} alt='Logo'/></Link>
                    </div>
                    <nav className={style.Navbar}>
                        <div className={style.Navbar_item} >
                            <Link href={'/New'} >{activeRout.pathname == "/New" ? <a className={style.active}>New</a> : <a className={style.def}>New</a>}</Link>
                        </div>
                        <div className={style.Navbar_item1}>
                             <Link href={'/Popular'}>{activeRout.pathname == "/Popular" ? <a className={style.active}>Popular</a> : <a className={style.def}>Popular</a>}</Link>
                        </div>
                        <div className={style.Navbar_item1}>
                            <Link href={'/AddImg'}>{activeRout.pathname == "/AddImg" ? <a className={style.active}>AddImg</a> : <a className={style.def}>AddImg</a>}</Link>
                        </div>
                        <div className={style.Navbar_item1}>
                            {auth.length>2?
                            <button onClick={()=>logout()} className={style.button}>Выйти</button>
                            :<button onClick={()=>logIn()} className={style.button}>Войти</button>
                            }
                        </div>
                    </nav>
                </header>
                <main>
                    {/**@ts-expect-error */}
                    {children}
                </main>
        </div>
    )
}