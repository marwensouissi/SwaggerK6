package org.example.k6backend.Repository;

import org.example.k6backend.Entities.Scenario;
import org.example.k6backend.Entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ScenarioRepository extends JpaRepository<Scenario, Long> {
    List<Scenario> findByUser(User user);
}
