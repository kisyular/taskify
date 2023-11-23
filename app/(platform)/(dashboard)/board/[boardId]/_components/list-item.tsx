'use client'

import { ElementRef, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { ListWithCards } from '@/types'
import ListHeader from './list-header'
import CardForm from './card-form'
import CardItem from './card-item'

interface ListItemProps {
	data: ListWithCards
	index: number
}

const ListItem = ({ data, index }: ListItemProps) => {
	const textareaRef = useRef<ElementRef<'textarea'>>(null)

	const [isEditing, setIsEditing] = useState(false)

	const disableEditing = () => {
		setIsEditing(false)
	}

	const enableEditing = () => {
		setIsEditing(true)
		setTimeout(() => {
			textareaRef.current?.focus()
		})
	}
	return (
		<li className='shrink-0 h-full w-[272px] select-none'>
			<div className='w-full rounded-md dark:bg-black dark:text-white  shadow-md pb-2 bg-white text-black dark:border-white border-white border'>
				<ListHeader data={data} onAddCard={enableEditing} />
				<ol
					className={cn(
						'mx-1 px-1 py-0.5 flex flex-col gap-y-2',
						data.cards.length > 0 ? 'mt-2' : 'mt-0'
					)}
				>
					{data.cards.map((card, index) => (
						<CardItem index={index} key={card.id} data={card} />
					))}
				</ol>
				<CardForm
					listId={data.id}
					ref={textareaRef}
					isEditing={isEditing}
					enableEditing={enableEditing}
					disableEditing={disableEditing}
				/>
			</div>
		</li>
	)
}
export default ListItem
