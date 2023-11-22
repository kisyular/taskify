'use server'

import { auth } from '@clerk/nextjs' // Importing authentication functions from Clerk for Next.js
import { revalidatePath } from 'next/cache' // Importing revalidatePath function from Next.js cache module

import { db } from '@/lib/db' // Importing database functions from a custom module
import { createSafeAction } from '@/lib/create-safe-action' // Importing a function to create safe actions

import { CreateList } from './schema' // Importing the schema for creating a list
import { InputType, ReturnType } from './types' // Importing input and return types

// Handler function responsible for creating a list
const handler = async (data: InputType): Promise<ReturnType> => {
	// Extracting userId and orgId from the authenticated user session
	const { userId, orgId } = auth()

	// Checking if userId or orgId is missing, indicating unauthorized access
	if (!userId || !orgId) {
		return {
			error: 'Unauthorized', // Return an error if unauthorized
		}
	}

	const { title, boardId } = data // Extracting title and boardId from the input data
	let list

	try {
		const board = await db.board.findUnique({
			where: {
				id: boardId,
				orgId,
			},
		})

		// Checking if the board exists
		if (!board) {
			return {
				error: 'Board not found', // Return an error message if the board is not found
			}
		}

		// Finding the last list item in the board and determining the order for the new list
		const lastList = await db.list.findFirst({
			where: { boardId: boardId },
			orderBy: { order: 'desc' },
			select: { order: true },
		})

		const newOrder = lastList ? lastList.order + 1 : 1 // Calculating the order for the new list

		// Creating a new list entry in the database
		list = await db.list.create({
			data: {
				title,
				boardId,
				order: newOrder,
			},
		})
	} catch (error) {
		return {
			error: 'Failed to create.', // Return an error message if creation fails
		}
	}

	revalidatePath(`/board/${boardId}`) // Triggering revalidation of the path related to the board after creating the list
	return { data: list } // Returning the newly created list upon successful creation
}

// Creating a safe action using the 'createSafeAction' function, which validates input against the specified schema and executes the handler function
export const createList = createSafeAction(CreateList, handler)
