function toUserProfileDto(row) {
  if (!row) return null;

  return {
    id: row.id,
    email: row.email,
    firstName: row.first_name || null,
    lastName: row.last_name || null,
    name: `${row.first_name || ''} ${row.last_name || ''}`.trim(),
    tenantId: row.primary_tenant_id,
    role: row.tenant_role || null,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

module.exports = {
  toUserProfileDto
};
