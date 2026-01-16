'use client'
import {
    AppShell,
    Burger,
    Grid,
    Box,
    Stack
 } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { NavbarSearch } from '@/components/navbar/NavbarSearchMantine';
import ListCard from '@/components/list_card/ListCard';

export default function Dashboard() {
  const [opened, { toggle }] = useDisclosure();
  
  return (
    <AppShell
      padding="md"
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened, desktop: !opened},
      }}
    >
      <AppShell.Header>
        <Burger
          opened={opened}
          onClick={toggle}
          size="sm"
        />

      </AppShell.Header>

      <AppShell.Navbar>
        <NavbarSearch></NavbarSearch>
      </AppShell.Navbar>

      <AppShell.Main>
        <Stack h="100vh">
          <Grid h="50vh">
              <Grid.Col span={6} h="100%"><ListCard title="Urgent + Important"/></Grid.Col>
              <Grid.Col span={6} h="100%"><ListCard title="Priority 2"/></Grid.Col>
          </Grid>
          <Grid h="50vh" mt="lg">
              <Grid.Col span={6} h="100%"><ListCard title="Priority 3"/></Grid.Col>
              <Grid.Col span={6} h="100%"><ListCard title="Priority 4"/></Grid.Col>
          </Grid>
        </Stack>
      </AppShell.Main>
    </AppShell>
  );
}