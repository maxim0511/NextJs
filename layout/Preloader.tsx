import img from './Preloader.svg'
import style from './Preloader.module.css'
import Image from 'next/image';

const Preloader = () => {
    return (
        <div className={style.Preloader}>
            <div className={style.Preloader_img}><Image src={img} alt='Logo'/><br/>Loading</div>
        </div>
    )
}

export  default Preloader;