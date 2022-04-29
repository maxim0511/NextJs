import Head from "next/head";
import { Main } from "../../layout/Main";
import style from "./AddImg.module.css";
import Preloader from "../../layout/Preloader";
import { Radio, Upload } from "antd";
import { Form, Input, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css'; 
import { useEffect, useState } from "react";
import axios from "axios";
import { ImgApiType } from "../New";


const normFile = (e: E) => {
    if (Array.isArray(e)) {
        return e;
      }
      return e && e.fileList;
  };
export default function AddImg (){
    const [preloader,SetPreloader]=useState(false);
    const [ImageAddInServer,SetImg]=useState(false);
    const [error,setError]=useState(false);
    const [secret,setSecret]=useState('');
    const [refreshToken,setRefreshtoken]=useState('');
    const [accessToken,setAccesToken]=useState('');
    const [clientId,setClientid]=useState('');
    useEffect(()=>{
        setSecret(sessionStorage.getItem('secret'));
        setRefreshtoken(sessionStorage.getItem('refreshtoken'));
        setClientid(sessionStorage.getItem('clientId'));
        setAccesToken(sessionStorage.getItem('accesstoken'));
    },[])
    const onFinish = async (values:ValuesAddImgType) => {
        SetPreloader(true);
       try{ 
            const formData = new FormData();
            formData.append('file',values.file[0].originFileObj);
            const res = await axios.post<postImgType>('http://gallery.dev.webant.ru/api/media_objects',
                                formData,{headers:{ Authorization:`Bearer ${accessToken}`}});
            const Res = await axios.get<GetNewTokenAPItype>('http://gallery.dev.webant.ru/oauth/v2/token',{
                            params : {
                                    'client_id':clientId,
                                    'grant_type':'refresh_token',
                                    'refresh_token':refreshToken,
                                    'client_secret':secret
                                }})
            const accesstoken = Res.data.access_token;
            const refreshtoken=Res.data.refresh_token;
            sessionStorage.removeItem('accesstoken');
            sessionStorage.removeItem('refreshtoken');
            sessionStorage.setItem('accesstoken',accesstoken);
            setAccesToken(accesstoken);
            sessionStorage.setItem('refreshtoken',refreshtoken);
            setRefreshtoken(refreshtoken);
            const data = {
                'name':values.ImageName,
                'description':values.Desc,
                image:`http://gallery.dev.webant.ru/api/media_objects/${res.data.id}`
            }
            if (values.radio_group == 1) {
                let New = true;
                let Popular = false;
                Object.assign(data,{'new':New,'popular':Popular})
            } else {
                let New = false;
                let Popular = true;
                Object.assign(data,{'new':New,'popular':Popular})
            }
            await axios.post<ImgApiType>('http://gallery.dev.webant.ru/api/photos',data,{headers:{ Authorization:`Bearer ${accessToken}`}})
            SetPreloader(false);
            SetImg(true);
        }
        catch{
            SetPreloader(false);
            setError(true);
        }
    }
    if (preloader) {
        return <Preloader/>
    }
    return (
        <Main>
            <Head>
                <title>AddImg</title>
            </Head>
            <div className={style.addImg}>
                {ImageAddInServer && <div className={style.ImageAddInServer}>
                    <h2 className={style.h2}>Картинка успешно загружена</h2> 
                </div>}
                {error && <div className={style.ImageAddInServer}>
                    <h2 className={style.error}>Произошла ошибка</h2>
                </div>
                }
                <div className={style.AddImgPage}>
                    <Form  onFinish={onFinish} ><br/>
                        <Form.Item name="ImageName"  rules={[{required: true, message: 'Please input your Image name!',},]}>        
                                <Input placeholder="ImageName"  size="large"/>
                        </Form.Item><br/>
                        <Form.Item name="radio_group" label="Категория">
                                <Radio.Group>
                                    <Radio value="1" >New</Radio>
                                    <Radio value="2" >Popular</Radio>
                                </Radio.Group>
                        </Form.Item>
                        <Form.Item name="Desc"  rules={[{required: true,message: 'Please input your Description!',},]}>
                                <Input size="large" placeholder="Description"/>
                        </Form.Item>
                        <Form.Item name="file" label="Upload File"  valuePropName="fileList" getValueFromEvent={normFile}>
                            <Upload listType="picture" name="logo" beforeUpload={(file:File, fileList:{})=>false} >
                            <Button icon={<UploadOutlined />}>Click to upload</Button>
                            </Upload>
                        </Form.Item>
                        <div className={style.buttonContainer}>
                            <Form.Item>
                                    <Button  type="primary" htmlType="submit" className={style.button} >
                                        Отправить
                                    </Button>
                            </Form.Item>
                        </div>
                    </Form>
                </div>
            </div>
        </Main>
    )
}

type E = {fileList: []} | [] | undefined
type postImgType = {
    file:string
    name:string
    id:number   
}
type GetNewTokenAPItype= {
    refresh_token:string,
    access_token:string
    client_secret:string,
    error: string | null
}
export type ValuesAddImgType = {
    radio_group: string | number;
    Desc:string,
    ImageName: string;
    file: File;
    New: string | boolean;
    Popular: string | boolean;
};
