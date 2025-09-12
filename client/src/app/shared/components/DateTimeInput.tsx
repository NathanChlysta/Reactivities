import type { TextFieldProps } from "@mui/material"
import { useController, type FieldValues, type UseControllerProps } from "react-hook-form"
import { DateTimePicker, type DateTimePickerProps } from '@mui/x-date-pickers';

// DateTimePickerProps supposedly needs a <Date> but it throws an error and doesnt seem to do anything
type Props<T extends FieldValues> = {} & UseControllerProps<T> & TextFieldProps & DateTimePickerProps;


export default function DateTimeInput<T extends FieldValues>(props: Props<T>) {
    const { field, fieldState } = useController({ ...props });

    return (
        <DateTimePicker
            {...props}
            value={field.value ? new Date(field.value) : null}
            onChange={value => {
                field.onChange(new Date(value!))
            }}
            sx={{ width: '100%' }}
            slotProps={{
                textField: {
                    onBlur: field.onBlur,
                    error: !!fieldState.error,
                    helperText: fieldState.error?.message
                }
            }}
        />
    )
}
