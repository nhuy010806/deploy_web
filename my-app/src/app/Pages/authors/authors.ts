import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BookService, Book, OldBook } from '../../Services/book.service';
import { forkJoin } from 'rxjs';

interface AuthorBook {
  _id: string;
  title: string;
  author: string;
  img: string;
  price: number;
  priceStr: string;
  oldPrice?: string;
  discount?: string;
  isOld: boolean;
}

interface DisplayAuthor {
  name: string;
  bookCount: number;
  initials: string;
}

@Component({
  selector: 'app-authors',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './authors.html',
  styleUrl: './authors.css',
})
export class AuthorsComponent implements OnInit {
  private readonly bookService = inject(BookService);
  private readonly cdr = inject(ChangeDetectorRef);

  // Dữ liệu nguồn
  allBooks: AuthorBook[] = [];
  authors: DisplayAuthor[] = [];

  // Trạng thái lọc tác giả
  filteredAuthors: DisplayAuthor[] = [];
  searchQuery = '';
  selectedLetter = '';

  // Trạng thái chọn tác giả & tác phẩm
  selectedAuthor = '';
  booksByAuthor: AuthorBook[] = [];
  selectedAuthorNewCount = 0;
  selectedAuthorOldCount = 0;
  
  // Trọng tâm số liệu tổng quan (Stats)
  totalNewBooks = 0;
  totalOldBooks = 0;
  isLoading = true;

  // Bảng chữ cái để lọc nhanh
  alphabet: string[] = [
    'A', 'B', 'C', 'D', 'E', 'G', 'H', 'I', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'X', 'Y'
  ];

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.isLoading = true;
    
    forkJoin({
      newBooks: this.bookService.getBooks(),
      oldBooks: this.bookService.getOldBooks()
    }).subscribe({
      next: (result) => {
        const formattedNew: AuthorBook[] = result.newBooks.map((b: Book) => ({
          _id: b._id || '',
          title: b.title || '',
          author: b.author || '',
          img: b.image || b.url || 'assets/img/default-book.png',
          price: b.price_current || 0,
          priceStr: (b.price_current || 0).toLocaleString('vi-VN') + 'đ',
          oldPrice: b.price_old ? b.price_old.toLocaleString('vi-VN') + 'đ' : undefined,
          discount: b.discount_percent ? `-${b.discount_percent}%` : undefined,
          isOld: false
        }));

        const formattedOld: AuthorBook[] = result.oldBooks.map((b: OldBook) => {
          const priceVal = b.current_price || 0;
          const oldPriceVal = b.original_price;
          const discountVal = oldPriceVal && oldPriceVal > priceVal
            ? Math.round((1 - priceVal / oldPriceVal) * 100)
            : 0;

          return {
            _id: b._id || '',
            title: b.name || '',
            author: b.author || '',
            img: b.thumbnail || 'assets/img/default-book.png',
            price: priceVal,
            priceStr: priceVal.toLocaleString('vi-VN') + 'đ',
            oldPrice: oldPriceVal ? oldPriceVal.toLocaleString('vi-VN') + 'đ' : undefined,
            discount: discountVal > 0 ? `-${discountVal}%` : undefined,
            isOld: true
          };
        });

        this.allBooks = [...formattedNew, ...formattedOld];
        this.totalNewBooks = formattedNew.length;
        this.totalOldBooks = formattedOld.length;

        // Thống kê đếm số tác phẩm cho từng tác giả
        const authorMap = new Map<string, number>();
        this.allBooks.forEach(b => {
          if (b.author && b.author.trim()) {
            const name = b.author.trim();
            authorMap.set(name, (authorMap.get(name) || 0) + 1);
          }
        });

        // Tạo mảng tác giả kèm viết tắt và đếm số lượng
        this.authors = Array.from(authorMap.entries()).map(([name, count]) => {
          const nameParts = name.split(' ');
          const lastPart = nameParts[nameParts.length - 1];
          const rawInit = lastPart ? lastPart.charAt(0).toUpperCase() : name.charAt(0).toUpperCase();
          
          return {
            name,
            bookCount: count,
            initials: this.removeVietnameseTones(rawInit)
          };
        }).sort((a, b) => a.name.localeCompare(b.name, 'vi'));

        this.filteredAuthors = [...this.authors];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Lỗi khi tải dữ liệu cho góc tác giả:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Lọc tác giả theo ô tìm kiếm và chữ cái đầu
  filterAuthors(): void {
    let result = this.authors;

    // Lọc theo chữ cái chọn
    if (this.selectedLetter) {
      result = result.filter(author => {
        const firstLetter = this.removeVietnameseTones(author.name.trim().charAt(0)).toUpperCase();
        return firstLetter === this.selectedLetter;
      });
    }

    // Lọc theo ô tìm kiếm
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      result = result.filter(author => author.name.toLowerCase().includes(q));
    }

    this.filteredAuthors = result;
  }

  // Chọn bộ lọc chữ cái
  selectLetter(letter: string): void {
    if (this.selectedLetter === letter) {
      this.selectedLetter = '';
    } else {
      this.selectedLetter = letter;
    }
    this.filterAuthors();
  }

  // Reset tìm kiếm và bộ lọc chữ cái
  resetFilters(): void {
    this.searchQuery = '';
    this.selectedLetter = '';
    this.filteredAuthors = [...this.authors];
  }

  // Chọn tác giả hiển thị sách
  selectAuthor(authorName: string): void {
    this.selectedAuthor = authorName;
    this.booksByAuthor = this.allBooks.filter(
      book => book.author.trim().toLowerCase() === authorName.trim().toLowerCase()
    );

    // Đếm sách cũ/mới của tác giả này
    this.selectedAuthorNewCount = this.booksByAuthor.filter(b => !b.isOld).length;
    this.selectedAuthorOldCount = this.booksByAuthor.filter(b => b.isOld).length;
  }

  // Hàm loại bỏ dấu tiếng Việt để so sánh chữ cái đầu
  private removeVietnameseTones(str: string): string {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
    str = str.replace(/ò|ó|ọ|ỏ|ã|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
    str = str.replace(/ù|á|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
    str = str.replace(/đ/g, 'd');
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
    str = str.replace(/Đ/g, 'D');
    return str;
  }
}
