package com.skillarena.repository;

import com.skillarena.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Boolean existsByEmail(String email);
    List<User> findTop10ByOrderByCurrentReadinessScoreDesc();
    List<User> findByCampusId(Long campusId);
}

