import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/hello')
  getHello(@Res() res: Response) {
    res.status(HttpStatus.OK).json({ message: this.appService.getHello() });
  }
}
