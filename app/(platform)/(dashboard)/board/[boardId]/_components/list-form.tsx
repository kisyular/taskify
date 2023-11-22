'use client'

import { toast } from 'sonner'
import { Plus, X } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useState, useRef, ElementRef } from 'react'
import { useEventListener, useOnClickOutside } from 'usehooks-ts'

import { useAction } from '@/hooks/use-action'
import { createList } from '@/actions/create-list'
import { Button } from '@/components/ui/button'
import { FormInput } from '@/components/form/form-input'
import { FormSubmit } from '@/components/form/form-submit'
import { ListWrapper } from './list-wrapper'

const ListForm = () => {
	const router = useRouter()
	const params = useParams()

	const formRef = useRef<ElementRef<'form'>>(null)
	const inputRef = useRef<ElementRef<'input'>>(null)

	const [isEditing, setIsEditing] = useState(false)

	const enableEditing = () => {
		setIsEditing(true)
		setTimeout(() => {
			inputRef.current?.focus()
		})
	}

	const disableEditing = () => {
		setIsEditing(false)
	}

	const onKeyDown = (e: KeyboardEvent) => {
		if (e.key === 'Escape') {
			disableEditing()
		}
	}

	useEventListener('keydown', onKeyDown)
	useOnClickOutside(formRef, disableEditing)

	const { execute, fieldErrors } = useAction(createList, {
		onSuccess: (data) => {
			toast.success(`List "${data.title}" created`)
			disableEditing()
			router.refresh()
		},
		onError: (error) => {
			toast.error(error)
		},
	})

	const onSubmit = (formData: FormData) => {
		const title = formData.get('title') as string
		const boardId = formData.get('boardId') as string

		execute({
			title,
			boardId,
		})
	}

	if (isEditing) {
		return (
			<ListWrapper>
				<form
					action={onSubmit}
					ref={formRef}
					className='w-full p-3 rounded-md space-y-4 shadow-md bg-white dark:bg-black border-black dark:border-white border'
				>
					<FormInput
						ref={inputRef}
						errors={fieldErrors}
						id='title'
						className='text-sm px-2 py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition'
						placeholder='Enter list title...'
					/>
					<input
						readOnly
						hidden
						value={params.boardId}
						name='boardId'
					/>
					<div className='flex items-center gap-x-1'>
						<FormSubmit className='bg-black dark:bg-white text-white hover:bg-black/75 dark:text-black'>
							Add list
						</FormSubmit>
						<Button
							onClick={disableEditing}
							size='sm'
							variant='default'
						>
							<X className='h-5 w-5' />
						</Button>
					</div>
				</form>
			</ListWrapper>
		)
	}
	return (
		<ListWrapper>
			<Button
				onClick={enableEditing}
				variant='default'
				className='w-full rounded-md transition p-3 flex items-center font-medium text-sm dark:bg-white bg-black px-2.5 py-1 h-12 dark:border-black border-white border'
			>
				<Plus className='h-4 w-4 mr-2' />
				Add a list
			</Button>
		</ListWrapper>
	)
}
export default ListForm
