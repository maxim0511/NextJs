import { Modal } from "antd";
import 'antd/dist/antd.css'; 
import axios, { AxiosResponse } from "axios";
import Head from "next/head";
import React from "react";
import { useState, useEffect } from "react";
import { useInfiniteQuery } from "react-query";
import { Main } from "../../layout/Main";
import Preloader from "../../layout/Preloader";
import style from './new.module.css'


export default  function New({New,Popular,limit,caching}){
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
    const modalOpen = (event:HTMLImageElement)=>{
         setSrc(event.src);
         //@ts-ignore
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
    const FetchImages= ({pageParam=1}):Promise<AxiosResponse> =>axios.get(`http://gallery.dev.webant.ru/api/photos?new=${New}&popular=${Popular}&page=${pageParam}&limit=${limit}`,).then((res)=>res.data);
    const {data,fetchNextPage,status} = useInfiniteQuery(`${caching}`, async ( {pageParam=1} ) => {
        return await FetchImages({pageParam})
    }, {
        refetchOnWindowFocus: false,
        getNextPageParam: (lastPage, allPages) => allPages.length + 1,
    }) 
    if(!data?.pages) return <Preloader/>
    if (status == 'loading' ) return (<div>LOADING...</div>)
    return (
        <Main>
            <Head>
                <title>New</title>
            </Head>
            <div className={style.Page_content}>
               {data?.pages.map((element:{data: ImgApiType[]},i:number) => (
                    <React.Fragment key={i}>
                        {element.data.map((u:ImgApiType) => (
                            <div className={style.content__item}  key={u.id} >
                            <img src={'http://gallery.dev.webant.ru/media/' + u.image.name} id={u.name} key={u.desription} alt={u.image.name} onClick={(event) =>//@ts-ignore
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

export async function getServerSideProps(){
    const New = true;
    const Popular = false;
    const limit = 20;
    const caching = 'ImagesNew'
    return{
        props:{
            New,Popular,limit,caching
        }
    }
}

export type ImgApiType = {
    id:number,
    name:string,
    dateCreate:string,
    desription:string,
    new:boolean ,
    popular:boolean ,
    image: {
        id:number,
        name:string
    },
    user:null
}