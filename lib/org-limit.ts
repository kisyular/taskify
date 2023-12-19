// Importing the auth module from Clerk to handle authentication
import { auth } from '@clerk/nextjs'

// Importing the database module
import { db } from '@/lib/db'
// Importing the constant for maximum free boards
import { MAX_FREE_BOARDS } from '@/constants/boards'

// Function to increment the available count
export const incrementAvailableCount = async () => {
	// Getting the organization ID from the auth module
	const { orgId } = auth()

	// If there is no organization ID, throw an error
	if (!orgId) {
		throw new Error('Unauthorized')
	}

	// Fetching the organization limit from the database
	const orgLimit = await db.orgLimit.findUnique({
		where: { orgId },
	})

	// If the organization limit exists, update it
	if (orgLimit) {
		await db.orgLimit.update({
			where: { orgId },
			data: { count: orgLimit.count + 1 },
		})
		// If the organization limit does not exist, create it
	} else {
		await db.orgLimit.create({
			data: { orgId, count: 1 },
		})
	}
}

// Function to decrease the available count
export const decreaseAvailableCount = async () => {
	// Getting the organization ID from the auth module
	const { orgId } = auth()

	// If there is no organization ID, throw an error
	if (!orgId) {
		throw new Error('Unauthorized')
	}

	// Fetching the organization limit from the database
	const orgLimit = await db.orgLimit.findUnique({
		where: { orgId },
	})

	// If the organization limit exists, update it
	if (orgLimit) {
		await db.orgLimit.update({
			where: { orgId },
			data: { count: orgLimit.count > 0 ? orgLimit.count - 1 : 0 },
		})
		// If the organization limit does not exist, create it
	} else {
		await db.orgLimit.create({
			data: { orgId, count: 1 },
		})
	}
}

// Function to check if there is an available count
export const hasAvailableCount = async () => {
	// Getting the organization ID from the auth module
	const { orgId } = auth()

	// If there is no organization ID, throw an error
	if (!orgId) {
		throw new Error('Unauthorized')
	}

	// Fetching the organization limit from the database
	const orgLimit = await db.orgLimit.findUnique({
		where: { orgId },
	})

	// If the organization limit does not exist or the count is less than the maximum free boards, return true
	if (!orgLimit || orgLimit.count < MAX_FREE_BOARDS) {
		return true
		// Otherwise, return false
	} else {
		return false
	}
}

// Function to get the available count
export const getAvailableCount = async () => {
	// Getting the organization ID from the auth module
	const { orgId } = auth()

	// If there is no organization ID, return 0
	if (!orgId) {
		return 0
	}

	// Fetching the organization limit from the database
	const orgLimit = await db.orgLimit.findUnique({
		where: { orgId },
	})

	// If the organization limit does not exist, return 0
	if (!orgLimit) {
		return 0
	}

	// Return the count of the organization limit
	return orgLimit.count
}
