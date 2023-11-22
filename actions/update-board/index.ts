'use server'

import { auth } from '@clerk/nextjs' // Importing authentication functions from Clerk for Next.js
import { revalidatePath } from 'next/cache' // Importing revalidatePath function from Next.js cache module

import { db } from '@/lib/db' // Importing database functions from a custom module
import { createSafeAction } from '@/lib/create-safe-action' // Importing a function to create safe actions

import { UpdateBoard } from './schema' // Importing the schema for updating a board
import { InputType, ReturnType } from './types' // Importing input and return types

// Handler function responsible for updating the board data
const handler = async (data: InputType): Promise<ReturnType> => {
	// Extracting userId and orgId from the authenticated user session
	const { userId, orgId } = auth()

	// Checking if userId or orgId is missing, indicating unauthorized access
	if (!userId || !orgId) {
		return {
			error: 'Unauthorized', // Return an error if unauthorized
		}
	}

	const { title, id } = data // Extracting title and id from the input data
	let board // Variable to hold the board data

	try {
		// Attempting to update the board information in the database
		board = await db.board.update({
			where: {
				id,
				orgId,
			},
			data: {
				title,
			},
		})
	} catch (error) {
		// Handling any errors that occur during the board update process
		return {
			error: 'Failed to update.', // Return an error message if the update fails
		}
	}

	revalidatePath(`/board/${id}`) // Triggering revalidation of the path related to the updated board
	return { data: board } // Returning the updated board data upon successful update
}

// Creating a safe action using the 'createSafeAction' function, which validates input and executes the handler function
export const updateBoard = createSafeAction(UpdateBoard, handler)
