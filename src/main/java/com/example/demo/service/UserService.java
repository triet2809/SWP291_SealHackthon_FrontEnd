package com.example.demo.service;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository){
        this.userRepository = userRepository;
    }

    public String login(String name, String password){

        User user = userRepository.findByName(name);

        if(user == null){
            return "User not found";
        }

        if(user.getPassword().equals(password)){
            return "Login success";
        }

        return "Wrong password";
    }
}