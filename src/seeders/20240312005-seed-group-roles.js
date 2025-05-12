'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.bulkDelete('GroupRoles', null, {});
      
      // Reset auto-increment
      await queryInterface.sequelize.query('ALTER TABLE GroupRoles AUTO_INCREMENT = 1;');

      // Define student permissions by ID (1-5 are basic permissions)
      const studentRoleIds = [1, 2, 3, 4, 5]; // account, register, login, logout, books/read
      const adminRoleIds = Array.from({ length: 30 }, (_, i) => i + 1); // All roles (1-30)

      // Create GroupRoles arrays with explicit IDs
      let currentId = 1;
      
      // Create student role assignments
      const studentGroupRoles = studentRoleIds.map(roleId => ({
        id: currentId++,
        groupId: 2, // Student group ID
        roleId: roleId,
        createdAt: new Date(),
        updatedAt: new Date()
      }));

      // Create admin role assignments
      const adminGroupRoles = adminRoleIds.map(roleId => ({
        id: currentId++,
        groupId: 1, // Admin group ID
        roleId: roleId,
        createdAt: new Date(),
        updatedAt: new Date()
      }));

      // Combine and insert all GroupRoles
      const allGroupRoles = [...studentGroupRoles, ...adminGroupRoles];
      console.log('Inserting GroupRoles:', allGroupRoles.length);
      
      await queryInterface.bulkInsert('GroupRoles', allGroupRoles);

      // Verify the insertion
      const insertedRoles = await queryInterface.sequelize.query(
        `SELECT COUNT(*) as count FROM GroupRoles;`,
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );
      
      console.log('Total GroupRoles in database:', insertedRoles[0].count);
      console.log('Expected student roles:', studentRoleIds.length);
      console.log('Expected admin roles:', adminRoleIds.length);
      console.log('Total expected roles:', studentRoleIds.length + adminRoleIds.length);

    } catch (error) {
      console.error('Error in seed-group-roles:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('GroupRoles', null, {});
  }
}; 