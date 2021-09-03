const Sequelize = require('sequelize'),
  path = require('path'),
  sequelize = require('.' + path.sep + 'db')

class Providers extends Sequelize.Model {}
Providers.init({
    name: {type: Sequelize.STRING(100), allowNull: false},
  },
  {
    sequelize,
    modelName: 'providers',
    timestamps: false,
    indexes: [
      {fields: ['name']},
    ]
  })

Providers.sync({alter: true})


module.exports = Providers