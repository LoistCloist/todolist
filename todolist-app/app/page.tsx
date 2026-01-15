'use client'
import { Butcherman } from "next/font/google";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import {
  Button
} from '@mantine/core'

export default function Home() {
  const router = useRouter();
  
  return (
    <>
      <Button onClick={() => router.push('/login')}>
        Login
      </Button>
      <Button onClick={() => router.push('/dashboard')}>
        Dashboard
      </Button>
    </>

  );
}
