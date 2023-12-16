'use server'

// Import necessary modules and utilities
import { auth } from '@clerk/nextjs'
import { revalidatePath } from 'next/cache'

// Import database and other relevant dependencies
import { db } from '@/lib/db'
import { createSafeAction } from '@/lib/create-safe-action'

// Import necessary types and schemas
import { DeleteCard } from './schema'
import { InputType, ReturnType } from './types'
import { createAuditLog } from '@/lib/create-audit-log'
import { ACTION, ENTITY_TYPE } from '@prisma/client'

// Define the handler function that deletes a card
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
		// Delete the card from the database
		card = await db.card.delete({
			where: {
				id,
				list: {
					board: {
						orgId,
					},
				},
			},
		})

		await createAuditLog({
			entityTitle: card.title,
			entityId: card.id,
			entityType: ENTITY_TYPE.CARD,
			action: ACTION.DELETE,
		})
	} catch (error) {
		// Return an error message if the deletion fails
		return {
			error: 'Failed to delete.',
		}
	}

	// Revalidate the cache for a specific board path after the deletion
	revalidatePath(`/board/${boardId}`)

	// Return the deleted card data if successful
	return { data: card }
}

// Export a safe action using a schema and the defined handler function
export const deleteCard = createSafeAction(DeleteCard, handler)
