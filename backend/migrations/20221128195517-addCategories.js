const CyrillicToTranslit = require('cyrillic-to-translit-js');

module.exports = {
  async up(db, client) {
    const cyrillicToTranslit = new CyrillicToTranslit();
    let categories = [
      {
        name: 'Комнатные растения',
      },
      {
        name: 'Флорариумы',
      },
      {
        name: 'Сухоцветы',
      },
      {
        name: 'Кашпо и горшки',
      },
    ];
    categories = categories.map(item => {
      item.url = cyrillicToTranslit.transform(item.name, "_").toLowerCase();
      return item;
    });

    const categoriesResult = await db.collection('categories').insertMany(categories);

    let types = [
      {
        name: 'Кактусы',
        category: categoriesResult.insertedIds['0']
      },
      {
        name: 'Суккуленты',
        category: categoriesResult.insertedIds['0']
      },
      {
        name: 'Эхеверии',
        category: categoriesResult.insertedIds['0']
      },
      {
        name: 'Цветущие комнатные растения',
        category: categoriesResult.insertedIds['0']
      },
      {
        name: 'Пальмы домашние',
        category: categoriesResult.insertedIds['0']
      },
      {
        name: 'Маленький',
        category: categoriesResult.insertedIds['1']
      },
      {
        name: 'Средний',
        category: categoriesResult.insertedIds['1']
      },
      {
        name: 'Большой',
        category: categoriesResult.insertedIds['1']
      },
      {
        name: 'Хлопок',
        category: categoriesResult.insertedIds['2']
      },
      {
        name: 'Лаванда',
        category: categoriesResult.insertedIds['2']
      },
      {
        name: 'Букеты',
        category: categoriesResult.insertedIds['2']
      },
      {
        name: 'Кашпо керамическое',
        category: categoriesResult.insertedIds['3']
      },
      {
        name: 'Кашпо металлическое',
        category: categoriesResult.insertedIds['3']
      },
      {
        name: 'Кашпо бетонное',
        category: categoriesResult.insertedIds['3']
      },
      {
        name: 'Ваза керамическая',
        category: categoriesResult.insertedIds['3']
      },
    ];

    types = types.map(item => {
      item.url = cyrillicToTranslit.transform(item.name, "_").toLowerCase();
      return item;
    });

    await db.collection('types').insertMany(types);
  },

  async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};
