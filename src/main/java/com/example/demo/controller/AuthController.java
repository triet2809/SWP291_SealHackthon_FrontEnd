package com.example.demo.controller;

import com.example.demo.service.UserService;
import org.springframework.web.bind.annotation.*;

@RestController
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService){
        this.userService = userService;
    }

    @GetMapping("/login")
    public String login(
            @RequestParam String name,
            @RequestParam String password
    ){

        return userService.login(name, password);
    }
}