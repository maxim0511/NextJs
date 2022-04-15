import Link from "next/link"
import React from "react";
import style from './regist.module.css'
import Preloader from "../../layout/Preloader";
import { Form, Input, Button } from 'antd';
import 'antd/dist/antd.css'; 
import Head from "next/head";
import { useEffect, useState } from "react";
import axios from "axios";
import Router from "next/router";

export default function Registr () {
    const [preloader,setPreloader]=useState(false);
    const [isAuth,SetAuth]=useState(false);
    const [errorAuth,SetError]=useState('');
    const onFinish = async (values:{email: string,phone: string,fullname: string,password: string,username: string})=>{
       try{ 
            setPreloader(true)
            await axios.post<valuesRegType>(`http://gallery.dev.webant.ru/api/users`,{
                        'email':values.email,
                        'phone':values.phone,
                        'fullName':values.fullname,
                        'password':values.password,
                        'username':values.username,
                        birthday: "2022-02-20T11:49:36.135Z",
                        roles: [
                          ''
                        ]
            })
            setPreloader(false);
            SetAuth(true);
       }
        catch(e){
            setPreloader(false)
            SetError('Invalid data')
        }
    }
    useEffect (()=>{
        if(isAuth !== false) {
            Router.push('/')
        } 
    },[isAuth])
    if (preloader) return <Preloader/>
    return (
    <>
        <Head>
            <title>Registration</title>
        </Head>
        <div className={style.Reg}>
            <div className={style.RegPage}>
            <h1 className={style.RegName}>Регистрация</h1>
             <Form name="Registration" onFinish={onFinish} >
                    <Form.Item name="email"  rules={[{required: true, message: 'Please input your E-mail!',},]}>        
                            <Input size="large" type="email" placeholder="E-mail" />
                    </Form.Item><br/>
                    <Form.Item name="phone"  rules={[{required: true, message: 'Please input your Phone!',},]}>        
                            <Input size="large" placeholder="Phone" />
                    </Form.Item><br/>
                    <Form.Item name="fullname"  rules={[{required: true, message: 'Please input your Fullname!',},]}>        
                            <Input size="large" placeholder="Fullname" />
                    </Form.Item><br/>
                    <Form.Item name="password"  rules={[{required: true,message: 'Please input your Password!',},]}>
                            <Input size="large" type="password" placeholder="Password"/>
                     </Form.Item><br/>
                     <Form.Item name="username"  rules={[{required: true, message: 'Please input your Username!',},]}>        
                            <Input size="large" placeholder="Username" />
                    </Form.Item>
                     <div className={style.buttonContainer}>
                        <Form.Item>
                                <Button type="primary" htmlType="submit"  >
                                Зарегистрироваться
                                </Button>
                        </Form.Item>
                     </div>
                     <div className={style.error}>{errorAuth}</div>
                </Form>
            </div><br/>
            <div className={style.AuthPage}>
                <Link href={'/'}>Авторизоваться</Link>
            </div>
        </div>
    </>
    )
}
export type valuesRegType = {
    email: string;
    phone: string;
    fullname: string;   
    password: string;
    username: string;
};