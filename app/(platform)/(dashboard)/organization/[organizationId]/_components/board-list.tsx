import Link from 'next/link'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { HelpCircle, User2 } from 'lucide-react'

import { db } from '@/lib/db'
import { Skeleton } from '@/components/ui/skeleton'
import { Hint } from '@/components/hint'
import { FormPopover } from '@/components/forms/form-popover'

export const BoardList = async () => {
	const { orgId } = auth()

	if (!orgId) {
		return redirect('/select-org')
	}

	return (
		<div className='space-y-4'>
			<div className='flex items-center font-semibold text-lg dark:text-slate-400 text-slate-500'>
				<User2 className='h-6 w-6 mr-2' />
				Your boards
			</div>
			<div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'>
				<FormPopover sideOffset={10} side='right'>
					<div
						role='button'
						className='aspect-video relative h-full w-full bg-muted rounded-sm flex flex-col gap-y-1 items-center justify-center hover:opacity-75 transition bg-slate-300 dark:bg-slate-700'
					>
						<p className='text-sm'>Create new board</p>
						<span className='text-xs'>5 remaining</span>
						<Hint
							sideOffset={40}
							description={`
                Free Workspaces can have up to 5 open boards. For unlimited boards upgrade this workspace.
              `}
						>
							<HelpCircle className='absolute bottom-2 right-2 h-[14px] w-[14px]' />
						</Hint>
					</div>
				</FormPopover>
			</div>
		</div>
	)
}

BoardList.Skeleton = function SkeletonBoardList() {
	return (
		<div className='grid gird-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'>
			<Skeleton className='aspect-video h-full w-full p-2 bg-slate-500 dark:bg-slate-400' />
			<Skeleton className='aspect-video h-full w-full p-2 bg-slate-500 dark:bg-slate-400' />
			<Skeleton className='aspect-video h-full w-full p-2 bg-slate-500 dark:bg-slate-400' />
			<Skeleton className='aspect-video h-full w-full p-2 bg-slate-500 dark:bg-slate-400' />
			<Skeleton className='aspect-video h-full w-full p-2 bg-slate-500 dark:bg-slate-400' />
			<Skeleton className='aspect-video h-full w-full p-2 bg-slate-500 dark:bg-slate-400' />
			<Skeleton className='aspect-video h-full w-full p-2 bg-slate-500 dark:bg-slate-400' />
			<Skeleton className='aspect-video h-full w-full p-2 bg-slate-500 dark:bg-slate-400' />
		</div>
	)
}
