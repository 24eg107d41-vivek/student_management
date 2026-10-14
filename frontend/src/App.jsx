import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { studentApi } from './services/studentApi';
import { Navbar } from './components/Navbar';
import { StatCards } from './components/StatCards';
import { StudentTable } from './components/StudentTable';
import { StudentModal } from './components/StudentModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { ToastContainer } from './components/ToastContainer';
import { exportToCSV } from './utils/helpers';

export default function App() {
  // Application Data State
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [serverStatus, setServerStatus] = useState('connecting'); // 'online' | 'connecting' | 'offline'

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');

  // Modals State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState(null);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Toast Notification State
  const [toasts, setToasts] = useState([]);

  // Theme State (Dark / Light)
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('student_mgmt_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Apply Theme Attribute
  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('student_mgmt_theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('student_mgmt_theme', 'light');
    }
  }, [darkMode]);

  // Toast Helper
  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto dismiss after 3.5s
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch Students from Spring Boot API
  const fetchStudents = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const data = await studentApi.getAll();
      setStudents(data);
      setServerStatus('online');
      if (isRefresh) {
        addToast('Student data refreshed', 'info');
      }
    } catch (err) {
      console.error('Failed to load students:', err);
      setServerStatus('offline');
      addToast(
        'Unable to connect to Spring Boot backend. Please verify server is running on port 8080.',
        'danger'
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [addToast]);

  // Initial Data Load
  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // Unique Departments List
  const departments = useMemo(() => {
    const set = new Set(
      students
        .map((s) => s.department && s.department.trim())
        .filter(Boolean)
    );
    return Array.from(set).sort();
  }, [students]);

  // Filtered Students (Search Query & Department Filter)
  const filteredStudents = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    const dept = selectedDepartment.toLowerCase().trim();

    return students.filter((s) => {
      const matchQuery =
        !query ||
        (s.name && s.name.toLowerCase().includes(query)) ||
        (s.email && s.email.toLowerCase().includes(query)) ||
        (s.department && s.department.toLowerCase().includes(query)) ||
        (s.phone && s.phone.includes(query)) ||
        (s.year && String(s.year).includes(query)) ||
        (s.id && String(s.id).includes(query));

      const matchDept =
        !dept || (s.department && s.department.toLowerCase() === dept);

      return matchQuery && matchDept;
    });
  }, [students, searchQuery, selectedDepartment]);

  // Handlers for Add / Edit
  const handleOpenAddModal = () => {
    setStudentToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (student) => {
    setStudentToEdit(student);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setStudentToEdit(null);
  };

  const handleSaveStudent = async (studentData) => {
    try {
      if (studentToEdit) {
        await studentApi.update(studentToEdit.id, studentData);
        addToast('Student updated successfully!', 'success');
      } else {
        await studentApi.create(studentData);
        addToast('Student enrolled successfully!', 'success');
      }
      await fetchStudents();
    } catch (err) {
      console.error('Error saving student:', err);
      addToast(`Error saving student: ${err.message}`, 'danger');
      throw err;
    }
  };

  // Handlers for Delete
  const handleOpenDeleteModal = (student) => {
    setStudentToDelete(student);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setStudentToDelete(null);
  };

  const handleConfirmDelete = async (id) => {
    try {
      await studentApi.delete(id);
      addToast('Student deleted successfully!', 'success');
      await fetchStudents();
    } catch (err) {
      console.error('Error deleting student:', err);
      addToast(`Error deleting student: ${err.message}`, 'danger');
      throw err;
    }
  };

  // CSV Export Handler
  const handleExportCSV = () => {
    const success = exportToCSV(
      filteredStudents,
      `students_${new Date().toISOString().slice(0, 10)}.csv`
    );
    if (success) {
      addToast('CSV export downloaded successfully', 'success');
    } else {
      addToast('No student records available to export', 'warning');
    }
  };

  return (
    <>
      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Top Navbar */}
      <Navbar
        serverStatus={serverStatus}
        onRefresh={() => fetchStudents(true)}
        isRefreshing={isRefreshing}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* Main Content Area */}
      <main className="app-container">
        {/* Metric Overview Cards */}
        <StatCards students={students} serverStatus={serverStatus} />

        {/* Student Roster Table Panel */}
        <StudentTable
          students={filteredStudents}
          isLoading={isLoading}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedDepartment={selectedDepartment}
          onDepartmentChange={setSelectedDepartment}
          departments={departments}
          onOpenAddModal={handleOpenAddModal}
          onOpenEditModal={handleOpenEditModal}
          onOpenDeleteModal={handleOpenDeleteModal}
          onExportCSV={handleExportCSV}
          totalCount={students.length}
        />
      </main>

      {/* Add / Edit Student Modal */}
      <StudentModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveStudent}
        studentToEdit={studentToEdit}
        departments={departments}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        student={studentToDelete}
      />
    </>
  );
}
