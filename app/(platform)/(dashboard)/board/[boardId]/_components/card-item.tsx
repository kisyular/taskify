'use client'

import { Card } from '@prisma/client'
import { Draggable } from '@hello-pangea/dnd'
import { useCardModal } from '@/hooks/use-card-modal'

interface CardItemProps {
	data: Card
	index: number
}
const CardItem = ({ data, index }: CardItemProps) => {
	const cardModal = useCardModal()
	return (
		<Draggable draggableId={data.id} index={index}>
			{(provided) => (
				<div
					{...provided.draggableProps}
					{...provided.dragHandleProps}
					ref={provided.innerRef}
					role='button'
					onClick={() => cardModal.onOpen(data.id)}
					className='truncate border border-accent hover:border-black py-2 px-3 
					text-sm rounded-md shadow-sm dark:hover:border-white bg-white dark:bg-black'
				>
					{data.title}
				</div>
			)}
		</Draggable>
	)
}

export default CardItem
