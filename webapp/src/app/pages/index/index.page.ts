import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppTheme, ThemeService } from '@lib/services/theme';
import { Subject, takeUntil } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './index.page.html',
  styleUrls: ['./index.page.css'],
})
export class IndexPage implements OnInit, OnDestroy {

  constructor() {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}
}
