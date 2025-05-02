'use strict';
const bcrypt = require('bcryptjs')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    let dataUsers = require('../data/users.json')
    dataUsers = dataUsers.map((el) => {
      delete el.id;
      el.createdAt = el.updatedAt = new Date();

      let salt = bcrypt.genSaltSync(10);
      el.password = bcrypt.hashSync(el.password, salt)
      return el;
    });
    await queryInterface.bulkInsert("Users", dataUsers)
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Users', null, {})
  }
};
