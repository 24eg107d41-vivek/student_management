package com.studentmanagement.config;

import com.studentmanagement.model.Student;
import com.studentmanagement.repository.StudentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;

@Configuration
public class DataInitializer {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    @Bean
    CommandLineRunner initDatabase(StudentRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                log.info("No students found in database. Initializing sample student data...");
                repository.saveAll(Arrays.asList(
                        new Student("Aarav Sharma", "aarav.sharma@example.com", "9876543210", "Computer Science", 3),
                        new Student("Priya Patel", "priya.patel@example.com", "9876543211", "Information Technology", 2),
                        new Student("Rohan Verma", "rohan.verma@example.com", "9876543212", "Mechanical Engineering", 4),
                        new Student("Ananya Iyer", "ananya.iyer@example.com", "9876543213", "Computer Science", 1),
                        new Student("Vikram Singh", "vikram.singh@example.com", "9876543214", "Electronics & Comm", 3)
                ));
                log.info("Sample students successfully populated!");
            } else {
                log.info("Database already contains {} student records. Skipping seeding.", repository.count());
            }
        };
    }
}
