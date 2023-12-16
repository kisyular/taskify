// Import necessary modules and utilities
import { auth, currentUser } from '@clerk/nextjs'
import { ACTION, ENTITY_TYPE } from '@prisma/client'

// Import database connection
import { db } from '@/lib/db'

// Define the properties expected by the createAuditLog function
interface Props {
	entityId: string
	entityType: ENTITY_TYPE
	entityTitle: string
	action: ACTION
}

// Define a function to create an audit log entry
export const createAuditLog = async (props: Props) => {
	try {
		// Fetch organization ID using authentication
		const { orgId } = auth()

		// Retrieve current user details
		const user = await currentUser()

		// Throw an error if user or org ID is missing
		if (!user || !orgId) {
			throw new Error('User not found!')
		}

		// Destructure properties from the function arguments
		const { entityId, entityType, entityTitle, action } = props

		// Create an entry in the audit log table in the database
		await db.auditLog.create({
			data: {
				orgId, // Organization ID associated with the action
				entityId, // ID of the entity being logged
				entityType, // Type of the entity (e.g., CARD, BOARD, etc.)
				entityTitle, // Title or name of the entity
				action, // Action performed (e.g., CREATE, UPDATE, DELETE)
				userId: user.id, // ID of the user performing the action
				userImage: user?.imageUrl, // Image URL of the user (if available)
				userName: user?.firstName + ' ' + user?.lastName, // Full name of the user
			},
		})
	} catch (error) {
		// Log any errors encountered during the process
		console.log('[AUDIT_LOG_ERROR]', error)
	}
}
