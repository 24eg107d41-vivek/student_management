package com.studentmanagement.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class StudentWebController {

    /**
     * Forwards root and SPA routes to the React Single Page Application (index.html).
     */
    @GetMapping(value = {"/", "/students", "/students/**", "/dashboard"})
    public String forwardToReact() {
        return "forward:/index.html";
    }
}
