import { AuthGuard } from '@nestjs/passport';
import { Body, Controller, Delete, Get, Logger, Param, ParseIntPipe, Patch, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { BoardStatus } from './board-status.enum';
import { Board } from './board.entity';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardStatusValidationPipe } from './pipes/board-status-validation.pipe';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';

@Controller('boards')
@UseGuards(AuthGuard())
export class BoardsController {
    private logger = new Logger('BoardsController');
    constructor(private boardService: BoardsService) {}

    @Get()
    getAllBoard(): Promise<Board[]> {
        return this.boardService.getAllBoards();
    }

    @Get('/user')
    getUsersAllBoard(@GetUser() user: User): Promise<Board[]> {
        this.logger.verbose(`User ${user.username} trying to get all boards`);
        return this.boardService.getUsersAllBoards(user);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createBoard(
        @Body() createBoardDto: CreateBoardDto,
        @GetUser() user: User
    ): Promise<Board> {
        this.logger.verbose(`User ${user.username} trying to create a new board. 
        Payload: ${JSON.stringify(createBoardDto)}`);
        return this.boardService.createBoard(createBoardDto, user);
    }

    @Get('/:id')
    getBoardById(@Param('id', ParseIntPipe) id: number): Promise<Board> {
        return this.boardService.getBoardById(id);
    }

    @Delete('/:id')
    deleteBoard(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User
    ): Promise<void> {
        return this.boardService.deleteBoard(id, user);
    }

    @Patch('/:id/status')
    updateBoardStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body('status', BoardStatusValidationPipe) status: BoardStatus
    ): Promise<Board> {
        return this.boardService.updateBoardStatus(id, status);
    }
}
