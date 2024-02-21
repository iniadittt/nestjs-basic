import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getHello2(): { message: string } {
    return { message: 'Hello World in /hello' };
  }
}
