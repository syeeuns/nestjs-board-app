import { User } from 'src/auth/user.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { BoardStatus } from './board-status.enum';
import {v1 as uuid} from 'uuid';
import { CreateBoardDto } from './dto/create-board.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './board.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BoardsService {
    constructor(
        @InjectRepository(Board)
        private readonly boardRepository: Repository<Board>
    ) {}

    async getAllBoards(): Promise<Board[]> {
        return this.boardRepository.find();
    }

    async getUsersAllBoards(user: User): Promise<Board[]> {
        const query = this.boardRepository.createQueryBuilder('board');
        query.where('board.userId = :userId', {userId: user.id});
        return await query.getMany();
    }

    async createBoard(
        createBoardDto: CreateBoardDto, 
        user: User
    ): Promise<Board> {
        const {title, description} = createBoardDto;

        const board: Board = this.boardRepository.create({
            title,
            description,
            status: BoardStatus.PUBLIC,
            user
        });
        
        await this.boardRepository.save(board);
        return board;
    }

    async getBoardById(id: number): Promise<Board> {
        const found: Board = await this.boardRepository.findOneBy({ id });
        
        if (!found) {
            throw new NotFoundException(`Cannot find Board with id ${id}`);
        }
        return found;
    }

    async deleteBoard(id: number, user: User): Promise<void> {
        const result = await this.boardRepository
                            .createQueryBuilder('board')
                            .delete()
                            .where('id = :id', {id})
                            .andWhere('userId = :userId', {userId: user.id})
                            .execute();

        if (result.affected === 0) {
            throw new NotFoundException(`Cannot find Board with id ${id}`);
        }
    }

    async updateBoardStatus(id: number, status: BoardStatus): Promise<Board> {
        const board = await this.getBoardById(id);
        board.status = status;
        await this.boardRepository.save(board);
        return board;
    } 
}
