'use server'

import { auth } from '@clerk/nextjs' // Importing authentication functions from Clerk for Next.js
import { revalidatePath } from 'next/cache' // Importing revalidatePath function from Next.js cache module

import { db } from '@/lib/db' // Importing database functions from a custom module
import { createSafeAction } from '@/lib/create-safe-action' // Importing a function to create safe actions

import { CopyList } from './schema' // Importing the schema for copying a list
import { InputType, ReturnType } from './types' // Importing input and return types
import { createAuditLog } from '@/lib/create-audit-log'
import { ACTION, ENTITY_TYPE } from '@prisma/client'

// Handler function responsible for copying a list
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
		// Finding the list to copy along with its cards from the database
		const listToCopy = await db.list.findUnique({
			where: {
				id,
				boardId,
				board: {
					orgId,
				},
			},
			include: {
				cards: true, // Including associated cards with the list
			},
		})

		// Checking if the list to copy exists
		if (!listToCopy) {
			return { error: 'List not found' } // Return an error message if the list is not found
		}

		// Finding the last list in the board to determine the order for the new list copy
		const lastList = await db.list.findFirst({
			where: { boardId },
			orderBy: { order: 'desc' },
			select: { order: true },
		})

		const newOrder = lastList ? lastList.order + 1 : 1 // Calculating the order for the new list copy

		// Creating a new list entry by copying the existing list and its cards
		list = await db.list.create({
			data: {
				boardId: listToCopy.boardId,
				title: `${listToCopy.title} - Copy`, // Appending '- Copy' to the title of the new list
				order: newOrder,
				cards: {
					createMany: {
						data: listToCopy.cards.map((card) => ({
							title: card.title,
							description: card.description,
							order: card.order,
						})),
					},
				},
			},
			include: {
				cards: true, // Including associated cards with the new list copy
			},
		})

		await createAuditLog({
			entityTitle: list.title,
			entityId: list.id,
			entityType: ENTITY_TYPE.LIST,
			action: ACTION.CREATE,
		})
	} catch (error) {
		return {
			error: 'Failed to copy.', // Return an error message if the copying process fails
		}
	}

	revalidatePath(`/board/${boardId}`) // Triggering revalidation of the path related to the board after copying the list
	return { data: list } // Returning the copied list upon successful copy
}

// Creating a safe action using the 'createSafeAction' function, which validates input against the specified schema and executes the handler function
export const copyList = createSafeAction(CopyList, handler)
