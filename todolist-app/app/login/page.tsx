'use client'
import {
    Button,
    Checkbox,
    Group,
    PasswordInput,
    TextInput
} from '@mantine/core';
import { useForm } from '@mantine/form';

export default function LoginScreen() {
    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            email: '',
            termsOfService: false,
        },
        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
        },
    });

    return (
        <form onSubmit={form.onSubmit((values) => console.log(values))}>
            <TextInput
                withAsterisk
                required
                label="Email"
                placeholder="your@email.com"
                key={form.key('email')}
                {...form.getInputProps('email')}
            />
            <PasswordInput
                label="Input label"
                description="Input description"
                placeholder="Input placeholder"
                
            />
            <Checkbox
                mt="md"
                label="Remember me."
                key={form.key('termsOfService')}
                {...form.getInputProps('termsOfService', { type: 'checkbox' })}
            />
            <Group justify="flex-end" mt="md">
                <Button type="submit">Submit</Button>
            </Group>
        </form>
    )
}
