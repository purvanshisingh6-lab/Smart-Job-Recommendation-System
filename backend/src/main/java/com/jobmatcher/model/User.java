package com.jobmatcher.model;
import jakarta.persistence.*;import java.util.*;
@Entity @Table(name="users") public class User {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(nullable=false) private String name;
 @Column(nullable=false,unique=true) private String email;
 @Column(nullable=false) private String passwordHash;
 private String qualification="B.Tech CSE"; private double experience;
 @ElementCollection(fetch=FetchType.EAGER) @CollectionTable(name="user_skills",joinColumns=@JoinColumn(name="user_id")) @Column(name="skill") private Set<String> skills=new LinkedHashSet<>();
 protected User(){} public User(String n,String e,String p,String q,double x){name=n;email=e.toLowerCase(Locale.ROOT);passwordHash=p;qualification=q;experience=x;}
 public Long getId(){return id;} public String getName(){return name;} public void setName(String v){name=v;} public String getEmail(){return email;} public void setEmail(String v){email=v.toLowerCase(Locale.ROOT);} public String getPasswordHash(){return passwordHash;} public void setPasswordHash(String v){passwordHash=v;} public String getQualification(){return qualification;} public void setQualification(String v){qualification=v;} public double getExperience(){return experience;} public void setExperience(double v){experience=v;} public Set<String> getSkills(){return skills;} public void setSkills(Set<String> v){skills=v==null?new LinkedHashSet<>():new LinkedHashSet<>(v);}
}
