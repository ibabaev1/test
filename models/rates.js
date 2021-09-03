const Sequelize = require('sequelize'),
  path = require('path'),
  sequelize = require('.' + path.sep + 'db'),
  { QueryTypes } = require('sequelize');

class Rates extends Sequelize.Model {
  static async getRates(from, to, provider) {
    let queryStr =
      `
      SELECT r1.from, r1.to, r1.rate, r1.lastupdate, p1.name AS provider
      FROM rates r1, 
          (
            SELECT r2.from, r2.to, r2.providerId, MAX(r2.lastupdate) AS lastupdate
            FROM rates r2, providers p2 WHERE 1=1
              AND r2.from IN (:from)
              AND r2.to IN (:to)
              AND r2.providerId = p2.id
            GROUP BY r2.from, r2.to, r2.providerId
          ) r2, providers p1
      WHERE 1=1
        AND r1.from IN (:from)
        AND r1.to IN (:to)
        AND r2.lastupdate = r1.lastupdate
        AND r2.from = r1.from
        AND r2.to = r1.to
        AND r2.providerId = r2.providerId
        AND r1.providerId = p1.id`
    const replacment = { from, to }

    if(provider) {
      queryStr += ' AND p1.name = :provider'
      replacment['provider'] = provider
    }
    const rates = await sequelize.query(queryStr, {
      replacements: replacment,
      type: QueryTypes.SELECT,
      logging: false//console.log
    })

    if(rates) {
      rates.forEach(el => {
        el.rate = parseFloat(el.rate)
      })
    }

    return rates
  }
}
Rates.init({
    providerId: {type: Sequelize.INTEGER.UNSIGNED, allowNull: false},
    from: {type: Sequelize.STRING(6), allowNull:false},
    to: {type: Sequelize.STRING(6), allowNull:false},
    rate: {type: Sequelize.DECIMAL(40,20), allowNull: false},
    lastupdate: {type: Sequelize.INTEGER.UNSIGNED, allowNull: false},
  },
  {
    engine: 'MYISAM',
    sequelize,
    modelName: 'rates',
    timestamps: false,
    indexes: [
      {fields: ['providerId']},
      {fields: ['from']},
      {fields: ['to']},
      {fields: ['lastupdate']},
    ]
  })

Rates.sync({alter: true})


module.exports = Rates