'use server'

import { db } from '@/lib/db'
import { z } from 'zod'

const CreateBoard = z.object({
	title: z
		.string({
			required_error: 'Title is required',
			invalid_type_error: 'Title is required',
		})
		.min(3, {
			message: 'Title is too short.',
		}),
	// image: z.string({
	// 	required_error: 'Image is required',
	// 	invalid_type_error: 'Image is required',
	// }),
})

export async function create(formData: FormData) {
	const { title } = CreateBoard.parse({
		title: formData.get('title'),
	})
	await db.board.create({
		data: {
			title,
		},
	})
}
