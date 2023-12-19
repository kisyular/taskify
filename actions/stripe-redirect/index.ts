'use server' // This line is used to specify the environment where the code will run. In this case, it's the server-side.

import { auth, currentUser } from '@clerk/nextjs' // Importing authentication and current user details from Clerk.
import { revalidatePath } from 'next/cache' // Importing a function to revalidate a specific path from Next.js cache.
import { ACTION, ENTITY_TYPE } from '@prisma/client' // Importing constants from Prisma client.

import { db } from '@/lib/db' // Importing the database instance.
import { createAuditLog } from '@/lib/create-audit-log' // Importing a function to create audit logs.
import { createSafeAction } from '@/lib/create-safe-action' // Importing a function to create safe actions.

import { StripeRedirect } from './schema' // Importing the StripeRedirect schema.
import { InputType, ReturnType } from './types' // Importing the types for input and return.

import { absoluteUrl } from '@/lib/utils' // Importing a utility function to create absolute URLs.
import { stripe } from '@/lib/stripe' // Importing the Stripe instance.

// Defining the handler function which will be executed when this action is called.
const handler = async (data: InputType): Promise<ReturnType> => {
	const { userId, orgId } = auth() // Getting the user ID and organization ID from the authentication details.
	const user = await currentUser() // Getting the current user details.

	// Checking if the user ID, organization ID, and user details exist.
	if (!userId || !orgId || !user) {
		return {
			error: 'Unauthorized', // If not, return an error.
		}
	}

	const settingsUrl = absoluteUrl(`/organization/${orgId}`) // Creating the settings URL for the organization.

	let url = '' // Initializing the URL variable.

	// Trying to create a Stripe session.
	try {
		const orgSubscription = await db.orgSubscription.findUnique({
			where: {
				orgId,
			},
		})

		// If the organization has a subscription and a Stripe customer ID.
		if (orgSubscription && orgSubscription.stripeCustomerId) {
			const stripeSession = await stripe.billingPortal.sessions.create({
				customer: orgSubscription.stripeCustomerId,
				return_url: settingsUrl,
			})

			url = stripeSession.url // Setting the URL to the Stripe session URL.
		} else {
			// If the organization doesn't have a subscription, create a new Stripe checkout session.
			const stripeSession = await stripe.checkout.sessions.create({
				success_url: settingsUrl,
				cancel_url: settingsUrl,
				payment_method_types: ['card'],
				mode: 'subscription',
				billing_address_collection: 'auto',
				customer_email: user.emailAddresses[0].emailAddress,
				line_items: [
					{
						price_data: {
							currency: 'USD',
							product_data: {
								name: 'Taskify Pro',
								description:
									'Unlimited boards for your organization',
							},
							unit_amount: 2000,
							recurring: {
								interval: 'year',
							},
						},
						quantity: 1,
					},
				],
				metadata: {
					orgId,
				},
			})

			url = stripeSession.url || '' // Setting the URL to the Stripe session URL or an empty string if it doesn't exist.
		}
	} catch (error) {
		console.log(error)
		return {
			error: 'Something went wrong!', // If an error occurs, return an error message.
		}
	}

	revalidatePath(`/organization/${orgId}`) // Revalidating the organization path in the Next.js cache.
	return { data: url } // Returning the URL.
}

// Exporting the Stripe redirect action.
export const stripeRedirect = createSafeAction(StripeRedirect, handler)
