import Link from 'next/link'
import Image from 'next/image'

export const HeaderLogo = () => {
    return(
        <Link href="/">
            <div className='items-center hidden lg:flex'>
                <Image src="/logo.png" alt='Logo' height={28} width={44}/>
                
                
            </div>
        </Link>
    )
}