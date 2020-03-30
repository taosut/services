import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';
import { Invoice } from './invoice.entity';
import { InvoiceService } from './invoice.service';

@Crud({
  model: {
    type: Invoice,
  },
})
@ApiUseTags('invoice')
@Controller('invoice')
@ApiBearerAuth()
export class InvoiceController {
  constructor(protected readonly service: InvoiceService) {}
}
