// This code is responsible for handling a request to update the order of lists. It first checks for user authentication and authorization. Then, it executes a database transaction to update the list orders based on the provided input data. If successful, it revalidates the cache for a specific board path and returns the updated lists data. If there are any issues with authentication, database transactions, or cache revalidation, appropriate error messages are returned.

'use server'

// Import necessary modules and utilities
import { auth } from '@clerk/nextjs'
import { revalidatePath } from 'next/cache'

// Import database and other relevant dependencies
import { db } from '@/lib/db'
import { createSafeAction } from '@/lib/create-safe-action'

// Import necessary types and schemas
import { UpdateListOrder } from './schema'
import { InputType, ReturnType } from './types'

// Define the handler function that performs list reordering
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
	let lists

	try {
		// Create a transaction to update list orders based on input data
		const transaction = items.map((list) =>
			db.list.update({
				where: {
					id: list.id,
					board: {
						orgId,
					},
				},
				data: {
					order: list.order,
				},
			})
		)

		// Execute the transaction to update the list orders
		lists = await db.$transaction(transaction)
	} catch (error) {
		// Return an error message if the transaction fails
		return {
			error: 'Failed to reorder.',
		}
	}

	// Revalidate the cache for a specific board path after the update
	revalidatePath(`/board/${boardId}`)

	// Return the updated lists data if successful
	return { data: lists }
}

// Export a safe action using a schema and the defined handler function
export const updateListOrder = createSafeAction(UpdateListOrder, handler)
