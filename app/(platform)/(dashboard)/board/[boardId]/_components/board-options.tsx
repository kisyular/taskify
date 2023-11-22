'use client'

import { toast } from 'sonner'
import { LucideTrash2, X, SettingsIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
	Popover,
	PopoverClose,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'

import { deleteBoard } from '@/actions/delete-board'
import { useAction } from '@/hooks/use-action'

interface BoardOptionsProps {
	id: string
}

const BoardOptions = ({ id }: BoardOptionsProps) => {
	const { execute, isLoading } = useAction(deleteBoard, {
		onError: (error) => {
			toast.error(error)
		},
	})

	const onDelete = () => {
		execute({ id })
	}

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button className='h-auto w-auto p-2' variant='default'>
					<SettingsIcon className='h-4 w-4' />
				</Button>
			</PopoverTrigger>
			<PopoverContent
				className='px-4 pt-3 pb-3'
				side='bottom'
				align='start'
			>
				<div className='text-sm font-medium text-center text-slate-600 pb-4'>
					Board actions
				</div>
				<PopoverClose asChild>
					<Button
						className='h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600'
						variant='ghost'
					>
						<X className='h-4 w-4' />
					</Button>
				</PopoverClose>

				<Button
					variant='destructive'
					onClick={onDelete}
					disabled={isLoading}
					className='w-full h-auto p-2 px-5 justify-start font-normal text-sm rounded-lg '
				>
					<LucideTrash2 className='mr-2' />
					Delete this board
				</Button>
			</PopoverContent>
		</Popover>
	)
}
export default BoardOptions
