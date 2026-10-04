import React, { useState } from 'react';
import { Link } from 'react-router';
import { useBooks, type Book } from '../hooks/useBooks';
import { useBookStore } from '../stores/useBookStore';

export const BookListPage: React.FC = () => {
  // 1. ดึง Server State จาก TanStack Query
  const { data, isLoading, isError, error, refetch } = useBooks();

  // 2. ดึง Client State จาก Zustand Store
  const { bookmarks, toggleBookmark } = useBookStore();

  // 3. Local UI State สำหรับช่องค้นหาและตัวกรอง
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyBookmarks, setShowOnlyBookmarks] = useState(false);

  // 4. สถานะ Loading: แสดงโครงร่างกระพริบด้วย DaisyUI Skeleton
  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Skeleton ส่วนค้นหา */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="skeleton h-12 flex-1 rounded-lg" />
          <div className="skeleton h-12 w-48 rounded-lg" />
        </div>
        {/* Skeleton Grid จำลองการ์ดหนังสือ 8 ใบ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div key={idx} className="card bg-base-100 shadow-xl border border-base-300 p-4 space-y-4">
              <div className="skeleton h-48 w-full rounded-md" />
              <div className="skeleton h-5 w-3/4" />
              <div className="skeleton h-4 w-1/2" />
              <div className="flex justify-between items-center pt-2">
                <div className="skeleton h-8 w-24 rounded-lg" />
                <div className="skeleton h-4 w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 5. สถานะ Error: แสดง Alert ของ DaisyUI พร้อมปุ่ม Retry
  if (isError) {
    return (
      <div className="max-w-md mx-auto my-12 alert alert-error shadow-lg">
        <div>
          <h3 className="font-bold">เกิดข้อผิดพลาด!</h3>
          <div className="text-sm">{(error as Error).message}</div>
        </div>
        <button onClick={() => refetch()} className="btn btn-sm btn-outline">
          ลองใหม่ (Retry)
        </button>
      </div>
    );
  }

  // 6. กรองข้อมูลตามคำค้นหา (Search) และสถานะ Bookmark
  const books: Book[] = data?.results || [];
  const filteredBooks = books.filter((book) => {
    const matchSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchBookmark = showOnlyBookmarks ? bookmarks.includes(book.id) : true;
    return matchSearch && matchBookmark;
  });

  // 7. แสดงผลรายการหนังสือด้วย DaisyUI
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Search Input & Bookmark Filter */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-center bg-base-100 p-4 rounded-xl shadow-sm border border-base-300">
        <input
          type="text"
          placeholder="ค้นหาชื่อหนังสือ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered w-full sm:flex-1"
        />
        <label className="label cursor-pointer gap-3 self-end sm:self-center">
          <span className="label-text font-medium">
            แสดงเฉพาะเล่มที่บุ๊กมาร์ก <span className="badge badge-primary badge-sm ml-1">{bookmarks.length}</span>
          </span>
          <input
            type="checkbox"
            checked={showOnlyBookmarks}
            onChange={(e) => setShowOnlyBookmarks(e.target.checked)}
            className="checkbox checkbox-primary"
          />
        </label>
      </div>

      {/* Book Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredBooks.map((book) => {
          const isSaved = bookmarks.includes(book.id);
          const coverImg = book.formats['image/jpeg'];
          return (
            <div
              key={book.id}
              className="card bg-base-100 shadow-md hover:shadow-xl transition-shadow border border-base-300 flex flex-col justify-between"
            >
              <figure className="px-4 pt-4">
                {coverImg ? (
                  <img src={coverImg} alt={book.title} className="rounded-lg h-48 w-full object-cover" />
                ) : (
                  <div className="h-48 w-full bg-base-200 rounded-lg flex items-center justify-center text-base-content/50">
                    ไม่มีรูปภาพ
                  </div>
                )}
              </figure>
              <div className="card-body p-4 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="card-title text-base line-clamp-2" title={book.title}>{book.title}</h3>
                  <p className="text-xs text-base-content/70 mt-1">ผู้แต่ง: {book.authors[0]?.name || 'ไม่ระบุ'}</p>
                </div>
                <div className="card-actions justify-between items-center mt-4 pt-2 border-t border-base-200">
                  {/* คลิกเพื่อสลับ Bookmark (เก็บเฉพาะ ID ใน Zustand Store) */}
                  <button
                    onClick={() => toggleBookmark(book.id)}
                    className={`btn btn-sm ${isSaved ? 'btn-warning' : 'btn-outline'}`}
                  >
                    {isSaved ? '★ บุ๊กมาร์กแล้ว' : '☆ บุ๊กมาร์ก'}
                  </button>
                  {/* ลิงก์ไปยัง Dynamic Route หน้ารายละเอียด */}
                  <Link to={`/book/${book.id}`} className="link link-primary text-sm font-medium no-underline hover:underline">
                    รายละเอียด →
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
