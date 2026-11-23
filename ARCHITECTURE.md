# Light Stones Browser · Mimari Notu

**Proje yönü ve tasarım imzası: Ergin Kaplan**  
**Durum:** Araştırma ve web arayüzü prototipi · 0.1.0

## Amaç

Light Stones Browser, mevcut tarayıcıların kaynak kodlarını kopyalamadan özgün bir gezinme deneyimi ve ileride bağımsız bir tarayıcı altyapısı geliştirmek için başlatılmış araştırma projesidir.

Bu depo şu anda bir web giriş arayüzü içerir. Henüz HTML/CSS/JavaScript'i bağımsız olarak işleyen bir tarayıcı motoru değildir. Gerçek bir motor; standart uyumluluğu, JavaScript çalışma zamanı, ağ yığını, grafik ve yazı düzeni, güvenlik izolasyonu ve kapsamlı testler gerektirir.

## Önerilen katmanlar

1. **Light Core:** süreç yaşam döngüsü, yapılandırma ve bileşenler arası sözleşmeler.
2. **Cognitive Navigation:** kullanıcının açıkça verdiği gezinme niyetini sınıflandırma ve gezinme akışını planlama. Gizli profil çıkarımı hedeflenmez.
3. **Light Network:** URL çözümleme, bağlantı yönetimi, TLS doğrulaması, önbellek ve ağ politikaları.
4. **Light Rendering:** belge modeli, stil hesaplama, yerleşim, boyama ve erişilebilirlik ağacı.
5. **Light Shield:** site izolasyonu, izin modeli, güvenli varsayılanlar ve tehdit azaltımı.
6. **Light Memory:** yalnızca açık izinle saklanan yerel tercihler ve kullanıcı tarafından yönetilen oturum verileri.

## Geliştirme sırası

- [x] İlk web giriş arayüzü
- [x] Proje ilkeleri ve mimari taslak
- [ ] URL ve origin güvenlik modeli
- [ ] Tehdit modeli ve gizlilik incelemesi
- [ ] Belge ağacı ve HTML ayrıştırma araştırması
- [ ] CSS değerleri ve yerleşim prototipi
- [ ] JavaScript çalışma zamanı entegrasyonu için teknik değerlendirme
- [ ] Web Platform Tests ve güvenlik testleri

## Tasarım ilkeleri

- Mevcut projelerin kodu lisans ve atıf yükümlülükleri incelenmeden kopyalanmaz.
- Güvenlik özellikleri kanıtlanmadan “güvenli” veya “iz bırakmaz” iddiası kullanılmaz.
- Kullanıcı verisi varsayılan olarak toplanmaz.
- Her katman belgelenebilir, test edilebilir ve mümkün olduğunca birbirinden ayrıştırılmış olur.
- Web standartlarıyla uyumluluk, sloganla değil test sonuçlarıyla ölçülür.

---

© 2026 Ergin Kaplan. Light Stones Browser proje tasarımı ve özgün depo içeriği.