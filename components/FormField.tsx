import React from 'react'
import {
    Form,
    FormControl,
    FormDescription,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
  import { Input } from "@/components/ui/input"
  import Image from 'next/image'
import { Control, Controller, FieldValues, Path } from 'react-hook-form'

interface FormFieldProps<T extends FieldValues> {
    name: Path<T>;
    control: Control<T>;
    label: string;
    placeholder?: string;
    type?: 'text' | 'email' | 'password' | 'file';
}

const FormField = ({name, control, label, placeholder, type="text"}: FormFieldProps<T>) => (
    <Controller
        name={name}
        control={control}
        render={({ field }) => (
            <FormItem>
                <FormLabel className='label'>{label}</FormLabel>
                    <FormControl>
                        <Input 
                            className='input' 
                            placeholder={placeholder} 
                            type={type}
                            {...field} 
                        />
                    </FormControl>
                <FormMessage />
            </FormItem>
        )}
    />
)

export default FormField