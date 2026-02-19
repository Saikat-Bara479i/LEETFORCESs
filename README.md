#  LeetForces — Online Coding Judge0 Backend

This project is a backend system for an online coding platform similar to LeetCode / Codeforces.  
It allows users to solve coding problems, run code with multiple test cases, and store submission results.

I built this project to learn backend development deeply, especially system design, database relations, and code execution pipelines.

---

##  Features

-  User Authentication (JWT based login & signup)
-  Problem Management (Create, Update, Delete problems)
-  Run Code against multiple test cases
-  Batch code execution using Judge0 API
-  Submission result storage (time, memory, output, status)
-  Automatic verdict generation (Accepted / Wrong Answer)
-  Testcase level result tracking
-  Playlist / Problem collection feature
-  Problem solved tracking per user
-  Secure backend with validations

---

## 🛠 Tech Stack

- **Node.js**
- **Express.js**
- **PostgreSQL**
- **Prisma ORM**
- **Judge0 API** (for code execution)
- **JWT Authentication**
- **Docker (Judge0 self-hosted)**

---

##  How Code Execution Works

1. User submits code with language and test cases
2. Backend sends batch request to Judge0
3. Judge0 runs code in sandbox
4. Backend polls for results
5. Results are compared with expected output
6. Verdict is stored in database
7. Submission + testcase results are returned

---

##  Database Design

Main entities:

- User
- Problem
- Submission
- TestCasesResult
- ProblemSolved
- Playlist

Relations are handled using Prisma ORM.

---


