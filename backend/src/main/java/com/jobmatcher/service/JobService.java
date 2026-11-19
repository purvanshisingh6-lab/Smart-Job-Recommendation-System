package com.jobmatcher.service;
import org.springframework.stereotype.Service;import java.util.*;
@Service public class JobService {
 public record Job(long id,String title,String company,String location,double exp,String expLabel,String qualification,String salary,String description,List<String> skills){}
 public record Match(Job job,int score,List<String> matched,List<String> missing,String explanation){}
 private final List<Job> jobs=List.of(
 new Job(101,"QA Engineer","HCLTech","Noida",0,"Fresher","B.Tech CSE","3.5 - 5 LPA","Design and run test plans, automate regression suites and report defects.",List.of("selenium","java","testing","manual testing","jira")),
 new Job(102,"Backend Developer","Infosys","Bengaluru",1,"1+ yr","B.Tech CSE","6 - 9 LPA","Build REST services with Spring Boot, MySQL and Git.",List.of("java","spring boot","mysql","rest api","git","docker")),
 new Job(103,"Data Scientist","TCS","Pune",2,"2+ yrs","M.Tech","8 - 12 LPA","Clean datasets, train machine learning models and present findings.",List.of("python","sql","machine learning","pandas","statistics")),
 new Job(104,"Full Stack Developer","Zoho","Chennai",2,"2+ yrs","B.Tech IT","7 - 11 LPA","Build user interfaces and backend services.",List.of("javascript","react","node.js","mongodb","html","css","git")),
 new Job(105,"Android Developer","Paytm","Noida",1,"1+ yr","B.Tech CSE","6 - 10 LPA","Develop Android app features using Kotlin and Java.",List.of("kotlin","java","android","rest api","git")),
 new Job(106,"Frontend Developer","Flipkart","Bengaluru",1,"1+ yr","BCA","6 - 10 LPA","Build accessible storefront pages with React and CSS.",List.of("html","css","javascript","react","git")),
 new Job(107,"DevOps Engineer","CloudNine","Hyderabad",2,"2+ yrs","B.Tech CSE","8 - 13 LPA","Automate deployment pipelines and cloud infrastructure.",List.of("docker","kubernetes","linux","jenkins","aws","git")),
 new Job(108,"UI/UX Designer","DesignHub","Gurugram",0,"Fresher","B.Sc","4 - 6 LPA","Research user needs and create wireframes and prototypes.",List.of("figma","wireframing","user research","html","css")));
 public List<Job> all(){return jobs;} public List<Match> match(List<String> input){Set<String> have=new HashSet<>();if(input!=null)input.forEach(s->{String n=norm(s);if(n.equals("html/css")){have.add("html");have.add("css");}else have.add(n);});return jobs.stream().map(j->{List<String> yes=j.skills.stream().filter(have::contains).toList();List<String> no=j.skills.stream().filter(s->!have.contains(s)).toList();int pct=(int)Math.round(100.0*yes.size()/j.skills.size());return new Match(j,pct,yes,no,"Matched "+yes.size()+" of "+j.skills.size()+" required skills.");}).filter(m->!m.matched.isEmpty()).sorted(Comparator.comparingInt(Match::score).reversed().thenComparing(m->-m.matched().size())).toList();}
 private String norm(String s){return s==null?"":s.trim().toLowerCase(Locale.ROOT);}
}
