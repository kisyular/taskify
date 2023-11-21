import { create } from '@/actions/create-board'

const OrganizationIdPage = () => {
	return (
		<div className='w-full mb-20'>
			<form action={create} data-np-autofill-form-type data-np-checked>
				<input
					id='title'
					name='title'
					required
					placeholder='Enter Board Title'
					className='border-black border-1 p-1'
				/>
			</form>
		</div>
	)
}
export default OrganizationIdPage
