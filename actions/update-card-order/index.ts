'use server'

// This code serves to handle a request to update the order of cards. It authenticates the user, then executes a database transaction to update the card orders based on the provided input data. If successful, it revalidates the cache for a specific board path and returns the updated cards data. In case of any issues with authentication, database transactions, or cache revalidation, appropriate error messages are returned.

// Import necessary modules and utilities
import { auth } from '@clerk/nextjs'
import { revalidatePath } from 'next/cache'

// Import database and other relevant dependencies
import { db } from '@/lib/db'
import { createSafeAction } from '@/lib/create-safe-action'

// Import necessary types and schemas
import { UpdateCardOrder } from './schema'
import { InputType, ReturnType } from './types'

// Define the handler function that performs card reordering
const handler = async (data: InputType): Promise<ReturnType> => {
	// Fetch user and organization IDs using authentication
	const { userId, orgId } = auth()

	// Check if the user or org IDs are missing
	if (!userId || !orgId) {
		return {
			error: 'Unauthorized',
		}
	}

	const { items, boardId } = data
	let updatedCards

	try {
		// Create a transaction to update card orders based on input data
		const transaction = items.map((card) =>
			db.card.update({
				where: {
					id: card.id,
					list: {
						board: {
							orgId,
						},
					},
				},
				data: {
					order: card.order,
					listId: card.listId,
				},
			})
		)

		// Execute the transaction to update the card orders
		updatedCards = await db.$transaction(transaction)
	} catch (error) {
		// Return an error message if the transaction fails
		return {
			error: 'Failed to reorder.',
		}
	}

	// Revalidate the cache for a specific board path after the update
	revalidatePath(`/board/${boardId}`)

	// Return the updated cards data if successful
	return { data: updatedCards }
}

// Export a safe action using a schema and the defined handler function
export const updateCardOrder = createSafeAction(UpdateCardOrder, handler)
