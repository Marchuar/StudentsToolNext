package com.example.StudentsTool.controllers;

import com.example.StudentsTool.entity.Student;
import com.example.StudentsTool.repositories.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api")
public class StudentController {

    @Autowired
    private StudentRepository studentRepository;

    @GetMapping("/get-all-students")
    public ResponseEntity<List<Student>> getAllStudents() {
        List<Student> students = studentRepository.findAll();
        return ResponseEntity.ok(students);
    }

}
