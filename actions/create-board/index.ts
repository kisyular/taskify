'use server'

import { auth } from '@clerk/nextjs' // Importing authentication functions from Clerk for Next.js
import { InputType, ReturnType } from './types' // Importing input and return types
import { CreateBoard } from './schema' // Importing the schema for creating a board
import { db } from '@/lib/db' // Importing database functions from a custom module
import { revalidatePath } from 'next/cache' // Importing revalidatePath function from Next.js cache module
import { createSafeAction } from '@/lib/create-safe-action' // Importing a function to create safe actions
import { createAuditLog } from '@/lib/create-audit-log'
import { ACTION, ENTITY_TYPE } from '@prisma/client'

import { incrementAvailableCount, hasAvailableCount } from '@/lib/org-limit'
import { checkSubscription } from '@/lib/subscription'

// Handler function responsible for creating a board
const handler = async (data: InputType): Promise<ReturnType> => {
	// Extracting userId and orgId from the authenticated user session
	const { userId, orgId } = auth()

	// Checking if userId or orgId is missing, indicating unauthorized access
	if (!userId || !orgId) {
		return {
			error: 'Unauthorized', // Return an error if unauthorized
		}
	}

	const canCreate = await hasAvailableCount()
	const isPro = await checkSubscription()

	if (!canCreate && !isPro) {
		return {
			error: 'You have reached your limit of free boards. Please upgrade to create more.',
		}
	}

	const { title, image } = data // Extracting title and image from the input data

	// Splitting the image data string into individual fields
	const [imageId, imageThumbUrl, imageFullUrl, imageLinkHTML, imageUserName] =
		image.split('|')

	// Checking if any required image fields are missing
	if (
		!imageId ||
		!imageThumbUrl ||
		!imageFullUrl ||
		!imageUserName ||
		!imageLinkHTML
	) {
		return {
			error: 'Missing fields. Failed to create board.', // Return an error message if any required field is missing
		}
	}

	let board

	try {
		// Attempting to create a new board entry in the database
		board = await db.board.create({
			data: {
				title,
				orgId,
				imageId,
				imageThumbUrl,
				imageFullUrl,
				imageUserName,
				imageLinkHTML,
			},
		})
		if (!isPro) {
			await incrementAvailableCount() // Incrementing the available count of boards for the organization
		}
		await createAuditLog({
			entityTitle: board.title,
			entityId: board.id,
			entityType: ENTITY_TYPE.BOARD,
			action: ACTION.CREATE,
		})
	} catch (error) {
		console.log(error)
		return {
			error: 'Failed to create.', // Return an error message if creation fails
		}
	}

	revalidatePath(`/board/${board.id}`) // Triggering revalidation of the path related to the newly created board
	return { data: board } // Returning the newly created board data upon successful creation
}

// Creating a safe action using the 'createSafeAction' function, which validates input against the specified schema and executes the handler function
export const createBoard = createSafeAction(CreateBoard, handler)
