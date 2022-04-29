import Head from "next/head";
import { Main } from "../../layout/Main";
import style from "../New/new.module.css";
import Preloader from "../../layout/Preloader";
import { Modal } from "antd";
import 'antd/dist/antd.css'; 
import axios, { AxiosResponse } from "axios";
import { useState, useEffect } from "react";
import { useInfiniteQuery } from "react-query";
import { ImgApiType } from "../New";
import React from "react";


type propsType = {
    New:boolean,
    Popular:boolean,
    limit:number,
    caching:string,
    im:ImgApiType[]
}
export default function Popular ({New,Popular,limit,caching,im}:propsType) {
    const [fetching,SetFetching]=useState(true);
    const [modal,setModal] = useState(false);
    const [SrcInfo,setSrc] = useState('');
    const [AltkeyInfo,setAltkey] = useState('');
    const [NameInfo,setName] = useState('');
    const [DescInfo,setDesc] = useState('');
    const modalStyle = {
        padding:25,
        height:700,
    }
    const modalOpen = (event:any)=>{
         setSrc(event.src);
         setAltkey(event.key);
         setDesc(event.alt);
         setName(event.id);
         setModal(true)
    }
    useEffect(()=>{
        if (fetching){
            fetchNextPage()
         }
        SetFetching(false);
    },[fetching])
    useEffect(()=>{
        document.addEventListener('scroll',scrollHandler)
            return function () {
              document.removeEventListener('scroll',scrollHandler)
    }
    },[])
    const scrollHandler = (e:any )=>{
        if(e.target.documentElement.scrollHeight - (e.target.documentElement.scrollTop + window.innerHeight)<120){
            SetFetching(true)
        }
    }    
    const FetchImages= ({pageParam=1}):Promise<AxiosResponse> =>
        axios.get(`http://gallery.dev.webant.ru/api/photos?new=${New}&popular=${Popular}&page=${pageParam}&limit=${limit}`,)
                .then((res)=>res.data)
    
    const {data,fetchNextPage,status} = useInfiniteQuery(`${caching}`, async ( {pageParam=1} ) => {
        return await FetchImages({pageParam})
    }, {
        refetchOnWindowFocus: false,
        getNextPageParam: (lastPage, allPages) => allPages.length + 1,
    }) 
    if(!data?.pages) return <Preloader/>
    if (status == 'loading' ) return <Preloader/>
    return (
        <Main>
            <Head>
                <title>Popular</title>
            </Head>
            <div className={style.Page_content}>
               {data?.pages.map((element:{data: ImgApiType[]},i:number) => (
                    <React.Fragment key={i}>
                        {element.data.map((u:ImgApiType) => (
                            <div className={style.content__item}  key={u.id} >
                            <img src={'http://gallery.dev.webant.ru/media/' + u.image.name} id={u.name} key={u.desription} alt={u.image.name} onClick={(event) =>
                            modalOpen(event.target)}/>
                            {/**@ts-ignore */}
                            <Modal bodyStyle={modalStyle}  centered={true} visible={modal} footer={null}  onCancel={() => setModal(false)}  width={700} > 
                                    <div className={style.container_modal_img}>
                                        <img className={style.modal_img} src={SrcInfo} alt={AltkeyInfo}/>
                                    </div><br/><br/>
                                    <div className ={style.modal_img_info}>
                                        <h1 className={style.modal_img_name}>{DescInfo}</h1><br/>
                                        <p className={style.modal_img_desc}>{NameInfo}</p>
                                    </div>
                            </Modal>
                    </div>
                        ))}
                    </React.Fragment>
                ))}
            </div>  
        </Main>
    )
}

export const getStaticProps= async()=>{
    const initial = await axios.get(`http://gallery.dev.webant.ru/api/photos?new=true&popular=false&page=1&limit=20`);
    const im =initial.data
    const New = false;
    const Popular = true;
    const limit = 20;
    const caching = 'ImagesPopular'
    return{
        props:{
            New,Popular,limit,caching,im
        }
    }
}
