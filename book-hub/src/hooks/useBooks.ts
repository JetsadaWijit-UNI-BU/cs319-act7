import { useQuery, useQueryClient } from '@tanstack/react-query';

// 1. ประกาศโครงสร้างข้อมูลของหนังสือตามที่ Gutendex API ส่งกลับมา
export interface Book {
  id: number;
  title: string;
  authors: { name: string }[];
  formats: { [key: string]: string }; // เช่น formats['image/jpeg'] เก็บรูปปก
  download_count: number;
}

interface GutendexResponse {
  results: Book[];
}

// 2. Custom Hook สำหรับดึงรายการหนังสือทั้งหมด (หน้ารายการ)
export const useBooks = () => {
  return useQuery<GutendexResponse>({
    queryKey: ['books'], // คีย์สำหรับระบุ Cache ของรายการหนังสือ
    queryFn: async () => {
      // หมายเหตุ: URL ต้องมี '/' ปิดท้ายเพื่อป้องกัน HTTP 301 Redirect
      const res = await fetch('https://gutendex.com/books/');
      if (!res.ok) throw new Error('ไม่สามารถดึงข้อมูลรายการหนังสือได้');
      return res.json();
    },
    staleTime: 1000 * 60 * 5, // ข้อมูลถือว่าสดใหม่ 5 นาที (ไม่ต้อง Fetch ซ้ำจาก Network)
  });
};

// 3. Custom Hook สำหรับดึงรายละเอียดหนังสือเล่มที่ต้องการ (หน้ารายละเอียด)
export const useBookDetail = (id: string | undefined) => {
  const queryClient = useQueryClient();

  return useQuery<Book>({
    queryKey: ['book', id], // คีย์แยกต่างหากตาม ID ของหนังสือแต่ละเล่ม
    queryFn: async () => {
      // ลองดึงจาก API ภายนอกโดยตรง
      try {
        const res = await fetch(`https://gutendex.com/books/${id}/`);
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('API error, reading from cache...', err);
      }

      // Fallback: หาก API ภายนอกมีปัญหา ดึงข้อมูลจาก Cache รายการหนังสือที่โหลดไว้แล้ว
      const booksData = queryClient.getQueryData<GutendexResponse>(['books']);
      const cached = booksData?.results.find((b) => String(b.id) === String(id));
      if (cached) return cached;

      throw new Error('ไม่สามารถดึงข้อมูลเล่มนี้ได้');
    },
    initialData: () => {
      // ดึงข้อมูลจาก Cache ของรายการหนังสือมาแสดงทันที (0ms) ระหว่างรอ Network
      const booksData = queryClient.getQueryData<GutendexResponse>(['books']);
      return booksData?.results.find((b) => String(b.id) === String(id));
    },
    enabled: !!id,             // ทำงานเมื่อมี id เท่านั้น
    staleTime: 1000 * 60 * 10, // แคชรายละเอียดไว้นาน 10 นาที
  });
};
