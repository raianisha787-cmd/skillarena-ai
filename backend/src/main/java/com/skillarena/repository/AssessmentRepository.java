package com.skillarena.repository;

import com.skillarena.model.Assessment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AssessmentRepository extends JpaRepository<Assessment, Long> {
    List<Assessment> findByIsActiveTrue();
    List<Assessment> findByDomainId(Long domainId);
}

