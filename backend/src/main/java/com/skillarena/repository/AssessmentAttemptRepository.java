package com.skillarena.repository;

import com.skillarena.model.AssessmentAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AssessmentAttemptRepository extends JpaRepository<AssessmentAttempt, Long> {
    List<AssessmentAttempt> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<AssessmentAttempt> findByAssessmentId(Long assessmentId);
}

