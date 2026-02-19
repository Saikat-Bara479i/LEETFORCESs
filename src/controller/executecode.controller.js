import { db } from "../libs/db.js";
import {
  submitbatch,
  pollbatchResults,
  getJudge0LanguageId,
  getLanguages,
} from "../libs/judge0.libs.js";
export const excuteCode = async (req, res) => {
  try {
    const { source_code, language_id, stdin, expected_output, problemId } =
      req.body;
    const userId = req.user.id;
    //validate testcase
    if (
      !Array.isArray(stdin) ||
      stdin.length === 0 ||
      !Array.isArray(expected_output) ||
      expected_output.length !== stdin.length
    ) {
      return res.status(400).json({ message: "Invalid test cases" });
    }
    //prepare eatch test case
    const submissions = stdin.map((input) => ({
      source_code,
      language_id,
      stdin: input,
    }));
    //send batch submission to judge0
    const submitResponse = await submitbatch(submissions);
    const tokens = submitResponse.map((res) => res.token);
    //polling for results
    const results = await pollbatchResults(tokens);
    console.log("results--", results);
    let allPassed = true;
    const detailedResults = results.map((result, index) => {
      const stdout = result.stdout?.trim();
      const expected_outputs = expected_output[index]?.trim();
      const passed = stdout === expected_outputs;
      if (!passed) allPassed = false;
      return {
        testCase: index + 1,
        passed,
        stdout,
        expected: expected_outputs,
        stderr: result.stderr || null,
        compileOutput: result.compile_output || null,
        status: result.status.description,
        memory: result.memory ? `${result.memory} KB` : undefined,
        time: result.time ? `${result.time} sec` : undefined,
      };
      console.log(`Testcase #${index + 1}`);
      console.log(`Input for testcase #${index + 1}: ${stdin[index]}`);
      console.log(
        `Expected Output for testcase #${index + 1}: ${expected_outputs}`,
      );
      console.log(`Actual output for testcase #${index + 1}: ${stdout}`);

      console.log(`Matched testcase #${index + 1}: ${passed}`);
    });
    console.log("my detail result" + detailedResults);
    //store submission in database

    const submission = await db.submission.create({
      data: {
        userId,
        problemId,
        sourceCode: source_code,
        language: getLanguages(language_id),
        stdin: stdin.join("\n"),
        stdout: JSON.stringify(detailedResults.map((r) => r.stdout)),
        stderr: detailedResults.some((r) => r.stderr)
          ? JSON.stringify(detailedResults.map((r) => r.stderr))
          : null,
        compileOutput: detailedResults.some((r) => r.compileOutput)
          ? JSON.stringify(detailedResults.map((r) => r.compileOutput))
          : null,
        status: allPassed ? "Accepted" : "Wrong Answer",
        memory: detailedResults.some((r) => r.memory)
          ? JSON.stringify(detailedResults.map((r) => r.memory))
          : null,
        time: detailedResults.some((r) => r.time)
          ? JSON.stringify(detailedResults.map((r) => r.time))
          : null,
      },
    });
    console.log(submission);

    //IF ALL PASSED= true then mark as done
    if (allPassed) {
      await db.problemSolved.upsert({
        where: {
          userId_problemId: {
            userId,
            problemId,
          },
        },
        update: {},
        create: {
          userId,
          problemId,
        },
      });
    }
    //test cases result
    const testCasesResult = detailedResults.map((r) => ({
      submissionId: submission.id,
      testCase: r.testCase,
      passed: r.passed,
      stdout: r.stdout,
      expected: r.expected,
      stderr: r.stderr,
      compileOutput: r.compileOutput,
      status: r.status,
      memory: r.memory,
      time: r.time,
    }));
    await db.testCasesResult.createMany({
      data: testCasesResult,
    });
    const submissionwithDetails = await db.submission.findUnique({
      where: { id: submission.id },
      include: {
        testCases: true,
      },
    });
    res.status(200).json({
      success: true,
      message: "Code executed successfully",
      submission: submissionwithDetails,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error executing code", error: error.message });
  }
};
