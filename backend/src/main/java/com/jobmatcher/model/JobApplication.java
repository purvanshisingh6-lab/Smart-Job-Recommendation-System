package com.jobmatcher.model;
import jakarta.persistence.*;import java.time.Instant;
@Entity @Table(name="job_applications",uniqueConstraints=@UniqueConstraint(columnNames={"user_id","job_id"})) public class JobApplication {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id; @Column(name="user_id",nullable=false) private Long userId; @Column(name="job_id",nullable=false) private Long jobId; private String jobTitle; private String company; private String status="SUBMITTED"; private Instant appliedAt=Instant.now(); protected JobApplication(){} public JobApplication(Long u,Long j,String t,String c){userId=u;jobId=j;jobTitle=t;company=c;} public Long getId(){return id;} public Long getUserId(){return userId;} public Long getJobId(){return jobId;} public String getJobTitle(){return jobTitle;} public String getCompany(){return company;} public String getStatus(){return status;} public void setStatus(String s){status=s;} public Instant getAppliedAt(){return appliedAt;}
}
