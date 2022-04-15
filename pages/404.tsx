import Link from "next/link";

export default function ErrorPage () {
    return (
    <>
        <div>
            <h3>Ошибка,данная страница не найдена</h3>
            <Link href={'/'}><a>Вернуться</a></Link>
        </div>
        <style jsx>{`
            div {
                text-align:center;
            }
            div h3 {
                color:red;
            }
            div a {
                text-decoration:none;
            }
        `}</style>
    </>
    )
}