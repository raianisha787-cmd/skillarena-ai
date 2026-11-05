"""
SkillArena AI - Engine Unit Test & Diagnostic Verification
"""

from engine import SkillGapAnalyzer, AdaptiveRoadmapGenerator

def run_tests():
    sample_scores = {
        "Data Structures & Algorithms": 85.0,
        "Java & Spring Boot Ecosystem": 62.0,
        "Relational Databases & SQL Optimization": 82.0,
        "Frontend Architecture & React.js": 50.0,
        "Cloud & DevOps (Docker/CI-CD)": 40.0,
        "AI/ML & Python Foundations": 55.0
    }

    analyzer = SkillGapAnalyzer(target_role="Full-Stack Software Engineer")
    eval_result = analyzer.evaluate(sample_scores)

    print("=== SKILLARENA AI DIAGNOSTIC REPORT ===")
    print(f"Target Role: {eval_result['target_role']}")
    print(f"Readiness Score: {eval_result['overall_readiness']}%")
    print(f"Campus Percentile: {eval_result['campus_percentile']}th percentile")
    print(f"Placement Clearance Prob: {eval_result['placement_probability_pct']}%")
    print(f"Identified Strengths: {eval_result['strengths']}")
    print(f"Critical Gaps: {eval_result['critical_gaps']}")

    assert eval_result["overall_readiness"] > 0
    assert eval_result["campus_percentile"] > 0
    assert "Cloud & DevOps (Docker/CI-CD)" in eval_result["critical_gaps"] or "Frontend Architecture & React.js" in eval_result["critical_gaps"]

    roadmap = AdaptiveRoadmapGenerator.generate_roadmap(eval_result)
    print("\n=== GENERATED 4-WEEK REMEDIAL ROADMAP ===")
    for milestone in roadmap:
        print(f"[{milestone['milestone_title']}] Target: {milestone['target_domain']} (Deficit: {milestone['skill_gap_deficit']})")
        print(f"  Action: {milestone['focus_objectives'][0]}")

    assert len(roadmap) == 4
    print("\n[PASSED] SkillArena AI analytical engine test successfully passed!")

if __name__ == "__main__":
    run_tests()
