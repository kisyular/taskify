'use server'

// Import necessary modules and utilities
import { auth } from '@clerk/nextjs'
import { revalidatePath } from 'next/cache'

// Import database and other relevant dependencies
import { db } from '@/lib/db'
import { createSafeAction } from '@/lib/create-safe-action'

// Import necessary types and schemas
import { UpdateCard } from './schema'
import { InputType, ReturnType } from './types'

//TODO: Import additional utilities for audit logging

// Define the handler function that updates a card
const handler = async (data: InputType): Promise<ReturnType> => {
	// Fetch user and organization IDs using authentication
	const { userId, orgId } = auth()

	// Check if the user or org IDs are missing
	if (!userId || !orgId) {
		return {
			error: 'Unauthorized',
		}
	}

	const { id, boardId, ...values } = data
	let card

	try {
		// Update the card in the database with provided values
		card = await db.card.update({
			where: {
				id,
				list: {
					board: {
						orgId,
					},
				},
			},
			data: {
				...values,
			},
		})

		//TODO: Create an audit log entry for the card update action
	} catch (error) {
		// Return an error message if the update fails
		return {
			error: 'Failed to update.',
		}
	}

	// Revalidate the cache for a specific board path after the update
	revalidatePath(`/board/${boardId}`)

	// Return the updated card data if successful
	return { data: card }
}

// Export a safe action using a schema and the defined handler function
export const updateCard = createSafeAction(UpdateCard, handler)
