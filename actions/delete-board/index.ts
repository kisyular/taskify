'use server'

import { auth } from '@clerk/nextjs' // Importing authentication functions from Clerk for Next.js
import { revalidatePath } from 'next/cache' // Importing revalidatePath function from Next.js cache module
import { redirect } from 'next/navigation' // Importing redirect function from Next.js navigation module

import { db } from '@/lib/db' // Importing database functions from a custom module
import { createSafeAction } from '@/lib/create-safe-action' // Importing a function to create safe actions

import { DeleteBoard } from './schema' // Importing the schema for deleting a board
import { InputType, ReturnType } from './types' // Importing input and return types

// Handler function responsible for deleting the board
const handler = async (data: InputType): Promise<ReturnType> => {
	// Extracting userId and orgId from the authenticated user session
	const { userId, orgId } = auth()

	// Checking if userId or orgId is missing, indicating unauthorized access
	if (!userId || !orgId) {
		return {
			error: 'Unauthorized', // Return an error if unauthorized
		}
	}

	const { id } = data // Extracting the ID of the board to be deleted

	let board

	try {
		// Attempting to delete the board from the database
		board = await db.board.delete({
			where: {
				id,
				orgId,
			},
		})
	} catch (error) {
		return {
			error: 'Failed to delete.', // Return an error message if deletion fails
		}
	}

	revalidatePath(`/organization/${orgId}`) // Triggering revalidation of the path related to the organization after deletion
	redirect(`/organization/${orgId}`) // Redirecting to the organization page after deletion
}

// Creating a safe action using the 'createSafeAction' function, which validates input against the specified schema and executes the handler function
export const deleteBoard = createSafeAction(DeleteBoard, handler)
