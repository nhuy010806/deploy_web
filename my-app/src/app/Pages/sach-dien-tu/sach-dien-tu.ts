import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Book {
  title: string;
  author: string;
  img: string;
  price: number;
  priceStr: string;
  oldPrice?: string;
  discount?: string;
  discountVal: number;
  description: string;
  category: string;
  ageRange: string;
  salesWeekly: number;
  salesMonthly: number;
  isFlashSale?: boolean;
}

@Component({
  selector: 'app-sach-dien-tu',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sach-dien-tu.html',
  styleUrl: './sach-dien-tu.css',
})
export class SachDienTu implements OnInit, OnDestroy {
  // Countdown Timer
  readonly dd = signal('00');
  readonly hh = signal('00');
  readonly mm = signal('00');
  private remaining = 48 * 3600 + 40 * 60 + 1; // 487:40:01 matching the reference image countdown
  private timer?: ReturnType<typeof setInterval>;

  // Filter State (Checkboxes)
  selectedPriceRanges = {
    under50: false,
    from50to100: false,
    above100: false
  };
  selectedCategories = {
    vanHoc: false,
    kinhTe: false,
    tamLyKyNang: false,
    thieuNhi: false,
    tieuSuHoiKy: false
  };
  selectedAgeRanges = {
    thieuNhi: false,
    tuoiTeen: false,
    nguoiLon: false
  };
  selectedSort = 'salesWeekly';

  // 24 Books Dataset
  readonly books: Book[] = [
    {
      title: 'Thoát nợ sống nhẹ',
      author: 'Richard Templar',
      img: 'https://307a0e78.vws.vegacdn.vn/view/v2/image/img.book/0/0/1/55930.jpg?v=1&w=350&h=510',
      price: 39000,
      priceStr: '39.000đ',
      oldPrice: '79.000đ',
      discount: '-50%',
      discountVal: 50,
      description: 'Quyển sách giúp bạn định hình lại tư duy tài chính cá nhân, thoát khỏi gánh nặng nợ nần và xây dựng cuộc sống tự do, nhẹ nhàng, hạnh phúc hơn.',
      category: 'Tâm lý - Kỹ năng sống',
      ageRange: 'nguoi-lon',
      salesWeekly: 150,
      salesMonthly: 620,
      isFlashSale: true
    },
    {
      title: 'Bẫy lừa đảo',
      author: 'Robert Cialdini',
      img: 'https://307a0e78.vws.vegacdn.vn/view/v2/image/img.book/0/0/1/55852.jpg?v=1&w=350&h=510',
      price: 49000,
      priceStr: '49.000đ',
      oldPrice: '99.000đ',
      discount: '-50%',
      discountVal: 50,
      description: 'Vạch trần các thủ đoạn tâm lý tinh vi mà những kẻ lừa đảo thường sử dụng để bẫy con mồi, giúp bạn nâng cao cảnh giác và bảo vệ bản thân cùng gia đình.',
      category: 'Tâm lý - Kỹ năng sống',
      ageRange: 'nguoi-lon',
      salesWeekly: 220,
      salesMonthly: 810,
      isFlashSale: true
    },
    {
      title: 'Nghệ thuật đàm phán với bất kỳ ai',
      author: 'Herb Cohen',
      img: 'https://307a0e78.vws.vegacdn.vn/view/v2/image/img.book/0/0/1/55810.jpg?v=1&w=350&h=510',
      price: 59000,
      priceStr: '59.000đ',
      oldPrice: '119.000đ',
      discount: '-50%',
      discountVal: 50,
      description: 'Hướng dẫn thực chiến về cách thương lượng, đàm phán thành công trong công việc và cuộc sống dựa trên sức mạnh của thông tin, áp lực thời gian và tâm lý.',
      category: 'Kinh tế',
      ageRange: 'nguoi-lon',
      salesWeekly: 180,
      salesMonthly: 720,
      isFlashSale: true
    },
    {
      title: 'Thành tích cao, thu nhập thấp',
      author: 'Brian Tracy',
      img: 'https://307a0e78.vws.vegacdn.vn/view/v2/image/img.book/0/0/1/55771.jpg?v=1&w=350&h=510',
      price: 49000,
      priceStr: '49.000đ',
      oldPrice: '99.000đ',
      discount: '-50%',
      discountVal: 50,
      description: 'Tại sao nhiều người làm việc chăm chỉ, đạt nhiều thành tích vượt trội nhưng thu nhập vẫn lẹt đẹt? Cuốn sách chỉ rõ các sai lầm và định vị lại giá trị bản thân.',
      category: 'Kinh tế',
      ageRange: 'nguoi-lon',
      salesWeekly: 95,
      salesMonthly: 430,
      isFlashSale: true
    },
    {
      title: 'Thần số học - Con số đọc vị con người',
      author: 'David A. Phillips',
      img: 'https://307a0e78.vws.vegacdn.vn/view/v2/image/img.book/0/0/1/55765.jpg?v=1&w=350&h=510',
      price: 69000,
      priceStr: '69.000đ',
      oldPrice: '139.000đ',
      discount: '-50%',
      discountVal: 50,
      description: 'Khám phá bản thân và những người xung quanh thông qua toán học về các con số ngày sinh, thấu hiểu điểm mạnh điểm yếu để định hướng tương lai.',
      category: 'Tâm lý - Kỹ năng sống',
      ageRange: 'tuoi-teen',
      salesWeekly: 340,
      salesMonthly: 1250,
      isFlashSale: true
    },
    {
      title: 'Quy tắc giao tiếp quyền lực',
      author: 'Leil Lowndes',
      img: 'https://307a0e78.vws.vegacdn.vn/view/v2/image/img.book/0/0/1/55720.jpg?v=1&w=350&h=510',
      price: 45000,
      priceStr: '45.000đ',
      oldPrice: '85.000đ',
      discount: '-47%',
      discountVal: 47,
      description: 'Nắm bắt các quy tắc giao tiếp tinh tế trong môi trường công sở và xã hội, giúp bạn làm chủ mọi cuộc đối thoại, tạo thiện cảm và gây dựng uy tín.',
      category: 'Tâm lý - Kỹ năng sống',
      ageRange: 'nguoi-lon',
      salesWeekly: 110,
      salesMonthly: 480
    },
    {
      title: 'Hẹn hò tỉnh thức',
      author: 'Phan Ý Yên',
      img: 'https://307a0e78.vws.vegacdn.vn/view/v2/image/img.book/0/0/1/55723.jpg?v=1&w=350&h=510',
      price: 49000,
      priceStr: '49.000đ',
      oldPrice: '89.000đ',
      discount: '-45%',
      discountVal: 45,
      description: 'Góc nhìn sâu sắc về tình yêu hiện đại, giúp bạn yêu thương bản thân đúng cách, loại bỏ ảo tưởng tình cảm trước khi bắt đầu mối quan hệ lành mạnh.',
      category: 'Tâm lý - Kỹ năng sống',
      ageRange: 'nguoi-lon',
      salesWeekly: 290,
      salesMonthly: 1080
    },
    {
      title: 'Manifest tiền tài',
      author: 'Roxie Nafousi',
      img: 'https://307a0e78.vws.vegacdn.vn/view/v2/image/img.book/0/0/1/55681.jpg?v=1&w=350&h=510',
      price: 55000,
      priceStr: '55.000đ',
      oldPrice: '109.000đ',
      discount: '-50%',
      discountVal: 50,
      description: 'Hướng dẫn thực hành luật hấp dẫn để thu hút tài lộc và sự thịnh vượng, thay đổi nhận thức khan hiếm thành tư duy giàu có bền vững.',
      category: 'Tâm lý - Kỹ năng sống',
      ageRange: 'nguoi-lon',
      salesWeekly: 410,
      salesMonthly: 1500
    },
    {
      title: 'Chẳng sợ đối thủ mạnh như hổ, chỉ sợ đồng đội không như mình',
      author: 'John C. Maxwell',
      img: 'https://307a0e78.vws.vegacdn.vn/view/v2/image/img.book/0/0/1/54661.jpg?v=1&w=350&h=510',
      price: 52000,
      priceStr: '52.000đ',
      oldPrice: '99.000đ',
      discount: '-47%',
      discountVal: 47,
      description: 'Nghệ thuật hợp tác và xây dựng đội nhóm vững mạnh, tối ưu hóa sức mạnh tập thể để chiến thắng mọi đối thủ cạnh tranh trên thương trường.',
      category: 'Kinh tế',
      ageRange: 'nguoi-lon',
      salesWeekly: 130,
      salesMonthly: 510
    },
    {
      title: 'Con Mèo của Schrödinger – Kiến Tạo Vũ Trụ Song Song Hoàn Hảo Cho Riêng Mình',
      author: 'John Gribbin',
      img: 'https://307a0e78.vws.vegacdn.vn/view/v2/image/img.book/0/0/1/54736.jpg?v=1&w=350&h=510',
      price: 72000,
      priceStr: '72.000đ',
      oldPrice: '120.000đ',
      discount: '-40%',
      discountVal: 40,
      description: 'Tác phẩm giả tưởng độc đáo mở ra góc nhìn triết học khoa học về vật lý lượng tử và các vũ trụ song song, khơi nguồn sáng tạo vô hạn.',
      category: 'Văn học',
      ageRange: 'tuoi-teen',
      salesWeekly: 80,
      salesMonthly: 320
    },
    {
      title: 'Quy tắc kỷ luật tự thân',
      author: 'Brian Tracy',
      img: 'https://307a0e78.vws.vegacdn.vn/view/v2/image/img.book/0/0/1/55666.jpg?v=1&w=350&h=510',
      price: 42000,
      priceStr: '42.000đ',
      oldPrice: '79.000đ',
      discount: '-47%',
      discountVal: 47,
      description: 'Chìa khóa để chuyển hóa mong muốn thành hành động cụ thể. Kỷ luật tự thân chính là cầu nối vững chắc nhất giữa mục tiêu và thành công.',
      category: 'Tâm lý - Kỹ năng sống',
      ageRange: 'moi-lua-tuoi',
      salesWeekly: 210,
      salesMonthly: 900
    },
    {
      title: 'Phản biện để bứt phá',
      author: 'Daniel Kahneman',
      img: 'https://307a0e78.vws.vegacdn.vn/view/v2/image/img.book/0/0/1/55651.jpg?v=1&w=350&h=510',
      price: 48000,
      priceStr: '48.000đ',
      oldPrice: '89.000đ',
      discount: '-46%',
      discountVal: 46,
      description: 'Rèn luyện tư duy phản biện logic, loại bỏ định kiến nhận thức để đưa ra những quyết định sáng suốt vượt trội trong công việc và cuộc sống.',
      category: 'Tâm lý - Kỹ năng sống',
      ageRange: 'nguoi-lon',
      salesWeekly: 165,
      salesMonthly: 600
    },
    {
      title: 'Đọc vị nhân cách hiểu người hiểu ta',
      author: 'David J. Lieberman',
      img: 'https://307a0e78.vws.vegacdn.vn/view/v2/image/img.book/0/0/1/55648.jpg?v=1&w=350&h=510',
      price: 59000,
      priceStr: '59.000đ',
      oldPrice: '109.000đ',
      discount: '-46%',
      discountVal: 46,
      description: 'Phương pháp đọc vị tính cách, phân tích hành vi và nắm bắt tâm lý đối phương nhanh chóng, giúp bạn xây dựng vị thế giao tiếp vững vàng.',
      category: 'Tâm lý - Kỹ năng sống',
      ageRange: 'nguoi-lon',
      salesWeekly: 250,
      salesMonthly: 980
    },
    {
      title: 'Thực hành Manifest',
      author: 'Roxie Nafousi',
      img: 'https://307a0e78.vws.vegacdn.vn/view/v2/image/img.book/0/0/1/55627.jpg?v=1&w=350&h=510',
      price: 55000,
      priceStr: '55.000đ',
      oldPrice: '99.000đ',
      discount: '-44%',
      discountVal: 44,
      description: 'Các bước thực hành chuyên sâu giúp cụ thể hóa ước mơ của bạn thành hiện thực bằng phương pháp rèn luyện tâm thức và hành động kỷ luật.',
      category: 'Tâm lý - Kỹ năng sống',
      ageRange: 'nguoi-lon',
      salesWeekly: 380,
      salesMonthly: 1420
    },
    {
      title: 'Cả ngày bận rộn, cả đời trì hoãn',
      author: 'Steve Chandler',
      img: 'https://307a0e78.vws.vegacdn.vn/view/v2/image/img.book/0/0/1/55588.jpg?v=1&w=350&h=510',
      price: 39000,
      priceStr: '39.000đ',
      oldPrice: '79.000đ',
      discount: '-51%',
      discountVal: 51,
      description: 'Chỉ ra nghịch lý của sự bận rộn ảo tưởng và cách vượt qua thói quen trì hoãn kinh niên để tập trung vào hiệu suất thực tế.',
      category: 'Tâm lý - Kỹ năng sống',
      ageRange: 'moi-lua-tuoi',
      salesWeekly: 310,
      salesMonthly: 1150
    },
    {
      title: 'Quy tắc nhìn thấu bản chất',
      author: 'Robert Greene',
      img: 'https://307a0e78.vws.vegacdn.vn/view/v2/image/img.book/0/0/1/55579.jpg?v=1&w=350&h=510',
      price: 49000,
      priceStr: '49.000đ',
      oldPrice: '89.000đ',
      discount: '-45%',
      discountVal: 45,
      description: 'Giúp bạn bóc tách những ảo tưởng bên ngoài để nhìn thẳng vào bản chất thật của sự việc, ý đồ con người và quy luật vận hành xã hội.',
      category: 'Tâm lý - Kỹ năng sống',
      ageRange: 'nguoi-lon',
      salesWeekly: 190,
      salesMonthly: 780
    },
    {
      title: 'Định vị bản thân như người xuất sắc',
      author: 'Robin Sharma',
      img: 'https://307a0e78.vws.vegacdn.vn/view/v2/image/img.book/0/0/1/55582.jpg?v=1&w=350&h=510',
      price: 58000,
      priceStr: '58.000đ',
      oldPrice: '110.000đ',
      discount: '-47%',
      discountVal: 47,
      description: 'Hành trình định hình tư duy của một nhà lãnh đạo xuất chúng, xây dựng thói quen và kỷ luật của nhóm 5% xuất sắc nhất thế giới.',
      category: 'Kinh tế',
      ageRange: 'nguoi-lon',
      salesWeekly: 140,
      salesMonthly: 550
    },
    {
      title: 'Nhập môn Manifest',
      author: 'Roxie Nafousi',
      img: 'https://307a0e78.vws.vegacdn.vn/view/v2/image/img.book/0/0/1/55546.jpg?v=1&w=350&h=510',
      price: 45000,
      priceStr: '45.000đ',
      oldPrice: '85.000đ',
      discount: '-47%',
      discountVal: 47,
      description: 'Những nguyên lý sơ khởi và nền tảng dễ hiểu nhất dành cho người mới tìm hiểu về Manifestation và sức mạnh tư duy tích cực.',
      category: 'Tâm lý - Kỹ năng sống',
      ageRange: 'tuoi-teen',
      salesWeekly: 220,
      salesMonthly: 850
    },
    {
      title: 'Khai phá phi thường trong chính ta tầm thường',
      author: 'Eckhart Tolle',
      img: 'https://307a0e78.vws.vegacdn.vn/view/v2/image/img.book/0/0/1/55522.jpg?v=1&w=350&h=510',
      price: 38000,
      priceStr: '38.000đ',
      oldPrice: '69.000đ',
      discount: '-45%',
      discountVal: 45,
      description: 'Đánh thức năng lượng vô hạn và sự an tịnh đang ngủ say bên trong bạn, giúp bạn tìm lại niềm vui thuần khiết ngay trong hiện tại.',
      category: 'Tâm lý - Kỹ năng sống',
      ageRange: 'moi-lua-tuoi',
      salesWeekly: 175,
      salesMonthly: 670
    },
    {
      title: 'Tồn tại trước, lý tưởng sau',
      author: 'Jean-Paul Sartre',
      img: 'https://307a0e78.vws.vegacdn.vn/view/v2/image/img.book/0/0/1/55525.jpg?v=1&w=350&h=510',
      price: 62000,
      priceStr: '62.000đ',
      oldPrice: '109.000đ',
      discount: '-43%',
      discountVal: 43,
      description: 'Một cái nhìn triết lý thực sinh về ý nghĩa tồn tại độc lập, thúc giục mỗi cá nhân tự kiến tạo bản sắc riêng của mình.',
      category: 'Tiểu sử - Hồi ký',
      ageRange: 'nguoi-lon',
      salesWeekly: 85,
      salesMonthly: 380
    },
    {
      title: 'Bí kíp đỗ ngay phỏng vấn Tokutei Ginou',
      author: 'Nhiều Tác Giả',
      img: 'https://307a0e78.vws.vegacdn.vn/view/v2/image/img.book/0/0/1/55489.jpg?v=1&w=350&h=510',
      price: 99000,
      priceStr: '99.000đ',
      oldPrice: '159.000đ',
      discount: '-38%',
      discountVal: 38,
      description: 'Tổng hợp chi tiết bộ câu hỏi phỏng vấn thực tế, kỹ năng trả lời và kinh nghiệm ứng tuyển chương trình đặc định Nhật Bản.',
      category: 'Kinh tế',
      ageRange: 'nguoi-lon',
      salesWeekly: 120,
      salesMonthly: 490
    },
    {
      title: 'Càng khiêm nhường, càng giá trị',
      author: 'Lao Tử',
      img: 'https://307a0e78.vws.vegacdn.vn/view/v2/image/img.book/0/0/1/55495.jpg?v=1&w=350&h=510',
      price: 46000,
      priceStr: '46.000đ',
      oldPrice: '85.000đ',
      discount: '-46%',
      discountVal: 46,
      description: 'Những đúc rút sâu sắc về triết lý tĩnh lặng, khiêm nhường để tích lũy sức mạnh vững bền và vượt qua sóng gió cuộc đời.',
      category: 'Tâm lý - Kỹ năng sống',
      ageRange: 'moi-lua-tuoi',
      salesWeekly: 230,
      salesMonthly: 950
    },
    {
      title: 'Bỏ người tốt, chốt người tồi',
      author: 'Waka Team',
      img: 'https://307a0e78.vws.vegacdn.vn/view/v2/image/img.book/0/0/1/55483.jpg?v=1&w=350&h=510',
      price: 49000,
      priceStr: '49.000đ',
      oldPrice: '89.000đ',
      discount: '-45%',
      discountVal: 45,
      description: 'Những mẩu chuyện thực tế dí hóm nhưng đầy châm biếm về nghệ thuật lựa chọn bạn đời và đối nhân xử thế trong xã hội hiện đại.',
      category: 'Tâm lý - Kỹ năng sống',
      ageRange: 'nguoi-lon',
      salesWeekly: 180,
      salesMonthly: 740
    },
    {
      title: 'Càng chữa lành càng mệt mỏi',
      author: 'Đặng Hoàng Giang',
      img: 'https://307a0e78.vws.vegacdn.vn/view/v2/image/img.book/0/0/1/55462.jpg?v=1&w=350&h=510',
      price: 52000,
      priceStr: '52.000đ',
      oldPrice: '99.000đ',
      discount: '-47%',
      discountVal: 47,
      description: 'Phân tích phản biện thấu đáo về mặt trái của xu hướng chữa lành tự phát ngày nay, giúp độc giả có cái nhìn tỉnh táo, thực tế hơn.',
      category: 'Tâm lý - Kỹ năng sống',
      ageRange: 'nguoi-lon',
      salesWeekly: 300,
      salesMonthly: 1100
    }
  ];

  ngOnInit(): void {
    this.startTimer();
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }

  private startTimer(): void {
    this.renderTime();
    this.timer = setInterval(() => {
      if (this.remaining > 0) {
        this.remaining--;
        this.renderTime();
      } else {
        clearInterval(this.timer);
      }
    }, 1000);
  }

  private renderTime(): void {
    const d = Math.floor(this.remaining / (24 * 3600));
    const h = Math.floor((this.remaining % (24 * 3600)) / 3600);
    const m = Math.floor((this.remaining % 3600) / 60);
    this.dd.set(String(d).padStart(2, '0'));
    this.hh.set(String(h).padStart(2, '0'));
    this.mm.set(String(m).padStart(2, '0'));
  }

  // Flash Sale section (displays exactly 4 books in a single neat row)
  getFlashSaleBooks(): Book[] {
    return this.books.filter(b => b.isFlashSale).slice(0, 4);
  }

  // Get filtered and sorted books for Suggestions section
  getFilteredBooks(): Book[] {
    let result = [...this.books];

    // 1. Filter by Price Ranges (OR within price group)
    const hasPriceFilter = Object.values(this.selectedPriceRanges).some(v => v);
    if (hasPriceFilter) {
      result = result.filter(b => {
        if (this.selectedPriceRanges.under50 && b.price < 50000) return true;
        if (this.selectedPriceRanges.from50to100 && b.price >= 50000 && b.price <= 100000) return true;
        if (this.selectedPriceRanges.above100 && b.price > 100000) return true;
        return false;
      });
    }

    // 2. Filter by Category (OR within category group)
    const hasCategoryFilter = Object.values(this.selectedCategories).some(v => v);
    if (hasCategoryFilter) {
      result = result.filter(b => {
        if (this.selectedCategories.vanHoc && b.category === 'Văn học') return true;
        if (this.selectedCategories.kinhTe && b.category === 'Kinh tế') return true;
        if (this.selectedCategories.tamLyKyNang && b.category === 'Tâm lý - Kỹ năng sống') return true;
        if (this.selectedCategories.thieuNhi && b.category === 'Sách thiếu nhi') return true;
        if (this.selectedCategories.tieuSuHoiKy && b.category === 'Tiểu sử - Hồi ký') return true;
        return false;
      });
    }

    // 3. Filter by Age Ranges (OR within age group)
    const hasAgeFilter = Object.values(this.selectedAgeRanges).some(v => v);
    if (hasAgeFilter) {
      result = result.filter(b => {
        if (this.selectedAgeRanges.thieuNhi && b.ageRange === 'thieu-nhi') return true;
        if (this.selectedAgeRanges.tuoiTeen && b.ageRange === 'tuoi-teen') return true;
        if (this.selectedAgeRanges.nguoiLon && b.ageRange === 'nguoi-lon') return true;
        return false;
      });
    }

    // 4. Sort
    if (this.selectedSort === 'salesWeekly') {
      result.sort((a, b) => b.salesWeekly - a.salesWeekly);
    } else if (this.selectedSort === 'salesMonthly') {
      result.sort((a, b) => b.salesMonthly - a.salesMonthly);
    } else if (this.selectedSort === 'discount') {
      result.sort((a, b) => b.discountVal - a.discountVal);
    }

    // Limit to exactly 16 books (4 columns, 4 rows)
    return result.slice(0, 16);
  }

  // Reset all filters to show all products
  resetFilters(): void {
    this.selectedPriceRanges = { under50: false, from50to100: false, above100: false };
    this.selectedCategories = { vanHoc: false, kinhTe: false, tamLyKyNang: false, thieuNhi: false, tieuSuHoiKy: false };
    this.selectedAgeRanges = { thieuNhi: false, tuoiTeen: false, nguoiLon: false };
  }
}
