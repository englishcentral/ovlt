
export const CLASSLEVELTESTSETTING_DEFAULT_WORDLISTTYPEID_SETA: number = 101232;
export const CLASSLEVELTESTSETTING_DEFAULT_WORDLISTTYPEID_SETB: number = 39701;

export class ClassLevelTestSettings {
    classId: number;
    classLevelTestSettings: ClassLevelTestSetting[];
}

export class ClassLevelTestSetting {
    levelTestSetting: LevelTestSetting;
    modeIds?: number[];
    classLevelTestId?: number;
    curatedLevelTestId?: number;
    levelTestSettingId?: number;
    name?: string;
    classId?: number;
    listRank?: number;
}

export class LevelTestSetting {
    bandSize?: number;
    created?: number;
    samplingSize?: number;
    startRank?: number;
    endRank?: number;
    levelTestSettingId?: number;
    wordListTypeId?: number;
    levelTestScoreLogicTypeId?: number;
}

export const calculateVltListRank = (setting: ClassLevelTestSetting): number => {
    if (!setting?.levelTestSetting) {
        return;
    }
    const entireList = setting.levelTestSetting.endRank - setting.levelTestSetting.startRank;
    const numberOfBands = entireList / setting.levelTestSetting.bandSize;
    const rank = setting.levelTestSetting.samplingSize * numberOfBands;
    return Math.floor(rank);
};
