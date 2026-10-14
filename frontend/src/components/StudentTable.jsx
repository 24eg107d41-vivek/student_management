import React, { useState } from 'react';
import {
  Search,
  X,
  Download,
  UserPlus,
  Pencil,
  Trash2,
  Mail,
  Phone,
  Calendar,
  FolderOpen,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { getAvatarColor, getInitials, getDeptClass } from '../utils/helpers';

export function StudentTable({
  students = [],
  isLoading = false,
  searchQuery = '',
  onSearchChange = () => {},
  selectedDepartment = '',
  onDepartmentChange = () => {},
  departments = [],
  onOpenAddModal = () => {},
  onOpenEditModal = () => {},
  onOpenDeleteModal = () => {},
  onExportCSV = () => {},
  totalCount = 0,
}) {
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' or 'desc'

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Sort students
  const sortedStudents = [...students].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (typeof aVal === 'string') aVal = aVal.toLowerCase();
    if (typeof bVal === 'string') bVal = bVal.toLowerCase();

    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const renderSortIcon = (field) => {
    if (sortField !== field) {
      return <ArrowUpDown size={13} style={{ opacity: 0.4, marginLeft: '4px' }} />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp size={13} style={{ color: 'var(--primary)', marginLeft: '4px' }} />
    ) : (
      <ArrowDown size={13} style={{ color: 'var(--primary)', marginLeft: '4px' }} />
    );
  };

  return (
    <div className="panel-card">
      {/* Panel Header & Controls */}
      <div className="panel-header">
        <div className="panel-title-area">
          <h2>Student Roster</h2>
          <p>Manage and browse registered students in the system</p>
        </div>

        <div className="panel-controls">
          {/* Search Box */}
          <div className="search-input-wrapper">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search by name, email, dept..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => onSearchChange('')}
                title="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Department Filter */}
          <select
            className="select-input"
            value={selectedDepartment}
            onChange={(e) => onDepartmentChange(e.target.value)}
            title="Filter by department"
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>

          {/* Export CSV Button */}
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={onExportCSV}
            title="Download CSV file of displayed students"
          >
            <Download size={15} />
            <span>Export CSV</span>
          </button>

          {/* Add Student Button */}
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={onOpenAddModal}
            title="Enroll a new student"
          >
            <UserPlus size={15} />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* Student Table */}
      <div className="table-responsive">
        <table className="student-table">
          <thead>
            <tr>
              <th
                className="sortable"
                style={{ width: '80px' }}
                onClick={() => handleSort('id')}
              >
                ID {renderSortIcon('id')}
              </th>
              <th className="sortable" onClick={() => handleSort('name')}>
                Student Name {renderSortIcon('name')}
              </th>
              <th>Contact Info</th>
              <th className="sortable" onClick={() => handleSort('department')}>
                Department {renderSortIcon('department')}
              </th>
              <th
                className="sortable"
                style={{ width: '150px' }}
                onClick={() => handleSort('year')}
              >
                Year {renderSortIcon('year')}
              </th>
              <th style={{ width: '110px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              // Loading Skeleton Rows
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={idx} className="skeleton-row">
                  <td>
                    <div className="skeleton-box" style={{ width: '40px' }}></div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div className="skeleton-box" style={{ width: '36px', height: '36px', borderRadius: '50%' }}></div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                        <div className="skeleton-box" style={{ width: '130px' }}></div>
                        <div className="skeleton-box" style={{ width: '80px', height: '14px' }}></div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div className="skeleton-box" style={{ width: '160px' }}></div>
                      <div className="skeleton-box" style={{ width: '110px', height: '14px' }}></div>
                    </div>
                  </td>
                  <td>
                    <div className="skeleton-box" style={{ width: '120px', borderRadius: '9999px' }}></div>
                  </td>
                  <td>
                    <div className="skeleton-box" style={{ width: '80px' }}></div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="skeleton-box" style={{ width: '60px', marginLeft: 'auto' }}></div>
                  </td>
                </tr>
              ))
            ) : sortedStudents.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: 0 }}>
                  <div className="empty-state">
                    <div className="empty-state-icon">
                      <FolderOpen size={32} />
                    </div>
                    <h3>No Students Found</h3>
                    <p>
                      {searchQuery || selectedDepartment
                        ? 'No student matches your current filters. Try refining or clearing your search.'
                        : 'No student records exist in the database yet. Click below to add the first student!'}
                    </p>
                    <button type="button" className="btn btn-primary btn-sm" onClick={onOpenAddModal}>
                      <UserPlus size={15} />
                      <span>Add New Student</span>
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              sortedStudents.map((student) => {
                const avatarColor = getAvatarColor(student.name || String(student.id));
                const initials = getInitials(student.name);
                const deptClass = getDeptClass(student.department);

                return (
                  <tr key={student.id}>
                    <td>
                      <span className="badge-id">#{student.id}</span>
                    </td>
                    <td>
                      <div className="student-identity">
                        <div className="avatar-circle" style={{ background: avatarColor }}>
                          {initials}
                        </div>
                        <div className="student-name-box">
                          <div className="name">{student.name}</div>
                          <div className="roll-id">Roll #{student.id}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="contact-cell">
                        <a href={`mailto:${student.email}`} className="contact-link" title={`Email ${student.name}`}>
                          <Mail size={14} style={{ color: 'var(--text-muted)' }} />
                          <span>{student.email}</span>
                        </a>
                        {student.phone && (
                          <a href={`tel:${student.phone}`} className="contact-link sub" title={`Call ${student.name}`}>
                            <Phone size={13} style={{ color: 'var(--text-light)' }} />
                            <span>{student.phone}</span>
                          </a>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className={`dept-pill ${deptClass}`}>
                        {student.department || 'General'}
                      </span>
                    </td>
                    <td>
                      <span className="year-badge">
                        <Calendar size={13} />
                        <span>Year {student.year || 1}</span>
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="action-buttons">
                        <button
                          type="button"
                          className="btn-action-edit"
                          onClick={() => onOpenEditModal(student)}
                          title="Edit Student"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          type="button"
                          className="btn-action-delete"
                          onClick={() => onOpenDeleteModal(student)}
                          title="Delete Student"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Panel Footer */}
      <div className="panel-footer">
        <span>
          Showing <strong>{sortedStudents.length}</strong> of <strong>{totalCount}</strong> students
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>REST API:</span>
          <span className="api-badge">GET /api/students</span>
        </div>
      </div>
    </div>
  );
}
