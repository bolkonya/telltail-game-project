import initDataBase from './db-init';
import Achievement from './models/achievement';
import Adventure from './models/adventure';
import Tag from './models/tag';

async function fillDataBase() {
    // Создание тегов
    const magicTag = await Tag.create({slug: 'магия', name: 'magic'});
    const fantasyTag = await Tag.create({slug: 'фэнтези', name: 'fantasy'});
    const teamTag = await Tag.create({slug: 'партийный', name: 'team'});
    const dramaticTag = await Tag.create({slug: 'драма', name: 'drama'});

    // Создание ачивок
    const sweetHomeAch = await Achievement.create({
        name: 'Дом, милый дом',
        image: 'images/achievements/sweet-home.jpg'
    });
    const sadEndAch = await Achievement.create({
        name: 'Печальный конец',
        image: 'images/achievements/sad-end.jpg'
    });
    const failAch = await Achievement.create({
        name: 'Неловко вышло...',
        image: 'images/achievements/awkwardly.jpg'
    });

    const imgPositions = {
        rightUp: 'right-up',
        leftUp: 'left-up',
        leftDown: 'left-down',
        rightDown: 'right-down'
    };
    // Приключение 1
    const bigEvilAdv = await Adventure.create({
        name: 'Великое Зло',
        description: 'Великое Зло пробудилось на севере. Верховный волшебник попросил вас отправиться туда и выяснить, насколько всё плохо.',
        image: 'images/adventures/bigEvil/bigEvil.jpg'
    });
    await bigEvilAdv.addTags([magicTag, fantasyTag]);
    const firstSceneBigEvil = await bigEvilAdv.addScene({
        description: 'Ты отправляешься в Северные Пустоши. Как ты туда доберешься?',
        image: 'images/adventures/bigEvil/scenes/begin.jpg',
        position: imgPositions.leftDown
    });
    await bigEvilAdv.setFirstScene(firstSceneBigEvil);
    const secondSceneBigEvil = await bigEvilAdv.addScene({
        description: 'Вернуться домой и продолжить жить обычной жизнью - хорошая идея. Но через пару месяцев твою деревню сожгли северные орки...',
        image: 'images/adventures/bigEvil/scenes/end.jpg',
        position: imgPositions.rightUp
    });
    await firstSceneBigEvil.addAction({name: 'Развернуться и пойти домой', target: secondSceneBigEvil});
    await secondSceneBigEvil.addAchievements([sweetHomeAch]);

    const beSoonSceneDescriptor = {
        description: 'Скоро здесь будет приключение!'
    };

    // Приключение 2
    const thiefGuildAdv = await Adventure.create({
        name: 'Просьба гильдии воров',
        description: 'Глава гильдии воров Доня приглашает всех желающих в свое логово. Говорят, он собирается назначить награду за чью-то голову.',
        image: 'images/adventures/thiefGuild/thiefGuild.jpg'
    });
    await thiefGuildAdv.addTags([fantasyTag, dramaticTag, teamTag]);
    const firstSceneTG = await thiefGuildAdv.addScene({
        description: 'Ты прибыл в логово Дони - главы гильдии воров в Екатерифтене. Перед тобой стоят два бугая. Они спрашивают: зачем пришел?',
        image: 'images/adventures/thiefGuild/scenes/thief.jpg',
        position: imgPositions.rightUp
    });
    const secondSceneTG = await thiefGuildAdv.addScene({
        description: 'Охрана пропускает тебя. Войдя внутрь, ты удивился - для "логова" здесь слишком много дорогих вещей и изысканных картин. В центре зала собралась небольшая группа людей.',
        image: 'images/adventures/thiefGuild/scenes/den.jpg',
        position: imgPositions.rightDown
    });
    const homeSceneTG = await thiefGuildAdv.addScene({
        description: 'Вернувшись домой, ты понял, что поступил правильно: нечего связываться с бандюганами.',
        image: 'images/adventures/thiefGuild/scenes/home.jpg',
        position: imgPositions.leftUp
    });
    homeSceneTG.addAchievements([sweetHomeAch]);
    await firstSceneTG.addAction({name: 'Извиниться и убежать', target: homeSceneTG});
    await firstSceneTG.addAction({name: 'Сказать, что ты пришел узнать о награде за голову', target: secondSceneTG});
    await secondSceneTG.addAction({name: 'Уйти домой', target: homeSceneTG});
    const thirdSceneTG = await thiefGuildAdv.addScene({
        description: 'Подойдя поближе, вы увидели Доню - он с хитрой улыбкой крутил в руках кинжал. Наконец он заговорил: награда объявлена за его бывшего товарища Мичу: тот украл у него большую часть сокровищ и ускакал на Донином коне неизвестно куда...',
        image: 'images/adventures/thiefGuild/scenes/thief-master.jpg',
        position: imgPositions.leftDown
    });
    await secondSceneTG.addAction({name: 'Подойти поближе', target: thirdSceneTG});

    const finalSceneTG = await thiefGuildAdv.addScene({
        description: 'Не стоило тебе сюда приходить: ведь ты и есть Мича. После гулянки на украденное золото ты все позабыл... Тебя схватили и бросили в бездонную яму...',
        image: 'images/adventures/thiefGuild/scenes/well.jpg',
        position: imgPositions.leftDown
    });
    await finalSceneTG.addAchievements([sadEndAch, failAch]);

    await thirdSceneTG.addAction({name: 'Заподозрить неладное...', target: finalSceneTG});

    // Приключение 3
    let defaultAdv = await Adventure.create({
        name: 'Что-то кончается, что-то начинается...'
    });
    await defaultAdv.addScene(beSoonSceneDescriptor);
    defaultAdv.addTags([fantasyTag]);

    defaultAdv = await Adventure.create({
        name: 'Грязные делишки'
    });
    await defaultAdv.addScene(beSoonSceneDescriptor);
    defaultAdv.addTags([fantasyTag]);

    defaultAdv = await Adventure.create({
        name: 'Контракт на крыс в подвале'
    });
    await defaultAdv.addScene(beSoonSceneDescriptor);
    defaultAdv.addTags([fantasyTag]);

    defaultAdv = await Adventure.create({
        name: 'Атака Короля Ночи'
    });
    await defaultAdv.addScene(beSoonSceneDescriptor);
    defaultAdv.addTags([fantasyTag]);

    defaultAdv = await Adventure.create({
        name: 'Битва с Таносом'
    });
    await defaultAdv.addScene(beSoonSceneDescriptor);

    defaultAdv = await Adventure.create({
        name: 'Выжить в России'
    });
    await defaultAdv.addScene(beSoonSceneDescriptor);
    defaultAdv.addTags([fantasyTag]);
}

initDataBase({force: true}).then(() => fillDataBase());
