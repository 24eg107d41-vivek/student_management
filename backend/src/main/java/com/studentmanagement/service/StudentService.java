package com.studentmanagement.service;

import com.studentmanagement.model.Student;

import java.util.List;
import java.util.Map;

public interface StudentService {

    List<Student> getAllStudents();

    Student getStudentById(Long id);

    Student saveStudent(Student student);

    Student updateStudent(Long id, Student student);

    void deleteStudent(Long id);

    List<Student> searchStudents(String keyword);

    long getTotalStudentCount();

    Map<String, Long> getDepartmentStats();
}
