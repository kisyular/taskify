'use server'

import { auth } from '@clerk/nextjs' // Importing authentication functions from Clerk for Next.js
import { revalidatePath } from 'next/cache' // Importing revalidatePath function from Next.js cache module

import { db } from '@/lib/db' // Importing database functions from a custom module
import { createSafeAction } from '@/lib/create-safe-action' // Importing a function to create safe actions

import { DeleteList } from './schema' // Importing the schema for deleting a list
import { InputType, ReturnType } from './types' // Importing input and return types

// Handler function responsible for deleting a list
const handler = async (data: InputType): Promise<ReturnType> => {
	// Extracting userId and orgId from the authenticated user session
	const { userId, orgId } = auth()

	// Checking if userId or orgId is missing, indicating unauthorized access
	if (!userId || !orgId) {
		return {
			error: 'Unauthorized', // Return an error if unauthorized
		}
	}

	const { id, boardId } = data // Extracting id and boardId from the input data
	let list

	try {
		// Attempting to delete the list from the database
		list = await db.list.delete({
			where: {
				id,
				boardId,
				board: {
					orgId,
				},
			},
		})
	} catch (error) {
		return {
			error: 'Failed to delete.', // Return an error message if the deletion fails
		}
	}

	revalidatePath(`/board/${boardId}`) // Triggering revalidation of the path related to the board after deleting the list
	return { data: list } // Returning the deleted list upon successful deletion
}

// Creating a safe action using the 'createSafeAction' function, which validates input against the specified schema and executes the handler function
export const deleteList = createSafeAction(DeleteList, handler)
