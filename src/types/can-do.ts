export class CanDo {
    id: number;
    name: string;
    difficultyLevel: number;
    objectives?: CanDoObjective[];
}

export class CanDoObjective {
    id: number;
    description: string;
    sequence: number;
    canDoId: number;
}
