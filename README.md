# AI Kitap Önerileri

Yapay zeka destekli kişisel kitap öneri uygulaması. Kullanıcı okuduğu veya sevdiği kitap türlerini girdiğinde, yapay zeka ona en uygun yeni kitap önerilerini sunar. Kullanıcı önerilen kitapları beğenebilir veya reddedebilir, böylece öneri sistemi zamanla daha doğru tahminler yapabilir.

## Özellikler

- Kitap türlerine göre kişiselleştirilmiş kitap önerileri
- Favori kitapları kaydetme ve yönetme
- Beğenilmeyen kitapları işaretleme
- Modern ve minimalist kullanıcı arayüzü
- Karanlık/aydınlık tema desteği
- Tamamen duyarlı tasarım (mobil, tablet, masaüstü)

## Teknolojiler

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Tip güvenliği
- [Tailwind CSS](https://tailwindcss.com/) - Stil ve UI
- [Google Gemini API](https://ai.google.dev/) - Kitap önerileri için yapay zeka
- [React Icons](https://react-icons.github.io/react-icons/) - UI ikonları

## Kurulum

1. Repoyu klonlayın:

```bash
git clone https://github.com/yourusername/ai-book.git
cd ai-book
```

2. Bağımlılıkları yükleyin:

```bash
npm install
```

3. `.env.local` dosyasını oluşturun ve Gemini API anahtarınızı ekleyin:

```
GEMINI_API_KEY=your_gemini_api_key_here
```

4. Geliştirme sunucusunu başlatın:

```bash
npm run dev
```

5. Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

## Kullanım

1. Ana sayfada, ilgilendiğiniz kitap türlerini seçin.
2. "Kitap Önerileri Al" düğmesine tıklayın.
3. Önerilen kitapları inceleyin.
4. Beğendiğiniz kitapları favorilere ekleyin veya beğenmediklerinizi işaretleyin.
5. Favorilerinizi görmek için "Favorilerim" sayfasına gidin.

## Gemini API Hakkında

Bu uygulama, kitap önerileri için Google'ın Gemini AI modelini kullanmaktadır. Gemini, doğal dil anlama ve içerik oluşturma yetenekleriyle kullanıcı tercihlerine dayalı kişiselleştirilmiş kitap önerileri sunabilir.

Gemini API'yi kullanmak için [Google AI Studio](https://makersuite.google.com/app/apikey) üzerinden bir API anahtarı almanız gerekmektedir.

## Lisans

MIT

## İletişim

Sorularınız veya geri bildirimleriniz için [email@example.com](mailto:email@example.com) adresine e-posta gönderebilirsiniz.
