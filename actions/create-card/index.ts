'use server'

import { auth } from '@clerk/nextjs' // Importing authentication functions from Clerk for Next.js
import { revalidatePath } from 'next/cache' // Importing revalidatePath function from Next.js cache module

import { db } from '@/lib/db' // Importing database functions from a custom module
import { createSafeAction } from '@/lib/create-safe-action' // Importing a function to create safe actions

import { CreateCard } from './schema' // Importing the schema for creating a card
import { InputType, ReturnType } from './types' // Importing input and return types

// Handler function responsible for creating a card
const handler = async (data: InputType): Promise<ReturnType> => {
	// Extracting userId and orgId from the authenticated user session
	const { userId, orgId } = auth()

	// Checking if userId or orgId is missing, indicating unauthorized access
	if (!userId || !orgId) {
		return {
			error: 'Unauthorized', // Return an error if unauthorized
		}
	}

	const { title, boardId, listId } = data // Extracting title, boardId, and listId from the input data
	let card

	try {
		// Finding the list associated with the listId and board's orgId from the database
		const list = await db.list.findUnique({
			where: {
				id: listId,
				board: {
					orgId,
				},
			},
		})

		// Checking if the list exists
		if (!list) {
			return {
				error: 'List not found', // Return an error message if the list is not found
			}
		}

		// Finding the last card in the list to determine the order for the new card creation
		const lastCard = await db.card.findFirst({
			where: { listId },
			orderBy: { order: 'desc' },
			select: { order: true },
		})

		const newOrder = lastCard ? lastCard.order + 1 : 1 // Calculating the order for the new card creation

		// Creating a new card entry in the specified list with the provided title and order
		card = await db.card.create({
			data: {
				title,
				listId,
				order: newOrder,
			},
		})
	} catch (error) {
		return {
			error: 'Failed to create.', // Return an error message if the card creation fails
		}
	}

	revalidatePath(`/board/${boardId}`) // Triggering revalidation of the path related to the board after creating the card
	return { data: card } // Returning the created card upon successful creation
}

// Creating a safe action using the 'createSafeAction' function, which validates input against the specified schema and executes the handler function
export const createCard = createSafeAction(CreateCard, handler)
