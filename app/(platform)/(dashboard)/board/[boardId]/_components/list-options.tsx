'use client'

import { toast } from 'sonner'
import { List } from '@prisma/client'
import { ElementRef, useRef } from 'react'
import { LucideTrash2, MoreHorizontal, X } from 'lucide-react'

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
	PopoverClose,
} from '@/components/ui/popover'
import { useAction } from '@/hooks/use-action'
import { Button } from '@/components/ui/button'
import { FormSubmit } from '@/components/form/form-submit'
import { Separator } from '@/components/ui/separator'

interface ListOptionsProps {
	data: List
	onAddCard: () => void
}

const ListOptions = ({ data, onAddCard }: ListOptionsProps) => {
	const closeRef = useRef<ElementRef<'button'>>(null)

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button className='h-auto w-auto p-2' variant='ghost'>
					<MoreHorizontal className='h-4 w-4' />
				</Button>
			</PopoverTrigger>
			<PopoverContent
				className='px-3 pt-3 pb-3'
				side='bottom'
				align='start'
			>
				<div className='text-sm font-medium text-center dark:text-slate-400 text-slate-700 pb-4'>
					List actions
				</div>
				<PopoverClose ref={closeRef} asChild>
					<Button
						className='h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600'
						variant='ghost'
					>
						<X className='h-4 w-4' />
					</Button>
				</PopoverClose>
				<Button
					onClick={onAddCard}
					className='rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm'
					variant='ghost'
				>
					Add card...
				</Button>
				<form>
					<input readOnly hidden name='id' id='id' value={data.id} />
					<input
						readOnly
						hidden
						name='boardId'
						id='boardId'
						value={data.boardId}
					/>
					<FormSubmit
						variant='ghost'
						className='rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm'
					>
						Copy list...
					</FormSubmit>
				</form>
				<Separator />
				<form>
					<input readOnly hidden name='id' id='id' value={data.id} />
					<input
						readOnly
						hidden
						name='boardId'
						id='boardId'
						value={data.boardId}
					/>
					<FormSubmit
						variant='destructive'
						className='rounded-lg w-full h-auto p-2 px-5 justify-start font-normal text-sm'
					>
						Delete this list
						<LucideTrash2 className='ml-2' />
					</FormSubmit>
				</form>
			</PopoverContent>
		</Popover>
	)
}
export default ListOptions
