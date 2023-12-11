'use client'

import { ListWithCards } from '@/types'
import ListForm from './list-form'
import { useEffect, useState } from 'react'
import ListItem from './list-item'
import { DragDropContext, Droppable } from '@hello-pangea/dnd'

interface ListContainerProps {
	data: ListWithCards[]
	boardId: string
}

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
	const result = Array.from(list)
	const [removed] = result.splice(startIndex, 1)
	result.splice(endIndex, 0, removed)

	return result
}

const ListContainer = ({ data, boardId }: ListContainerProps) => {
	const [orderedData, setOrderedData] = useState(data)

	useEffect(() => {
		setOrderedData(data)
	}, [data])

	// Function triggered on drag-end event
	const onDragEnd = (result: any) => {
		const { destination, source, type } = result

		if (!destination) {
			// If there's no destination, do nothing
			return
		}

		// Handle list and card reordering
		if (type === 'list') {
			// Reorder and update list items
			const items = reorder(
				orderedData,
				source.index,
				destination.index
			).map((item, index) => ({ ...item, order: index }))

			// Update the ordered data with reordered list items
			setOrderedData(items)

			// Execute action to update the list order in the backend
		}

		if (type === 'card') {
			// Clone the ordered data
			let newOrderedData = [...orderedData]

			// Find source and destination lists
			const sourceList = newOrderedData.find(
				(list) => list.id === source.droppableId
			)
			const destList = newOrderedData.find(
				(list) => list.id === destination.droppableId
			)

			if (!sourceList || !destList) {
				// If source or destination lists are not found, do nothing
				return
			}

			// Check and initialize cards in source and destination lists
			if (!sourceList.cards) {
				sourceList.cards = []
			}

			if (!destList.cards) {
				destList.cards = []
			}

			// Handle card movement within the same list
			if (source.droppableId === destination.droppableId) {
				// Reorder cards within the same list
				const reorderedCards = reorder(
					sourceList.cards,
					source.index,
					destination.index
				)

				// Update card order within the same list
				reorderedCards.forEach((card, idx) => {
					card.order = idx
				})

				// Update the source list with reordered cards
				sourceList.cards = reorderedCards

				// Update the ordered data with the modified list
				setOrderedData(newOrderedData)

				// Execute action to update card order within the list
			} else {
				// Handle card movement to a different list
				const [movedCard] = sourceList.cards.splice(source.index, 1)
				movedCard.listId = destination.droppableId
				destList.cards.splice(destination.index, 0, movedCard)

				// Update card orders in source and destination lists
				sourceList.cards.forEach((card, idx) => {
					card.order = idx
				})

				destList.cards.forEach((card, idx) => {
					card.order = idx
				})

				// Update the ordered data with modified source and destination lists
				setOrderedData(newOrderedData)

				// Execute action to update card order between different lists
			}
		}
	}

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<Droppable droppableId='lists' type='list' direction='horizontal'>
				{(provided) => (
					<ol
						{...provided.droppableProps}
						ref={provided.innerRef}
						className='flex gap-x-3 h-full'
					>
						{orderedData.map((list, index) => {
							return (
								<ListItem
									key={list.id}
									index={index}
									data={list}
								/>
							)
						})}
						{provided.placeholder}
						<ListForm />
						<div className='flex-shrink-0 w-1' />
					</ol>
				)}
			</Droppable>
		</DragDropContext>
	)
}
export default ListContainer
