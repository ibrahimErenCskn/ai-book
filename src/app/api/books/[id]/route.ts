import { NextResponse } from 'next/server';
import { Book } from '@/types';
import { getUserPreferences } from '@/lib/userPreferences';

// Örnek kitap verileri - gerçek uygulamada bir veritabanından gelecektir
const sampleBooks: Book[] = [
  {
    id: '1',
    title: 'Suç ve Ceza',
    author: 'Fyodor Dostoyevski',
    description: 'Suç ve Ceza, Rus yazar Fyodor Dostoyevski tarafından yazılan psikolojik bir romandır. Roman, yoksul bir öğrenci olan Rodion Raskolnikov\'un işlediği cinayet ve sonrasında yaşadığı psikolojik çöküşü anlatır. Kitap, suç, ceza, ahlak, inanç ve kurtuluş gibi temaları derinlemesine inceler.',
    coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1000&auto=format&fit=crop',
    genre: ['Klasik', 'Psikolojik', 'Roman'],
    publicationYear: 1866,
    rating: 4.8,
  },
  {
    id: '2',
    title: 'Sefiller',
    author: 'Victor Hugo',
    description: 'Sefiller, Victor Hugo\'nun 1862 yılında yayımlanan ve dünya edebiyatının en önemli klasiklerinden biri olarak kabul edilen romanıdır. Kitap, Jean Valjean adlı bir mahkumun hikayesini ve onun etrafında gelişen olayları anlatır. Roman, adalet, hukuk, din ve aşk gibi temaları işler.',
    coverImage: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=1000&auto=format&fit=crop',
    genre: ['Klasik', 'Tarihi', 'Roman'],
    publicationYear: 1862,
    rating: 4.7,
  },
  {
    id: '3',
    title: 'Savaş ve Barış',
    author: 'Lev Tolstoy',
    description: 'Savaş ve Barış, Rus yazar Lev Tolstoy\'un 1869 yılında yayımlanan ve dünya edebiyatının en önemli eserlerinden biri olarak kabul edilen romanıdır. Kitap, Napolyon\'un Rusya\'yı işgali sırasında Rus toplumunu ve beş aristokrat ailenin hayatını anlatır.',
    coverImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=1000&auto=format&fit=crop',
    genre: ['Klasik', 'Tarihi', 'Savaş'],
    publicationYear: 1869,
    rating: 4.9,
  },
  {
    id: '4',
    title: 'Bülbülü Öldürmek',
    author: 'Harper Lee',
    description: 'Bülbülü Öldürmek, Harper Lee\'nin 1960 yılında yayımlanan ve Pulitzer Ödülü kazanan romanıdır. Kitap, 1930\'ların Amerika\'sında, Alabama\'da geçer ve ırkçılık, adalet ve büyüme temaları üzerine odaklanır.',
    coverImage: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?q=80&w=1000&auto=format&fit=crop',
    genre: ['Klasik', 'Roman', 'Hukuk'],
    publicationYear: 1960,
    rating: 4.6,
  },
  {
    id: '5',
    title: 'Yüzüklerin Efendisi',
    author: 'J.R.R. Tolkien',
    description: 'Yüzüklerin Efendisi, J.R.R. Tolkien tarafından yazılan ve üç cilt halinde yayımlanan epik fantezi romanıdır. Kitap, Orta Dünya\'da geçer ve Tek Yüzük\'ü yok etmek için verilen mücadeleyi anlatır.',
    coverImage: 'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?q=80&w=1000&auto=format&fit=crop',
    genre: ['Fantezi', 'Macera', 'Epik'],
    publicationYear: 1954,
    rating: 4.9,
  }
];

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const id = params.id;
    
    // Önce örnek kitaplar arasında arama yap
    let book = sampleBooks.find(book => book.id === id);
    
    // Eğer örnek kitaplarda bulunamazsa, kullanıcının favorilerinde ara
    if (!book) {
      const { favoriteBooks } = getUserPreferences();
      book = favoriteBooks.find(book => book.id === id);
    }
    
    // Eğer hala bulunamazsa ve ID "rec-" ile başlıyorsa, bu Gemini API'den gelen bir kitaptır
    // Bu durumda, kitap bilgilerini oluşturalım
    if (!book && id.startsWith('rec-')) {
      // Kitap bulunamadı, ancak ID formatı Gemini API'den geldiğini gösteriyor
      // Placeholder bir kitap oluşturalım
      book = {
        id: id,
        title: "Önerilen Kitap",
        author: "Bilinmiyor",
        description: "Bu kitap, Gemini AI tarafından önerilmiştir. Detaylı bilgiler henüz mevcut değildir.",
        coverImage: `https://picsum.photos/seed/${id}/300/450`,
        genre: ["Önerilen"],
        publicationYear: new Date().getFullYear(),
        rating: 4.0
      };
    }
    
    if (!book) {
      return NextResponse.json(
        { error: 'Kitap bulunamadı' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ book });
  } catch (error) {
    console.error('Error fetching book details:', error);
    return NextResponse.json(
      { error: 'Kitap detayları alınamadı' },
      { status: 500 }
    );
  }
} 