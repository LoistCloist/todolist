'use client'
import { 
    AppShell, 
    Burger,
    Grid
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

      <AppShell.Main style={{ display: 'flex', flexDirection: 'column', height: '100%'}}>
        <Grid grow style={{ display: 'flex'}}>
            <Grid.Col span={6}><ListCard></ListCard></Grid.Col>
            <Grid.Col span={6}><ListCard></ListCard></Grid.Col>
        </Grid>
        <Grid grow style={{ display: 'flex'}}>
            <Grid.Col span={6}><ListCard></ListCard></Grid.Col>
            <Grid.Col span={6}><ListCard></ListCard></Grid.Col>
        </Grid>
      </AppShell.Main>
    </AppShell>
  );
}