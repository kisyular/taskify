import { z } from 'zod'

// Define a type for field errors where each field of type T can have an optional array of strings as errors
export type FieldErrors<T> = {
	[K in keyof T]?: string[]
}

// Define a type for action state which may contain field errors, a generic error message, or some output data
export type ActionState<TInput, TOutput> = {
	fieldErrors?: FieldErrors<TInput>
	error?: string | null
	data?: TOutput
}

// Function to create a safe action with input validation and handling
export const createSafeAction = <TInput, TOutput>(
	schema: z.Schema<TInput>, // Schema for input validation using the 'zod' library
	handler: (validatedData: TInput) => Promise<ActionState<TInput, TOutput>> // Handler function to process validated data and return ActionState
) => {
	// Return an async function that takes input data and returns a Promise of ActionState
	return async (data: TInput): Promise<ActionState<TInput, TOutput>> => {
		// Validate the input data against the provided schema
		const validationResult = schema.safeParse(data)

		// If validation fails, return field errors
		if (!validationResult.success) {
			return {
				fieldErrors: validationResult.error.flatten()
					.fieldErrors as FieldErrors<TInput>,
				// If there's a validation error, other fields like 'error' and 'data' will not be set
			}
		}

		// If validation is successful, call the handler function with the validated data
		return handler(validationResult.data)
	}
}
