const { query } = require('../../../shared/database/connection');

class UserRepository {
  async getUserProfile(userId, tenantId) {
    const sql = `
      SELECT 
        u.id,
        u.email,
        u.first_name,
        u.last_name,
        u.primary_tenant_id,
        u.is_active,
        u.created_at,
        u.updated_at,
        m.role as tenant_role
      FROM users u
      LEFT JOIN memberships m 
        ON m.user_id = u.id 
       AND m.tenant_id = u.primary_tenant_id
       AND m.deleted_at IS NULL
      WHERE u.id = $1
        AND u.primary_tenant_id = $2
        AND u.deleted_at IS NULL
      LIMIT 1
    `;

    const result = await query(sql, [userId, tenantId]);
    return result.rows[0] || null;
  }

  async updateUserProfile(userId, tenantId, updates) {
    const setClauses = [];
    const values = [userId, tenantId];
    let paramIndex = 3;

    if (updates.email !== undefined) {
      setClauses.push(`email = $${paramIndex}`);
      values.push(updates.email);
      paramIndex++;
    }
    if (updates.firstName !== undefined) {
      setClauses.push(`first_name = $${paramIndex}`);
      values.push(updates.firstName);
      paramIndex++;
    }
    if (updates.lastName !== undefined) {
      setClauses.push(`last_name = $${paramIndex}`);
      values.push(updates.lastName);
      paramIndex++;
    }

    if (setClauses.length === 0) {
      return null;
    }

    const sql = `
      UPDATE users
      SET ${setClauses.join(', ')}, updated_at = NOW()
      WHERE id = $1
        AND primary_tenant_id = $2
        AND deleted_at IS NULL
      RETURNING 
        id,
        email,
        first_name,
        last_name,
        primary_tenant_id,
        is_active,
        created_at,
        updated_at
    `;

    const result = await query(sql, values);
    return result.rows[0] || null;
  }
}

module.exports = UserRepository;
