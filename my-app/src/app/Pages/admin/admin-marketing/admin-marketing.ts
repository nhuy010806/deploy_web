import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { BookService, NewsArticle } from '../../../Services/book.service';

@Component({
  selector: 'app-admin-marketing',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-marketing.html',
  styleUrl: './admin-marketing.css'
})
export class AdminMarketingComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);
  private readonly bookService = inject(BookService);
  private readonly cdr = inject(ChangeDetectorRef);

  newsList: NewsArticle[] = [];
  isLoading = true;
  showModal = false;
  isEditMode = false;
  currentArticleId: string | null = null;

  readonly articleForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(5)]],
    tag: ['SỰ KIỆN', [Validators.required]],
    img: ['', [Validators.required]],
    desc: ['', [Validators.required]],
    content: ['', [Validators.required]]
  });

  ngOnInit(): void {
    this.loadNews();
  }

  loadNews(): void {
    this.isLoading = true;
    this.bookService.getNews().subscribe({
      next: (data) => {
        this.newsList = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Lỗi khi tải tin tức:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.currentArticleId = null;
    this.articleForm.reset({
      tag: 'SỰ KIỆN',
      title: '',
      img: '',
      desc: '',
      content: ''
    });
    this.showModal = true;
  }

  openEditModal(article: NewsArticle): void {
    this.isEditMode = true;
    this.currentArticleId = article.id || article._id || null;
    this.articleForm.patchValue({
      title: article.title,
      tag: article.tag,
      img: article.img,
      desc: article.desc,
      content: article.content
    });
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  onImageSelected(event: any): void {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Dung lượng ảnh tối đa là 2MB!');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        this.articleForm.patchValue({
          img: reader.result as string
        });
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.articleForm.invalid) {
      alert('Vui lòng điền đầy đủ thông tin hợp lệ.');
      return;
    }

    const payload = this.articleForm.value;
    if (this.isEditMode && this.currentArticleId) {
      // Edit mode
      this.http.put(`http://localhost:3002/api/news/${this.currentArticleId}`, payload).subscribe({
        next: () => {
          alert('Cập nhật bài viết thành công!');
          this.closeModal();
          this.loadNews();
        },
        error: (err) => {
          alert('Lỗi cập nhật bài viết: ' + (err.error?.error || err.message));
        }
      });
    } else {
      // Add mode
      this.http.post('http://localhost:3002/api/news', payload).subscribe({
        next: () => {
          alert('Thêm bài viết thành công!');
          this.closeModal();
          this.loadNews();
        },
        error: (err) => {
          alert('Lỗi thêm bài viết: ' + (err.error?.error || err.message));
        }
      });
    }
  }

  onDelete(article: NewsArticle): void {
    const id = article.id || article._id;
    if (!id) return;

    if (confirm(`Bạn có chắc chắn muốn xóa bài viết "${article.title}" không?`)) {
      this.http.delete(`http://localhost:3002/api/news/${id}`).subscribe({
        next: () => {
          alert('Xóa bài viết thành công!');
          this.loadNews();
        },
        error: (err) => {
          alert('Lỗi khi xóa bài viết: ' + (err.error?.error || err.message));
        }
      });
    }
  }
}
