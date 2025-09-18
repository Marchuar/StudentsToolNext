package com.example.StudentsTool.entity;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "users")
public class User {
    @Id
    private String id;

    private String username;
    private String email;
    private String password;
    private ArrayList<String> subjects;
    private ArrayList<String> students;

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public ArrayList<String> getSubjects() {
        return subjects;
    }

    public ArrayList<String> getStudents() {
        return students;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setEmail(String email) {
        this.email = email;
    }
    public void setPassword(String password) {
        this.password = password;
    }

    public void setSubjects(ArrayList<String> subjects) {
        this.subjects = subjects;
    }

    public void setStudents(ArrayList<String> students) {
        this.students = students;
    }
}
