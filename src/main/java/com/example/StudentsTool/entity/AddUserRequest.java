package com.example.StudentsTool.entity;

public class AddUserRequest {
    private User user;
    private String selectedRole;
    private StudentInfo studentInfo;

    public User getUser() {
        return this.user;
    }

    public String getSelectedRole() {
        return this.selectedRole;
    }

    public StudentInfo getStudentInfo() {
        return this.studentInfo;
    }
}
