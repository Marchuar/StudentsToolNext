package com.example.StudentsTool.entity;

import java.util.ArrayList;

public class SaveSubjectsRequest {
    private ArrayList<String> mySubjects;
    private String token;
    private String role;


    public String getToken() {
        return this.token;
    }

    public ArrayList<String> getSubjects() {
        return this.mySubjects;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public void setMySubjects(ArrayList<String> mySubjects) {
        this.mySubjects = mySubjects;
    }

    public String getRole() {return this.role;}

    public void setRole(String role) { this.role = role; }
}