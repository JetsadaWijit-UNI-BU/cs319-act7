import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { router } from './router';
import './index.css'; // นำเข้าสไตล์ Tailwind CSS และ DaisyUI

// 1. สร้าง Instance ศูนย์กลางสำหรับจัดการ In-memory Cache ของ TanStack Query
const queryClient = new QueryClient();

// 2. เรนเดอร์แอปร่วมกันระหว่าง QueryClientProvider และ RouterProvider
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
