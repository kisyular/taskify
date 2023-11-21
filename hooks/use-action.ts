// This code defines a custom React hook named useAction that facilitates executing actions and managing their states (loading, errors, field errors, data) in a consistent manner. Here's an explanation with inline comments:

import { useState, useCallback } from 'react'
import { ActionState, FieldErrors } from '@/lib/create-safe-action'

// Define a type for an action function that takes an input and returns a Promise of ActionState
type Action<TInput, TOutput> = (
	data: TInput
) => Promise<ActionState<TInput, TOutput>>

// Define options for useAction hook, allowing callbacks for success, error, and completion
interface UseActionOptions<TOutput> {
	onSuccess?: (data: TOutput) => void
	onError?: (error: string) => void
	onComplete?: () => void
}

export const useAction = <TInput, TOutput>(
	action: Action<TInput, TOutput>, // Action function to execute
	options: UseActionOptions<TOutput> = {} // Optional callbacks for success, error, and completion
) => {
	const [fieldErrors, setFieldErrors] = useState<
		FieldErrors<TInput> | undefined
	>(undefined)
	const [error, setError] = useState<string | undefined>(undefined)
	const [data, setData] = useState<TOutput | undefined>(undefined)
	const [isLoading, setIsLoading] = useState<boolean>(false)

	const execute = useCallback(
		async (input: TInput) => {
			setIsLoading(true) // Set loading state to true before executing the action

			try {
				const result = await action(input) // Execute the provided action function with input data

				if (!result) {
					return // If no result, exit early
				}

				setFieldErrors(result.fieldErrors) // Set field errors received from the action result

				if (result.error) {
					setError(result.error) // Set the error message received from the action result
					options.onError?.(result.error) // Call the provided onError callback if available
				}

				if (result.data) {
					setData(result.data) // Set the data received from the action result
					options.onSuccess?.(result.data) // Call the provided onSuccess callback if available
				}
			} finally {
				setIsLoading(false) // Set loading state to false after action execution
				options.onComplete?.() // Call the provided onComplete callback if available
			}
		},
		[action, options] // Dependency array for the useCallback hook
	)

	return {
		execute, // Function to execute the action
		fieldErrors, // Field errors received from the action result
		error, // Error message received from the action result
		data, // Data received from the action result
		isLoading, // Loading state while the action is being executed
	}
}
