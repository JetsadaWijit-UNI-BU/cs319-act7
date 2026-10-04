import { createBrowserRouter, Outlet } from 'react-router';
import { BookListPage } from './pages/BookListPage';
import { BookDetailPage } from './pages/BookDetailPage';

// กำหนดการจับคู่ Path กับ Component โดยมี DaisyUI Navbar ร่วมกันผ่าน Outlet
export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <div className="min-h-screen bg-base-200">
        {/* Navigation Bar ส่วนบนด้วย DaisyUI Navbar */}
        <header className="navbar bg-base-100 shadow-md px-6 border-b border-base-300">
          <div className="flex-1">
            <a href="/" className="btn btn-ghost text-xl text-primary font-bold">
              📚 CS319 Book Bookmark Hub
            </a>
          </div>
        </header>
        {/* Outlet: จุดที่เนื้อหาของแต่ละ Route จะถูกเรนเดอร์ลงมา */}
        <main className="container mx-auto px-4 py-6">
          <Outlet />
        </main>
      </div>
    ),
    children: [
      { index: true, element: <BookListPage /> },          // หน้าแรก: /
      { path: 'book/:id', element: <BookDetailPage /> }, // หน้ารายละเอียด: /book/:id
    ],
  },
]);
