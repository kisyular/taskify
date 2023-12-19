import Stripe from 'stripe' // Importing Stripe library
import { headers } from 'next/headers' // Importing headers from Next.js
import { NextResponse } from 'next/server' // Importing NextResponse from Next.js server

import { db } from '@/lib/db' // Importing the database instance
import { stripe } from '@/lib/stripe' // Importing the stripe instance

// This is the POST function for the webhook route
export async function POST(req: Request) {
	// Parsing the request body
	const body = await req.text()
	// Getting the Stripe signature from the headers
	const signature = headers().get('Stripe-Signature') as string

	let event: Stripe.Event // Declaring a variable to hold the Stripe event

	// Constructing the Stripe event using the body, signature and the Stripe webhook secret
	try {
		event = stripe.webhooks.constructEvent(
			body,
			signature,
			process.env.STRIPE_WEBHOOK_SECRET!
		)
	} catch (error) {
		// If there's an error, return a 400 status with a message
		return new NextResponse('Webhook error', { status: 400 })
	}

	// Casting the event data object to a Stripe Checkout Session
	const session = event.data.object as Stripe.Checkout.Session

	// If the event type is "checkout.session.completed"
	if (event.type === 'checkout.session.completed') {
		// Retrieve the subscription from Stripe
		const subscription = await stripe.subscriptions.retrieve(
			session.subscription as string
		)

		// If the orgId is not present in the session metadata, return a 400 status with a message
		if (!session?.metadata?.orgId) {
			return new NextResponse('Org ID is required', { status: 400 })
		}

		// Create a new orgSubscription in the database with the subscription data
		await db.orgSubscription.create({
			data: {
				orgId: session?.metadata?.orgId,
				stripeSubscriptionId: subscription.id,
				stripeCustomerId: subscription.customer as string,
				stripePriceId: subscription.items.data[0].price.id,
				stripeCurrentPeriodEnd: new Date(
					subscription.current_period_end * 1000
				),
			},
		})
	}

	// If the event type is "invoice.payment_succeeded"
	if (event.type === 'invoice.payment_succeeded') {
		// Retrieve the subscription from Stripe
		const subscription = await stripe.subscriptions.retrieve(
			session.subscription as string
		)

		// Update the orgSubscription in the database with the new subscription data
		await db.orgSubscription.update({
			where: {
				stripeSubscriptionId: subscription.id,
			},
			data: {
				stripePriceId: subscription.items.data[0].price.id,
				stripeCurrentPeriodEnd: new Date(
					subscription.current_period_end * 1000
				),
			},
		})
	}

	// If everything goes well, return a 200 status
	return new NextResponse(null, { status: 200 })
}
