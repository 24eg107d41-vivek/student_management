import React, { useState, useEffect } from 'react';
import { UserPlus, Pencil, X, Check, Loader2, AlertCircle } from 'lucide-react';

export function StudentModal({ isOpen, onClose, onSave, studentToEdit, departments = [] }) {
  const isEditing = Boolean(studentToEdit);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    year: 1,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill form when studentToEdit changes
  useEffect(() => {
    if (studentToEdit) {
      setFormData({
        name: studentToEdit.name || '',
        email: studentToEdit.email || '',
        phone: studentToEdit.phone || '',
        department: studentToEdit.department || '',
        year: studentToEdit.year || 1,
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        department: '',
        year: 1,
      });
    }
    setErrors({});
  }, [studentToEdit, isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email address';
    }

    if (!formData.department.trim()) {
      newErrors.department = 'Department is required';
    }

    if (!formData.year || formData.year < 1 || formData.year > 5) {
      newErrors.year = 'Please select a valid academic year';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'year' ? parseInt(value, 10) || 1 : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSave({
        ...formData,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        department: formData.department.trim(),
        year: parseInt(formData.year, 10) || 1,
      });
      onClose();
    } catch (err) {
      // Error handled by parent or show inline
      setErrors((prev) => ({
        ...prev,
        submit: err.message || 'Failed to save student',
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className={`modal-header ${isEditing ? 'header-edit' : 'header-primary'}`}>
          <div className="modal-title">
            {isEditing ? <Pencil size={20} /> : <UserPlus size={20} />}
            <span>{isEditing ? `Update Student #${studentToEdit.id}` : 'Enroll New Student'}</span>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {errors.submit && (
              <div
                style={{
                  background: 'var(--danger-light)',
                  color: 'var(--danger)',
                  padding: '0.65rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.85rem',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <AlertCircle size={16} />
                <span>{errors.submit}</span>
              </div>
            )}

            {/* Name Input */}
            <div className="form-group">
              <label className="form-label" htmlFor="student-name">
                Full Name <span className="required-star">*</span>
              </label>
              <input
                id="student-name"
                name="name"
                type="text"
                className={`form-control ${errors.name ? 'has-error' : ''}`}
                placeholder="e.g. Rahul Sharma"
                value={formData.name}
                onChange={handleChange}
                autoFocus
              />
              {errors.name && (
                <div className="form-error-msg">
                  <AlertCircle size={13} />
                  <span>{errors.name}</span>
                </div>
              )}
            </div>

            {/* Email Input */}
            <div className="form-group">
              <label className="form-label" htmlFor="student-email">
                Email Address <span className="required-star">*</span>
              </label>
              <input
                id="student-email"
                name="email"
                type="email"
                className={`form-control ${errors.email ? 'has-error' : ''}`}
                placeholder="e.g. rahul.sharma@example.com"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <div className="form-error-msg">
                  <AlertCircle size={13} />
                  <span>{errors.email}</span>
                </div>
              )}
            </div>

            {/* Phone Input */}
            <div className="form-group">
              <label className="form-label" htmlFor="student-phone">
                Phone Number
              </label>
              <input
                id="student-phone"
                name="phone"
                type="tel"
                className="form-control"
                placeholder="e.g. 9876543210"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            {/* Department & Year Row */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="student-dept">
                  Department <span className="required-star">*</span>
                </label>
                <input
                  id="student-dept"
                  name="department"
                  type="text"
                  list="department-suggestions"
                  className={`form-control ${errors.department ? 'has-error' : ''}`}
                  placeholder="e.g. Computer Science"
                  value={formData.department}
                  onChange={handleChange}
                />
                <datalist id="department-suggestions">
                  <option value="Computer Science" />
                  <option value="Information Technology" />
                  <option value="Mechanical Engineering" />
                  <option value="Electronics & Comm" />
                  <option value="Civil Engineering" />
                  {departments.map((d) => (
                    <option key={d} value={d} />
                  ))}
                </datalist>
                {errors.department && (
                  <div className="form-error-msg">
                    <AlertCircle size={13} />
                    <span>{errors.department}</span>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="student-year">
                  Year of Study <span className="required-star">*</span>
                </label>
                <select
                  id="student-year"
                  name="year"
                  className="form-control select-input"
                  value={formData.year}
                  onChange={handleChange}
                >
                  <option value={1}>Year 1 (Freshman)</option>
                  <option value={2}>Year 2 (Sophomore)</option>
                  <option value={3}>Year 3 (Junior)</option>
                  <option value={4}>Year 4 (Senior)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="spin-animation" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check size={16} />
                  <span>{isEditing ? 'Update Student' : 'Enroll Student'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
