import Link from "next/link"
import Head from "next/head";
import style from './Login.module.css'
import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css'; 
import { useEffect, useState } from "react";
import Preloader from "../layout/Preloader";
import axios from "axios";
import Router from "next/router";
import { GetServerSideProps } from "next";

type propsType = {
    secret:string,
    id:string,
    error:string
}

export default function Index({secret,id,error}:propsType){
    const [preloader,setPreloader]=useState(false);
    const [accestoken,setAccessToken]=useState('');
    const [refreshtoken,setRefreshToken]=useState('');
    const [isAuth,SetAuth]=useState(false);
    const [errorAuth,SetError]=useState('');
    const onFinish = async (values:{username:string,password:string})=>{
        try{ 
            setPreloader(true)
            const res= await axios.get<loginType>(`http://gallery.dev.webant.ru/oauth/v2/token`,{
                params:{
                'grant_type':'password',
                'client_id':id,
                'client_secret':secret,
                'username':values.username,
                'password':values.password
                }
            })
            setAccessToken(res.data.access_token);
            setRefreshToken(res.data.refresh_token);
            setPreloader(false);
            SetAuth(true);
       } 
       catch(e){
            setPreloader(false)
            SetError('Invalid username and password combination')
        }
    }
    useEffect(()=>{
        if(sessionStorage.getItem('isAuth')){
            Router.push('/New')
        }
    },[])
    useEffect (()=>{
        if(isAuth !== false) {
            sessionStorage.setItem('isAuth','auth');
            sessionStorage.setItem('accesstoken',accestoken);
            sessionStorage.setItem('refreshtoken',refreshtoken);
            sessionStorage.setItem('clientId',id);
            sessionStorage.setItem('secret',secret);

            Router.push('/New')
        } 
    },[isAuth])
    if (preloader) return <Preloader/>
    return (
    <>
        <Head>
            <title>Login</title>
            <meta name="keywords" content="js,javascript,web,react,next,typescript,module.css,css,spa,seo" />
        </Head>
        <div className={style.Login}>
                <h1 className={style.LoginName}>Авторизация</h1>
                <div className={style.LoginPage}>
                 <Form name="login" onFinish={onFinish} className={style.login_form}>
                    <Form.Item name="username" className={style.formItem}  rules={[{required: true, message: 'Please input your Username!',},]}>        
                            <Input size="large" prefix={<UserOutlined/>}  placeholder="Username" data-testid="Username"/>
                    </Form.Item><br/>
                    <Form.Item name="password"  rules={[{required: true,message: 'Please input your Password!',},]}>
                            <Input size="large" prefix={<LockOutlined/>}  type="password" placeholder="Password" data-testid="Password"/>
                     </Form.Item>
                     <Form.Item>
                            <Button type="primary" htmlType="submit" data-testid="Button">
                                Войти
                            </Button>
                    </Form.Item>
                    <div className={style.error}>{error}</div>
                    <div className={style.error}>{errorAuth}</div>
                </Form>
                </div><br/>
                <div className={style.RegistrationPage}>
                    У вас еще нет аккаунта?<div><Link href={"/Regist"}>Зарегистрироваться</Link></div>
                </div>
            </div>
    </>
    )
}

export const getServerSideProps:GetServerSideProps= async()=>{
    const response = await axios.post<firstEntranceType>(`http://gallery.dev.webant.ru/api/clients`,{name:'string',"allowedGrantTypes": ["password", "refresh_token"]});
    const id = response.data.id + '_' + response.data.randomId;
    const secret =response.data.secret;

    if(!response){
        return{
            props:{
                error:'Server Error'
            }
        }
    }
    return {
        props:{
            secret,id
        }
    }
    
}

type firstEntranceType = {
    id: string,
    name: string,
    randomId: string,
    secret: string,
    message:string[]
    allowedGrantTypes: [
      string,string
    ]
}
type loginType = {
    access_token:string,
    refresh_token:string,
}