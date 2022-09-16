import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { BoardStatus } from "../board-status.enum";

export class BoardStatusValidationPipe implements PipeTransform {

    readonly StatusOptions = [
        BoardStatus.PRIVATE,
        BoardStatus.PUBLIC
    ]

    transform(value: any, metadata: ArgumentMetadata) {
        value = value.toUpperCase();

        if (!this.isValidStatus(value)) {
            throw new BadRequestException(`${value} isn't in the status options`);
        }
        return value; 
    }
    
    private isValidStatus(value: any): boolean {
        const index = this.StatusOptions.indexOf(value);
        return index !== -1;
    }
}