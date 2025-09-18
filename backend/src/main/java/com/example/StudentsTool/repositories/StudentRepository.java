package com.example.StudentsTool.repositories;

import com.example.StudentsTool.entity.Student;
import com.example.StudentsTool.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;


public interface StudentRepository extends MongoRepository<Student, String> {
    Optional<Student> findByEmail(String email);
}
