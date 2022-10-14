import { ChangeEvent, KeyboardEvent } from 'react'
import { Box, InputLabel, TextField } from '@mui/material'
import MuiPhoneNumber from 'material-ui-phone-number-2'

export interface InputProps {
	id: string
	name: string
	type: string
	value: string | number
	onChange: (e: string | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
	error: boolean | undefined
	helperText?: string | undefined | null | false
	margin?: boolean
	required?: boolean
	fullWidth?: boolean
	customLabel?: string
	disabled?: boolean
	onKeyDown?: (event: KeyboardEvent<HTMLDivElement>) => void
}

const Input = ({
	id,
	name,
	type,
	value,
	onChange,
	error,
	helperText,
	margin,
	required,
	customLabel,
	onKeyDown,
	disabled,
	fullWidth,
}: InputProps) => {
	return (
		<>
			<Box mb={1} width={fullWidth ? '97%' : 'auto'}>
				<InputLabel
					sx={{
						color: 'black',
						mb: '0.2rem',
						pl: 1,
						fontWeight: '500',
					}}
				>
					{customLabel || name.charAt(0).toUpperCase() + name.slice(1)}
					{required && ' *'}
				</InputLabel>
				{type === 'tel' ? (
					<MuiPhoneNumber
						defaultCountry="us"
						id={id}
						name={name}
						value={value}
						onChange={onChange}
						error={error}
						helperText={helperText}
						onKeyDown={onKeyDown}
						variant="outlined"
						sx={{
							width: '16rem',
							mr: margin ? 4 : 0,
							mb: margin ? 4 : 0,
						}}
						disabled={disabled}
						fullWidth={fullWidth}
					/>
				) : (
					<TextField
						id={id}
						name={name}
						type={type}
						value={value}
						onChange={onChange}
						error={error}
						helperText={helperText}
						onKeyDown={onKeyDown}
						sx={{
							width: !fullWidth ? '16rem' : '100%',
							mr: margin ? 4 : 0,
							mb: margin ? 4 : 0,
						}}
						disabled={disabled}
						fullWidth={fullWidth}
					/>
				)}
			</Box>
		</>
	)
}

export default Input
