'use server'

import { auth } from '@clerk/nextjs' // Importing authentication functions from Clerk for Next.js
import { revalidatePath } from 'next/cache' // Importing revalidatePath function from Next.js cache module

import { db } from '@/lib/db' // Importing database functions from a custom module
import { createSafeAction } from '@/lib/create-safe-action' // Importing a function to create safe actions

import { UpdateList } from './schema' // Importing the schema for updating a list
import { InputType, ReturnType } from './types' // Importing input and return types
import { createAuditLog } from '@/lib/create-audit-log'
import { ACTION, ENTITY_TYPE } from '@prisma/client'

// Handler function responsible for updating a list
const handler = async (data: InputType): Promise<ReturnType> => {
	// Extracting userId and orgId from the authenticated user session
	const { userId, orgId } = auth()

	// Checking if userId or orgId is missing, indicating unauthorized access
	if (!userId || !orgId) {
		return {
			error: 'Unauthorized', // Return an error if unauthorized
		}
	}

	const { title, id, boardId } = data // Extracting title, id, and boardId from the input data
	let list

	try {
		// Attempting to update the list in the database
		list = await db.list.update({
			where: {
				id,
				boardId,
				board: {
					orgId,
				},
			},
			data: {
				title,
			},
		})

		await createAuditLog({
			entityTitle: list.title,
			entityId: list.id,
			entityType: ENTITY_TYPE.CARD,
			action: ACTION.UPDATE,
		})
	} catch (error) {
		return {
			error: 'Failed to update.', // Return an error message if the update fails
		}
	}

	revalidatePath(`/board/${boardId}`) // Triggering revalidation of the path related to the board after updating the list
	return { data: list } // Returning the updated list upon successful update
}

// Creating a safe action using the 'createSafeAction' function, which validates input against the specified schema and executes the handler function
export const updateList = createSafeAction(UpdateList, handler)
