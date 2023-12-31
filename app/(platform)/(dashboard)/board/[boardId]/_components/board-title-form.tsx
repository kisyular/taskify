'use client'

import { Board } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { ElementRef, useRef, useState } from 'react'
import { FormInput } from '@/components/form/form-input'
import { ArrowLeftCircle, LucideEdit } from 'lucide-react'
import { updateBoard } from '@/actions/update-board'
import { useAction } from '@/hooks/use-action'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface BoardTitleFormProps {
	data: Board
}

const BoardTitleForm = ({ data }: BoardTitleFormProps) => {
	const formRef = useRef<ElementRef<'form'>>(null)
	const inputRef = useRef<ElementRef<'input'>>(null)

	const [title, setTitle] = useState(data.title)
	const [isEditing, setIsEditing] = useState(false)
	const [isFocused, setIsFocused] = useState(false) // New state to track input focus
	const router = useRouter()

	const enableEditing = () => {
		setIsEditing(true)
		setTimeout(() => {
			inputRef.current?.focus()
			inputRef.current?.select()
		})
	}

	const disableEditing = () => {
		setIsEditing(false)
	}

	const goBack = () => {
		router.back()
	}

	const onBlur = () => {
		formRef.current?.requestSubmit()
		setIsFocused(false) // Update isFocused state when input is blurred
	}

	const onFocus = () => {
		setIsFocused(true) // Update isFocused state when input is focused
	}
	const { execute } = useAction(updateBoard, {
		onSuccess: (data) => {
			toast.success(`Board "${data.title}" updated!`)
			setTitle(data.title)
			disableEditing()
		},
		onError: (error) => {
			toast.error(error)
		},
	})

	const onSubmit = (formData: FormData) => {
		const title = formData.get('title') as string
		if (title === data.title) {
			return
		}
		execute({
			title,
			id: data.id,
		})
		setIsFocused(false)
	}
	if (isEditing) {
		return (
			<>
				<form
					action={onSubmit}
					ref={formRef}
					className='flex items-center gap-x-2'
				>
					<FormInput
						ref={inputRef}
						id='title'
						onBlur={onBlur}
						onFocus={onFocus}
						defaultValue={title}
						className='text-lg font-bold px-[7px] py-1 h-7 bg-transparent focus-visible:outline-none focus-visible:ring-transparent border-none'
					/>
				</form>
				{isFocused && <LucideEdit />}
			</>
		)
	}

	return (
		<>
			<Button
				onClick={goBack}
				variant='outline'
				className='font-bold text-xl h-auto w-auto p-1 px-2 text-black dark:text-white'
			>
				<ArrowLeftCircle className='mr-1' />
				Back
			</Button>
			<Button
				onClick={enableEditing}
				variant='ghost'
				className='font-bold text-lg h-auto w-auto p-1 px-2 text-black dark:text-white'
			>
				{title}
			</Button>
		</>
	)
}
export default BoardTitleForm
