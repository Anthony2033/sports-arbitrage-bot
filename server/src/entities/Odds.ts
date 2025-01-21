import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class Odds {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  sport: string

  @Column()
  event: string

  @Column()
  startTime: Date

  @Column()
  homeTeam: string

  @Column()
  awayTeam: string

  @Column('jsonb')
  homeOdds: Array<{ name: string, odds: number }>

  @Column('jsonb')
  awayOdds: Array<{ name: string, odds: number }>

  @Column()
  lastUpdated: Date
}