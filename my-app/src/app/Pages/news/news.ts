import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { BookService, NewsArticle } from '../../Services/book.service';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './news.html',
  styleUrl: './news.css',
})
export class NewsComponent implements OnInit {
  private readonly bookService = inject(BookService);
  private readonly route = inject(ActivatedRoute);

  newsList: NewsArticle[] = [];
  selectedArticle: NewsArticle | null = null;
  isLoading = true;

  private readonly fallbackNewsList: NewsArticle[] = [
    {
      id: "n1",
      tag: "SỰ KIỆN",
      title: "Ngày hội đọc sách LightBook 2026",
      desc: "Khám phá hương thềm trị mở trong ngày đọc sách năm.",
      img: "img/news/news_festival_cover.jpg",
      content: "<p>Ngày hội đọc sách LightBook 2026 là sự kiện văn hóa thường niên lớn nhất của chúng tôi, nhằm mục đích tôn vinh giá trị của sách và lan tỏa văn hóa đọc trong cộng đồng. Trong sự kiện này, Lightbooks hân hạnh mang tới hàng ngàn tựa sách mới thuộc nhiều thể loại cùng các hoạt động ký tặng tác giả hấp dẫn.</p><p>Đến với sự kiện, độc giả không chỉ được đắm chìm trong không gian sách mở lãng mạn, mà còn có cơ hội giao lưu trực tiếp với các tác giả nổi tiếng như Nguyễn Nhật Ánh, Phan Ý Yên. Bên cạnh đó, các hội thảo chuyên đề về xu hướng xuất bản xanh và phát triển bền vững cũng sẽ diễn ra xuyên suốt ngày hội.</p>"
    },
    {
      id: "n2",
      tag: "CẢM HỨNG",
      title: "Lợi ích của việc đọc sách buổi sáng",
      desc: "Vì sao đọc sách buổi sáng giúp bạn cả ngày tỉnh táo và tốt cho não bộ.",
      img: "img/news/news_morning_reading.jpg",
      content: "<p>Đọc sách buổi sáng là thói quen của rất nhiều người thành công trên thế giới. Nghiên cứu chỉ ra rằng việc dành ra chỉ 15 đến 30 phút đọc sách vào buổi sáng sớm giúp kích thích các tế bào thần kinh, cải thiện lưu lượng máu lên não và tối ưu hóa khả năng tư duy logic.</p><p>Hơn thế nữa, bắt đầu ngày mới bằng việc tiếp thu những kiến thức tích cực giúp tạo ra tâm lý chủ động, tăng cường trí nhớ ngắn hạn và giảm thiểu lo âu hiệu quả cho cả ngày làm việc phía trước. Hãy pha một tách trà nóng và bắt đầu mở trang sách đầu tiên vào sáng mai nhé!</p>"
    },
    {
      id: "n3",
      tag: "XU HƯỚNG",
      title: "Sự trỗi dậy của thiết kế bìa sách tối giản",
      desc: "Khám phá xu hướng thềm trị mở trong xuất bản hiện nay.",
      img: "img/news/news_minimalist_cover.jpg",
      content: "<p>Trào lưu thiết kế bìa sách tối giản (Minimalist Book Cover Design) đang trở thành làn sóng càn quét các nhà sách lớn trên toàn thế giới. Thay vì các thiết kế rườm rà, các nhà thiết kế hiện nay ưa chuộng việc sử dụng những mảng màu đơn sắc, khoảng trắng thông minh kết hợp với một chi tiết đồ họa ẩn dụ duy nhất.</p><p>Xu hướng này không chỉ tạo ra sự sang trọng cho cuốn sách khi đặt trên kệ, mà còn thể hiện tinh thần hiện đại, tập trung thẳng vào chủ đề cốt lõi của tác phẩm. Đây là cầu nối thẩm mỹ tinh tế, kích thích sự tò mò và chiều sâu suy tưởng của độc giả trước khi lật mở trang đầu tiên.</p>"
    }
  ];

  ngOnInit(): void {
    this.loadNews();
  }

  private readonly cdr = inject(ChangeDetectorRef);

  loadNews(): void {
    this.isLoading = true;
    this.cdr.detectChanges();
    
    // Safety timeout in case backend hangs
    const timeoutId = setTimeout(() => {
      if (this.isLoading) {
        this.newsList = this.fallbackNewsList;
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    }, 5000);

    this.bookService.getNews().subscribe({
      next: (data) => {
        clearTimeout(timeoutId);
        if (data && data.length > 0) {
          this.newsList = data;
        } else {
          this.newsList = this.fallbackNewsList;
        }
        this.isLoading = false;
        this.cdr.detectChanges();
        this.checkQueryParam();
      },
      error: (err) => {
        clearTimeout(timeoutId);
        console.warn('Không thể kết nối API tin tức, chuyển sang dùng dữ liệu dự phòng:', err);
        this.newsList = this.fallbackNewsList;
        this.isLoading = false;
        this.cdr.detectChanges();
        this.checkQueryParam();
      }
    });
  }

  private checkQueryParam(): void {
    this.route.queryParams.subscribe(params => {
      const articleId = params['id'];
      if (articleId) {
        const article = this.newsList.find(n => n.id === articleId || n._id === articleId);
        if (article) {
          this.openArticleModal(article);
        }
      }
    });
  }

  openArticleModal(article: NewsArticle): void {
    this.selectedArticle = article;
    // Prevent background scrolling when modal is open
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  }

  closeArticleModal(): void {
    this.selectedArticle = null;
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  }
}
