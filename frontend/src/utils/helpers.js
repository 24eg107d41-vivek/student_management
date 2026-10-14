// Helper utilities for Student Management System

export const AVATAR_GRADIENTS = [
  'linear-gradient(135deg, #6366f1, #8b5cf6)',
  'linear-gradient(135deg, #3b82f6, #06b6d4)',
  'linear-gradient(135deg, #10b981, #059669)',
  'linear-gradient(135deg, #f59e0b, #d97706)',
  'linear-gradient(135deg, #ec4899, #8b5cf6)',
  'linear-gradient(135deg, #14b8a6, #0284c7)',
  'linear-gradient(135deg, #f43f5e, #fb7185)',
  'linear-gradient(135deg, #8b5cf6, #d946ef)'
];

export function getAvatarColor(identifier = '') {
  let hash = 0;
  for (let i = 0; i < identifier.length; i++) {
    hash = identifier.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_GRADIENTS.length;
  return AVATAR_GRADIENTS[index];
}

export function getInitials(name = '') {
  if (!name.trim()) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.trim().substring(0, 2).toUpperCase();
}

export function getDeptClass(dept = '') {
  const d = dept.toLowerCase();
  if (d.includes('computer') || d.includes('cs') || d.includes('software')) return 'dept-cs';
  if (d.includes('information') || d.includes('it')) return 'dept-it';
  if (d.includes('mech')) return 'dept-mech';
  if (d.includes('elec') || d.includes('comm') || d.includes('ece') || d.includes('eee')) return 'dept-ece';
  if (d.includes('civil')) return 'dept-civil';
  return 'dept-default';
}

export function exportToCSV(students = [], filename = 'students_export.csv') {
  if (!students.length) return false;

  const headers = ['ID', 'Name', 'Email', 'Phone', 'Department', 'Year'];
  const rows = students.map((s) => [
    s.id,
    `"${(s.name || '').replace(/"/g, '""')}"`,
    `"${(s.email || '').replace(/"/g, '""')}"`,
    `"${(s.phone || '').replace(/"/g, '""')}"`,
    `"${(s.department || '').replace(/"/g, '""')}"`,
    s.year || 1,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return true;
}
