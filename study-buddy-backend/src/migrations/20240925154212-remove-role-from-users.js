'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Commenting out the removal of the role column
        // await queryInterface.removeColumn('Users', 'role');
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('Users', 'role', {
            type: Sequelize.ENUM('student', 'educator'),
            defaultValue: 'student',
        });
    }
};
