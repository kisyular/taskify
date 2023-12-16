import { ACTION, AuditLog } from '@prisma/client'

export const generateLogMessage = (log: AuditLog) => {
	const { action, entityType } = log

	switch (action) {
		case ACTION.CREATE:
			return `created ${entityType.toLowerCase()} `
		case ACTION.UPDATE:
			return `updated ${entityType.toLowerCase()} `
		case ACTION.DELETE:
			return `deleted ${entityType.toLowerCase()} `
		default:
			return `unknown action ${entityType.toLowerCase()} `
	}
}
