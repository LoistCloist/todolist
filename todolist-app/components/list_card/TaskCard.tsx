'user client'
import {
    Checkbox,
    Card,
    Text,
    Group
} from '@mantine/core'

interface TaskCardProps {
    title: string;
}
export default function TaskCard({ title }: TaskCardProps) {
    return (
        <>
        <Card>
            <Group justify="flex-start">
                <Checkbox radius="sm" />
                <Text>{title}</Text>
            </Group>
        </Card>
        </>
    );
}