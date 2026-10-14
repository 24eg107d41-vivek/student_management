import React from 'react';
import { Users, Building2, Award, Cpu } from 'lucide-react';

export function StatCards({ students, serverStatus }) {
  const totalStudents = students.length;

  // Compute Department counts
  const deptCounts = {};
  students.forEach((s) => {
    if (s.department && s.department.trim()) {
      const d = s.department.trim();
      deptCounts[d] = (deptCounts[d] || 0) + 1;
    }
  });

  const depts = Object.keys(deptCounts);
  const totalDepartments = depts.length;

  let topDepartment = '-';
  if (depts.length > 0) {
    topDepartment = depts.reduce((top, curr) =>
      deptCounts[curr] > deptCounts[top] ? curr : top, depts[0]
    );
  }

  return (
    <div className="stats-grid">
      {/* Total Students Card */}
      <div className="stat-card">
        <div className="stat-info">
          <span className="stat-label">Total Enrolled</span>
          <span className="stat-value" style={{ color: 'var(--primary)' }}>
            {totalStudents}
          </span>
          <span className="stat-sub">Active Students</span>
        </div>
        <div className="stat-icon-wrapper" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
          <Users size={24} />
        </div>
      </div>

      {/* Departments Card */}
      <div className="stat-card">
        <div className="stat-info">
          <span className="stat-label">Departments</span>
          <span className="stat-value" style={{ color: 'var(--secondary)' }}>
            {totalDepartments}
          </span>
          <span className="stat-sub">Academic Branches</span>
        </div>
        <div className="stat-icon-wrapper" style={{ background: 'var(--secondary-light)', color: 'var(--secondary)' }}>
          <Building2 size={24} />
        </div>
      </div>

      {/* Top Department Card */}
      <div className="stat-card">
        <div className="stat-info">
          <span className="stat-label">Top Department</span>
          <span
            className="stat-value"
            style={{
              fontSize: topDepartment.length > 15 ? '1.15rem' : '1.35rem',
              color: 'var(--success)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '170px',
            }}
            title={topDepartment}
          >
            {topDepartment}
          </span>
          <span className="stat-sub">
            {topDepartment !== '-' ? `${deptCounts[topDepartment]} students` : 'None yet'}
          </span>
        </div>
        <div className="stat-icon-wrapper" style={{ background: 'var(--success-light)', color: 'var(--success)' }}>
          <Award size={24} />
        </div>
      </div>

      {/* Full Stack Engine Card */}
      <div className="stat-card">
        <div className="stat-info">
          <span className="stat-label">Architecture</span>
          <span className="stat-value" style={{ fontSize: '1.25rem', color: 'var(--warning)' }}>
            Spring Boot & React
          </span>
          <span className="stat-sub">
            {serverStatus === 'online' ? 'REST API Active (Port 8080)' : 'Connecting to API...'}
          </span>
        </div>
        <div className="stat-icon-wrapper" style={{ background: 'var(--warning-light)', color: 'var(--warning)' }}>
          <Cpu size={24} />
        </div>
      </div>
    </div>
  );
}
