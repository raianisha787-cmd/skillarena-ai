"""
SkillArena AI - Intelligent Skill Gap Assessment & Personalized Learning Engine
Implements:
1. Target Role Benchmark Mapping
2. Urgency Classification & Skill Gap Scoring
3. Gaussian Percentile Calculation against Campus Cohorts
4. AI-driven Dynamic Multi-Week Learning Roadmap Synthesis
"""

import math
from typing import Dict, List, Any, Optional

# Benchmark profiles for standard college campus recruitment profiles
ROLE_BENCHMARKS: Dict[str, Dict[str, float]] = {
    "Full-Stack Software Engineer": {
        "Data Structures & Algorithms": 80.0,
        "Java & Spring Boot Ecosystem": 85.0,
        "Relational Databases & SQL Optimization": 80.0,
        "Frontend Architecture & React.js": 75.0,
        "Cloud & DevOps (Docker/CI-CD)": 70.0,
        "AI/ML & Python Foundations": 50.0
    },
    "AI/ML & Data Engineer": {
        "Data Structures & Algorithms": 85.0,
        "AI/ML & Python Foundations": 90.0,
        "Relational Databases & SQL Optimization": 80.0,
        "Java & Spring Boot Ecosystem": 55.0,
        "Frontend Architecture & React.js": 45.0,
        "Cloud & DevOps (Docker/CI-CD)": 70.0
    },
    "Cloud & DevOps Engineer": {
        "Cloud & DevOps (Docker/CI-CD)": 90.0,
        "Java & Spring Boot Ecosystem": 75.0,
        "Relational Databases & SQL Optimization": 75.0,
        "Data Structures & Algorithms": 70.0,
        "Frontend Architecture & React.js": 40.0,
        "AI/ML & Python Foundations": 50.0
    }
}

DEFAULT_BENCHMARK = {
    "Data Structures & Algorithms": 75.0,
    "Java & Spring Boot Ecosystem": 75.0,
    "Relational Databases & SQL Optimization": 70.0,
    "Frontend Architecture & React.js": 70.0,
    "Cloud & DevOps (Docker/CI-CD)": 65.0,
    "AI/ML & Python Foundations": 60.0
}

# Campus cohort historical mean & std-dev for percentile normalization
COHORT_STATS = {
    "mean": 62.4,
    "std_dev": 14.8
}

def normal_cdf(x: float, mean: float, std: float) -> float:
    """Computes Gaussian cumulative distribution function for campus percentile."""
    if std <= 0:
        return 50.0
    z = (x - mean) / (std * math.sqrt(2.0))
    return 0.5 * (1.0 + math.erf(z))

class SkillGapAnalyzer:
    """Intelligent Skill Gap Diagnoser for campus placement readiness."""

    def __init__(self, target_role: str = "Full-Stack Software Engineer"):
        self.target_role = target_role
        self.benchmark = ROLE_BENCHMARKS.get(target_role, DEFAULT_BENCHMARK)

    def evaluate(self, student_scores: Dict[str, float]) -> Dict[str, Any]:
        """
        Analyzes student scores against target role benchmarks.
        Returns:
            - overall_readiness: Weighted percentage readiness index (0-100)
            - campus_percentile: Student rank percentile within university cohort
            - domain_gaps: Detailed breakdown per skill area
            - critical_gaps: Skills requiring immediate intervention
            - strengths: Areas where student meets or exceeds benchmark
        """
        domain_gaps = []
        critical_gaps = []
        strengths = []
        
        total_weighted_score = 0.0
        total_benchmark_target = 0.0

        for domain, target in self.benchmark.items():
            curr_score = student_scores.get(domain, 45.0)  # default prior if not yet tested
            gap = round(target - curr_score, 2)
            
            # Urgency level classification
            if gap > 20.0:
                urgency = "CRITICAL"
                critical_gaps.append(domain)
            elif gap > 8.0:
                urgency = "MODERATE"
            else:
                urgency = "LOW"
                if curr_score >= target * 0.95:
                    strengths.append(domain)

            domain_gaps.append({
                "domain": domain,
                "current_score": curr_score,
                "benchmark_target": target,
                "gap": gap,
                "urgency": urgency,
                "proficiency_level": self._proficiency_label(curr_score)
            })

            total_weighted_score += curr_score
            total_benchmark_target += target

        # Overall readiness percentage
        overall_readiness = round((total_weighted_score / total_benchmark_target) * 100.0, 1)
        overall_readiness = min(100.0, max(0.0, overall_readiness))

        # Campus percentile (Gaussian model)
        student_avg = total_weighted_score / len(self.benchmark)
        percentile = round(normal_cdf(student_avg, COHORT_STATS["mean"], COHORT_STATS["std_dev"]) * 100.0, 1)

        # Placement Probability Prediction (Logistic regression estimation)
        placement_prob = self._predict_placement_probability(overall_readiness, percentile)

        return {
            "target_role": self.target_role,
            "overall_readiness": overall_readiness,
            "campus_percentile": percentile,
            "placement_probability_pct": placement_prob,
            "strengths": strengths,
            "critical_gaps": critical_gaps,
            "domain_breakdown": domain_gaps
        }

    def _proficiency_label(self, score: float) -> str:
        if score >= 85:
            return "Mastery / Industry-Ready"
        elif score >= 70:
            return "Competent / Interview-Ready"
        elif score >= 50:
            return "Developing / Needs Revision"
        else:
            return "Novice / Critical Intervention"

    def _predict_placement_probability(self, readiness: float, percentile: float) -> float:
        """Calculates placement interview clearance probability."""
        score_component = (readiness - 65.0) * 0.08
        percentile_component = (percentile - 50.0) * 0.04
        logit = 0.5 + score_component + percentile_component
        prob = 1.0 / (1.0 + math.exp(-logit))
        return round(prob * 100.0, 1)

class AdaptiveRoadmapGenerator:
    """Synthesizes structured, milestone-driven personalized curriculum based on diagnostics."""

    CURATED_RESOURCES = {
        "Data Structures & Algorithms": [
            {"title": "NeetCode 150 Core Patterns", "type": "Interactive Problem Set", "url": "https://neetcode.io/practice"},
            {"title": "MIT 6.006: Introduction to Algorithms", "type": "Lecture Series", "url": "https://ocw.mit.edu/courses/6-006"}
        ],
        "Java & Spring Boot Ecosystem": [
            {"title": "Spring Boot 3 Enterprise Microservices Guide", "type": "Hands-on Workshop", "url": "https://spring.io/guides"},
            {"title": "Baeldung Spring Security & JWT Architecture", "type": "In-depth Tutorial", "url": "https://www.baeldung.com/spring-security-jwt"}
        ],
        "Relational Databases & SQL Optimization": [
            {"title": "Use The Index, Luke! SQL Performance Guide", "type": "Interactive Guide", "url": "https://use-the-index-luke.com/"},
            {"title": "High Performance MySQL Index Tuning", "type": "Case Study", "url": "https://dev.mysql.com/doc/refman/8.0/en/optimization.html"}
        ],
        "Frontend Architecture & React.js": [
            {"title": "React.dev Modern State & Hook Patterns", "type": "Documentation & Sandboxes", "url": "https://react.dev/learn"},
            {"title": "Full-Stack React + Spring Boot Integration Blueprint", "type": "Architecture Guide", "url": "https://spring.io/guides/tutorials/react-and-spring-data-rest"}
        ],
        "Cloud & DevOps (Docker/CI-CD)": [
            {"title": "Docker Multi-stage Builds for Java & React", "type": "Hands-on Lab", "url": "https://docs.docker.com/build/building/multi-stage/"},
            {"title": "GitHub Actions CI/CD Pipeline from Scratch", "type": "Practical Project", "url": "https://docs.github.com/en/actions"}
        ],
        "AI/ML & Python Foundations": [
            {"title": "FastAPI Production Microservices Architecture", "type": "Tutorial", "url": "https://fastapi.tiangolo.com/tutorial/"},
            {"title": "Scikit-Learn Machine Learning Pipeline Mastery", "type": "Interactive Lab", "url": "https://scikit-learn.org/stable/tutorial"}
        ]
    }

    @classmethod
    def generate_roadmap(cls, evaluation: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Generates a 4-week high-impact recovery roadmap prioritizing critical and moderate gaps."""
        domain_breakdown = evaluation.get("domain_breakdown", [])
        
        # Sort domains by largest gap first
        sorted_domains = sorted(domain_breakdown, key=lambda d: d["gap"], reverse=True)
        
        roadmap = []
        week = 1
        
        for item in sorted_domains[:4]:
            domain = item["domain"]
            gap = item["gap"]
            resources = cls.CURATED_RESOURCES.get(domain, [])
            
            milestone = {
                "week": week,
                "target_domain": domain,
                "skill_gap_deficit": f"-{gap} pts",
                "milestone_title": f"Week {week}: Mastering {domain}",
                "focus_objectives": [
                    f"Bridge detected {item['urgency'].lower()} proficiency gap in {domain}",
                    f"Solve 10 targeted domain problems and implement mini-project",
                    "Take simulated SkillArena Arena re-assessment"
                ],
                "recommended_resources": resources,
                "project_deliverable": f"Implement a verified working module demonstrating proficiency in {domain}",
                "estimated_hours": 8 if item["urgency"] == "CRITICAL" else 5,
                "status": "NEXT_UP" if week == 1 else "UPCOMING"
            }
            roadmap.append(milestone)
            week += 1
            
        return roadmap
