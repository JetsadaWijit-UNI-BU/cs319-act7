import React from 'react';
import { useParams, Link } from 'react-router';
import { useBookDetail } from '../hooks/useBooks';
import { useBookStore } from '../stores/useBookStore';

export const BookDetailPage: React.FC = () => {
  // 1. ดึง ID จาก Dynamic Route Parameter (เช่น /book/84 -> id = '84')
  const { id } = useParams<{ id: string }>();

  // 2. ดึงข้อมูลหนังสือเล่มนี้จาก TanStack Query (แสดงผลทันทีจาก Cache 0ms)
  const { data: book, isLoading, isError, error, refetch } = useBookDetail(id);

  // 3. ดึงสถานะ Bookmark และฟังก์ชัน toggle จาก Zustand
  const { bookmarks, toggleBookmark } = useBookStore();

  // 4. สถานะ Loading: แสดง Skeleton Pulse รูปทรงหน้ารายละเอียดด้วย DaisyUI
  if (isLoading)
    return (
      <div className="card max-w-xl mx-auto bg-base-100 shadow-xl border border-base-300 p-6 space-y-4 my-8">
        <div className="skeleton h-5 w-32 rounded" />
        <div className="skeleton h-8 w-3/4 rounded" />
        <div className="skeleton h-5 w-1/2 rounded" />
        <div className="skeleton h-64 w-48 mx-auto rounded-lg" />
        <div className="skeleton h-5 w-2/3 mx-auto rounded" />
        <div className="skeleton h-12 w-48 mx-auto rounded-lg" />
      </div>
    );

  // 5. สถานะ Error: แสดงข้อความแจ้งเตือน พร้อมปุ่ม Retry และปุ่มย้อนกลับด้วย DaisyUI Alert
  if (isError || !book)
    return (
      <div className="max-w-md mx-auto my-12 alert alert-error shadow-lg flex flex-col items-center gap-4 text-center">
        <div>
          <h3 className="font-bold text-lg">ไม่พบข้อมูลหนังสือเล่มนี้</h3>
          {error && <p className="text-xs opacity-80 mt-1">{(error as Error).message}</p>}
        </div>
        <div className="flex gap-3">
          <button onClick={() => refetch()} className="btn btn-sm btn-primary">
            ลองใหม่ (Retry)
          </button>
          <Link to="/" className="btn btn-sm btn-ghost">
            ย้อนกลับหน้ารายการ
          </Link>
        </div>
      </div>
    );

  // 6. ตรวจสอบว่าเล่มนี้ถูก Bookmark ไว้หรือไม่
  const isSaved = bookmarks.includes(book.id);

  // 7. แสดงผลข้อมูลรายละเอียดของหนังสือด้วย DaisyUI Card
  return (
    <div className="card max-w-xl mx-auto bg-base-100 shadow-2xl border border-base-300 p-6 my-8">
      <div className="mb-4">
        <Link to="/" className="link link-primary inline-flex items-center gap-1 text-sm no-underline hover:underline">
          ← ย้อนกลับไปหน้ารายการ
        </Link>
      </div>

      <div className="space-y-4 text-center">
        <h1 className="text-2xl font-bold text-base-content">{book.title}</h1>
        <p className="text-sm text-base-content/70">
          ผู้แต่ง: <span className="font-medium text-base-content">{book.authors[0]?.name || 'ไม่ระบุ'}</span>
        </p>

        {book.formats['image/jpeg'] && (
          <figure className="py-2">
            <img
              src={book.formats['image/jpeg']}
              alt={book.title}
              className="rounded-xl shadow-md max-h-72 object-cover mx-auto"
            />
          </figure>
        )}

        <div className="badge badge-outline badge-lg text-xs py-3 px-4">
          📥 ดาวน์โหลดแล้ว {book.download_count.toLocaleString()} ครั้ง
        </div>

        <div className="pt-4">
          <button
            onClick={() => toggleBookmark(book.id)}
            className={`btn btn-wide ${isSaved ? 'btn-warning' : 'btn-primary'} shadow-md`}
          >
            {isSaved ? '★ บุ๊กมาร์กแล้ว (Saved)' : '☆ บันทึกลงรายการโปรด'}
          </button>
        </div>
      </div>
    </div>
  );
};
