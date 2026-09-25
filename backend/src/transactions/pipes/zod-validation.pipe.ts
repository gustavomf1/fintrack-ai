import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import type { ZodSchema } from 'zod';

@Injectable()
  export class ZodValidationPipe implements PipeTransform {
    constructor(private readonly schema: ZodSchema) {}
    
    transform(value: unknown) {
      try {
        return this.schema.parse(value);
      } catch (err) {
        throw new BadRequestException((err as Error).message);
      } 
    } 
  } 