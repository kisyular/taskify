// Importing the authentication module from Clerk
import { auth } from '@clerk/nextjs'

// Importing the database module
import { db } from '@/lib/db'

// Defining a constant for the number of milliseconds in a day
const DAY_IN_MS = 86_400_000

// Function to check the subscription status of a user
export const checkSubscription = async () => {
	// Getting the organization ID from the authentication module
	const { orgId } = auth()

	// If there is no organization ID, return false
	if (!orgId) {
		return false
	}

	// Fetching the subscription details of the organization from the database
	const orgSubscription = await db.orgSubscription.findUnique({
		where: {
			orgId,
		},
		select: {
			stripeSubscriptionId: true,
			stripeCurrentPeriodEnd: true,
			stripeCustomerId: true,
			stripePriceId: true,
		},
	})

	// If there is no subscription for the organization, return false
	if (!orgSubscription) {
		return false
	}

	// Checking if the subscription is valid by comparing the current time with the subscription end time
	const isValid =
		orgSubscription.stripePriceId &&
		orgSubscription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS >
			Date.now()

	// Return the validity of the subscription
	return !!isValid
}
