import { Injectable } from '@nestjs/common';
import { CreateGameRoundDto } from './dto/create-game_round.dto';
import { UpdateGameRoundDto } from './dto/update-game_round.dto';
import { GameRound } from './models/game_round.model';
import { InjectModel } from '@nestjs/sequelize';
import { randomWords, images } from 'utils/data';

@Injectable()
export class GameRoundService {
  constructor(
    @InjectModel(GameRound) private gameroundModel: typeof GameRound,
  ) {}
  async createRound(createGameRoundDto: CreateGameRoundDto) {
    const { category, number_of_proposals } = createGameRoundDto;
    const values: string[] = [];
    if (category === 'words') {
      for (let i = 0; i <= number_of_proposals - 1; i++) {
        values.push(this.randomValue(randomWords));
      }
    }
    if (category === 'images') {
      for (let i = 0; i <= number_of_proposals - 1; i++) {
        values.push(this.randomValue(images));
      }
    }

    const rowToStore = new this.gameroundModel({
      proposals: JSON.stringify(values),
      round_number: createGameRoundDto.round_number,
      number_of_proposals,
      category,
      gamesession_id: createGameRoundDto.gamesession_id,
    });

    // if (createGameRoundDto.round_number > 1) {
    //   const existingGame = await this.update(createGameRoundDto.id, {
    //     number_of_proposals: createGameRoundDto.number_of_proposals,
    //     round_number: createGameRoundDto.round_number,
    //     category: createGameRoundDto.category,
    //     proposals: JSON.stringify(values),
    //     gamesession_id: createGameRoundDto.gamesession_id,
    //   });
    //   if (existingGame) return { ...existingGame, proposals: JSON.parse(existingGame.proposals) };
    // }else {

      if(rowToStore.round_number <= 5 && rowToStore.round_number>0) {
        const newRound = await rowToStore.save();
        return { ...newRound, proposals: JSON.parse(newRound.proposals) };
      }else {
        console.log("only 5 rounds are allowed");
      return null;
      }
      

     
    // }

   
  }

  findAll() {
    return `This action returns all gameRound`;
  }

  async findOne(id: string) {
    const round = await this.gameroundModel.findByPk(id);
    return round ? round : null;
  }

  async update(id: string, updateGameRoundDto: UpdateGameRoundDto) {
    const existingGameRound = await this.gameroundModel.findByPk(id);
    if (existingGameRound) {
      existingGameRound.number_of_proposals =
        updateGameRoundDto.number_of_proposals;
      existingGameRound.round_number += 1;
      existingGameRound.category = updateGameRoundDto.category;
      existingGameRound.proposals = updateGameRoundDto.proposals;
      existingGameRound.gamesession_id = updateGameRoundDto.gamesession_id;

      return await existingGameRound.save();
    } else return null;
  }

  remove(id: number) {
    return `This action removes a #${id} gameRound`;
  }

  randomValue = (arr: string[]): string => {
    const index = Math.floor(Math.random() * arr.length);
    return arr[index];
  };

  async checkGameState(id: string) {
    const round = await this.gameroundModel.findByPk(id);
    if (round && round.round_number === 5) {
      return 'game ended';
    }
   
  }
}
