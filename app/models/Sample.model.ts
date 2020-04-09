import { IsEmail } from "class-validator";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("sample")
export class Sample extends BaseEntity {

    @PrimaryGeneratedColumn() // 인덱스 자동 증가.
    public id: number;

    @Column("text")
    public text: string;

    @Column("text")
    public name: string;

    @Column("text")
    @IsEmail()
    public email: string;

}
