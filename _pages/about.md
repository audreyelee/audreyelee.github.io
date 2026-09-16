---
permalink: /
title: "About Me"
author_profile: true
redirect_from: 
  - /about/
  - /about.html
---

I'm a first-year PhD student in Robotics at Carnegie Mellon University, advised by Professor Henny Admoni in the HARP Lab. My research interests lie at the intersection of human-robot interaction and robot learning, with a focus on how humans and robots can co-adapt, or become both better teachers and better learners through interacting with each other. 

Previously, I received my M.Eng. and B.S. in Electrical Engineering and Computer Science from MIT, where I was advised by Professor Andreea Bobu. Throughout my undergrad, I also worked with Professor Cynthia Breazeal, among other labs at MIT. I have also completed software engineering internships at Amazon Robotics, Apple CoreOS, and Raytheon.

{% assign cv_page = site.pages | where: "permalink", "/cv/" | first %}
{% assign cv_filename = cv_page.cv_file | remove: "cv_" | remove: ".pdf" %}
{% assign cv_date = cv_filename | replace: "_", "/" %}

To see more details, please check my <a href="/cv/">CV (last updated {{ cv_date }})</a>.

## News
{% include news.html %}