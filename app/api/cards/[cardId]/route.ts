import { auth } from '@clerk/nextjs' // Importing authentication from Clerk
import { NextResponse } from 'next/server' // Importing NextResponse from next/server

import { db } from '@/lib/db' // Importing the database

// This is an async function for GET requests
export async function GET(
	req: Request, // The request object
	{ params }: { params: { cardId: string } } // Destructuring params from the request
) {
	try {
		const { userId, orgId } = auth() // Getting userId and orgId from auth

		// Checking if userId or orgId is not present
		if (!userId || !orgId) {
			// If not present, return Unauthorized
			return new NextResponse('Unauthorized', { status: 401 })
		}

		// If present, find the unique card from the database
		const card = await db.card.findUnique({
			where: {
				id: params.cardId, // Where cardId matches the params cardId
				list: {
					board: {
						orgId, // And orgId matches the auth orgId
					},
				},
			},
			include: {
				list: {
					select: {
						title: true, // Selecting the title of the list
					},
				},
			},
		})

		// Return the card as a JSON response
		return NextResponse.json(card)
	} catch (error) {
		// If there's an error, return Internal Error
		return new NextResponse('Internal Error', { status: 500 })
	}
}
