'use server'

// Import necessary modules and utilities
import { auth } from '@clerk/nextjs'
import { revalidatePath } from 'next/cache'

// Import database and other relevant dependencies
import { db } from '@/lib/db'
import { createSafeAction } from '@/lib/create-safe-action'

// Import necessary types and schemas
import { CopyCard } from './schema'
import { InputType, ReturnType } from './types'
import { createAuditLog } from '@/lib/create-audit-log'
import { ACTION, ENTITY_TYPE } from '@prisma/client'

// Define the handler function that copies a card
const handler = async (data: InputType): Promise<ReturnType> => {
	// Fetch user and organization IDs using authentication
	const { userId, orgId } = auth()

	// Check if the user or org IDs are missing
	if (!userId || !orgId) {
		return {
			error: 'Unauthorized',
		}
	}

	const { id, boardId } = data
	let card

	try {
		// Find the card to be copied based on the provided ID and organizational ID
		const cardToCopy = await db.card.findUnique({
			where: {
				id,
				list: {
					board: {
						orgId,
					},
				},
			},
		})

		// Return an error if the card to copy is not found
		if (!cardToCopy) {
			return { error: 'Card not found' }
		}

		// Find the last card in the same list to determine the new order
		const lastCard = await db.card.findFirst({
			where: { listId: cardToCopy.listId },
			orderBy: { order: 'desc' },
			select: { order: true },
		})

		// Determine the new order for the copied card
		const newOrder = lastCard ? lastCard.order + 1 : 1

		// Create a new card with copied details and incremented order
		card = await db.card.create({
			data: {
				title: `${cardToCopy.title} - Copy`,
				description: cardToCopy.description,
				order: newOrder,
				listId: cardToCopy.listId,
			},
		})

		await createAuditLog({
			entityTitle: card.title,
			entityId: card.id,
			entityType: ENTITY_TYPE.CARD,
			action: ACTION.CREATE,
		})
	} catch (error) {
		// Return an error message if the card copying process fails
		return {
			error: 'Failed to copy.',
		}
	}

	// Revalidate the cache for a specific board path after the card copying
	revalidatePath(`/board/${boardId}`)

	// Return the newly copied card data if successful
	return { data: card }
}

// Export a safe action using a schema and the defined handler function
export const copyCard = createSafeAction(CopyCard, handler)
