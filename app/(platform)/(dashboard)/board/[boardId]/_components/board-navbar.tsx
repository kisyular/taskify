import { Board } from '@prisma/client'

interface BoardNavbarProps {
	data: Board
}

const BoardNavbar = async ({ data }: BoardNavbarProps) => {
	return (
		<div className='w-full h-14 z-[40] dark:bg-black/50 bg-white/50 fixed top-14 flex items-center px-6 gap-x-4 text-white border-t border-slate-700 dark:border-slate-50'>
			BoardNavbar
		</div>
	)
}
export default BoardNavbar
