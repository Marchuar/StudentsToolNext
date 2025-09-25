package com.example.StudentsTool.controllers;

import com.example.StudentsTool.entity.*;
import com.example.StudentsTool.repositories.StudentRepository;
import com.example.StudentsTool.repositories.UserRepository;
import com.example.StudentsTool.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@CrossOrigin
@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;

    // Constructor injection ensures studentRepository is never null
    public UserController(StudentRepository studentRepository, PasswordEncoder passwordEncoder) {
        this.studentRepository = studentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/add-user")
    public ResponseEntity<Object> Register(@RequestBody AddUserRequest request) {

        final User user = request.getUser();
        final String role = request.getSelectedRole();

        user.setPassword(passwordEncoder.encode(user.getPassword()));


        //check all data
        if (user.getPassword() == null ||
                user.getUsername() == null ||
                user.getEmail() == null){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Missing DATA!");
        }

        // check if email already exists
        if(role.equals("Student")) {
            System.out.println(role);
            if (studentRepository.findByEmail(user.getEmail()).isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Student already exists!");
            }
        } else if(role.equals("Teacher")) {
            System.out.println(role);
            if (userRepository.findByEmail(user.getEmail()).isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("User already exists!");
            }
        }


        user.setSubjects(new ArrayList<String>());

        ArrayList<String> subjects = user.getSubjects();
        System.out.println(subjects);

        if(role.equals("Teacher")) {
            user.setStudents(new ArrayList<String>());
            ArrayList<String> students = user.getStudents();
            System.out.println(students);

            // save user (teacher)
            userRepository.save(user);
        } else if(role.equals("Student")) {
            System.out.println(request.getStudentInfo().getName() + " " + request.getStudentInfo().getAge());

            final Student student = new Student();

            //Login Data
            student.setUsername(user.getUsername());
            student.setEmail(user.getEmail());
            student.setPassword(user.getPassword());
            student.setSubjects(new ArrayList<String>());

            //Student Info
            student.setName(request.getStudentInfo().getName());
            student.setAge(request.getStudentInfo().getAge());

            //save student
            studentRepository.save(student);
        }

        //JWT Token Generation
        String token = JwtUtil.generateToken(user.getEmail(), role);

        //Response Generation
        Map<String, Object> response = new HashMap<>();
        response.put("username", user.getUsername());
        response.put("token", token);


        //test
        System.out.println(user.getUsername());
        System.out.println(user.getEmail());
        System.out.println(user.getPassword());


        return ResponseEntity.ok(response);
    }

    @PostMapping("/login-user")
    public ResponseEntity<Object> Login(@RequestBody User user) {
        //role init
        String role;

        //check data
        if (user.getEmail() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email is required!");
        }
        if (user.getPassword() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Password is required!");
        }

        //check Teacher
        Optional<User> dbUser = userRepository.findByEmail(user.getEmail());
        if (dbUser.isEmpty() || !passwordEncoder.matches(user.getPassword(), dbUser.get().getPassword())) {
            //check Student
            Optional<Student> dbStudent = studentRepository.findByEmail(user.getEmail());
            if (dbStudent.isEmpty() || !passwordEncoder.matches(user.getPassword(), dbStudent.get().getPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials!");
            } else {
                role = "Student";
            }
        } else {
            role = "Teacher";
        }

        //JWT Token Generation
        String token = JwtUtil.generateToken(user.getEmail(), role);

        //Response Generation
        Map<String, Object> response = new HashMap<>();
        response.put("email", user.getEmail());
        response.put("token", token);

        //test
        System.out.println(user.getEmail());
        System.out.println(user.getPassword());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/add-student")
    public ResponseEntity<ArrayList<String>> addStudent(@RequestBody StudentRequest request) {

        String email = JwtUtil.extractEmail(request.getToken());
        User user = new User();

        System.out.println("Email: " + email);

        Optional<User> response = userRepository.findByEmail(email);

        if(response.isPresent()){
            user = response.get();
        }

        user.getStudents().add(request.getStudentID());

        //save in Data Base
        userRepository.save(user);

        return ResponseEntity.ok().body(user.getStudents());
    }

    @PostMapping("/delete-student")
    public ResponseEntity<ArrayList<String>> deleteStudent(@RequestBody StudentRequest request) {

        String email = JwtUtil.extractEmail(request.getToken());
        User user = new User();

        System.out.println("Email: " + email);

        Optional<User> response = userRepository.findByEmail(email);

        if(response.isPresent()){
            user = response.get();
        }

        user.getStudents().remove(request.getStudentID());

        //save in Data Base
        userRepository.save(user);

        return ResponseEntity.ok().body(user.getStudents());
    }

    @PostMapping("/get-my-students")
    public ResponseEntity<ArrayList<String>> getMyStudents(@RequestBody String token) {
        String email = JwtUtil.extractEmail(token);
        User user = new User();

        System.out.println("Email: " + email);

        Optional<User> response = userRepository.findByEmail(email);

        if(response.isPresent()){
            user = response.get();
        }

        return ResponseEntity.ok().body(user.getStudents());
    }

    @PostMapping("/get-my-subjects")
    public ResponseEntity<ArrayList<String>> getMyStudent(@RequestBody GetSubjectsRequest request) {
        final String token = request.getToken();
        final String role = request.getRole();

        String email = JwtUtil.extractEmail(token);
        System.out.println("Email: " + email);

        if(role.equals("Teacher")) {
            User user = new User();

            Optional<User> response = userRepository.findByEmail(email);

            if(response.isPresent()){
                user = response.get();
            }

            return ResponseEntity.ok().body(user.getSubjects());
        } else if(role.equals("Student")) {
            Student student = new Student();

            Optional<Student> response = studentRepository.findByEmail(email);

            if(response.isPresent()){
                student = response.get();
            }

            return ResponseEntity.ok().body(student.getSubjects());
        }

        return ResponseEntity.status(HttpStatus.CONFLICT).body(new ArrayList<String>());
    }


    @PostMapping("/save-subjects")
    public ResponseEntity<ArrayList<String>> saveSubjects(@RequestBody SaveSubjectsRequest request) {
        final String role = request.getRole();

        String email = JwtUtil.extractEmail(request.getToken());
        System.out.println("Email: " + email);
        System.out.println("Subjects: " + request.getSubjects());


        if(role.equals("Teacher")) {
            User user = new User();

            Optional<User> response = userRepository.findByEmail(email);

            if(response.isPresent()){
                user = response.get();
            }

            user.setSubjects(request.getSubjects());

            //save in DB
            userRepository.save(user);

            return ResponseEntity.ok().body(user.getSubjects());
        } else if(role.equals("Student")) {
            Student student = new Student();

            Optional<Student> response = studentRepository.findByEmail(email);

            if(response.isPresent()){
                student = response.get();
            }

            student.setSubjects(request.getSubjects());

            //save in DB
            studentRepository.save(student);

            return ResponseEntity.ok().body(student.getSubjects());
        }

        return ResponseEntity.status(HttpStatus.CONFLICT).body(new ArrayList<String>());
    }

}
