import Link from 'next/link'
import Image from 'next/image'
import localFont from 'next/font/local'

import { cn } from '@/lib/utils'

const headingFont = localFont({
	src: '../public/fonts/font.woff2',
})

export const Logo = () => {
	return (
		<Link href='/'>
			<div className='hidden md:flex items-center gap-x-2'>
				<Image
					src='/logo-black.png'
					height='40'
					width='40'
					alt='Logo'
					className='dark:hidden'
					priority={true}
				/>
				<Image
					src='/logo-white.png'
					height='40'
					width='40'
					alt='Logo'
					className='hidden dark:block'
					priority={true}
				/>
				<p
					className={cn(
						'text-lg text-slate-900 pb-1 dark:text-slate-50',
						headingFont.className
					)}
				>
					Taskify
				</p>
			</div>
		</Link>
	)
}
