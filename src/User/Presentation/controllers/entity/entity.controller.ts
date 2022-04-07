import { Controller, Get, Param } from '@nestjs/common';

@Controller('entity')
export class EntityController {
  @Get()
  private helloWorld() {
    return 'Hello world';
  }

  @Get('/:id')
  private helloWorldId(@Param('id') id: string) {
    return `Hello world ${id}`;
  }
}
