import { db } from "../libs/db.js";
import { submitbatch } from "../libs/judge0.libs.js";
import { getJudge0LanguageId } from "../libs/judge0.libs.js";
import { pollbatchResults } from "../libs/judge0.libs.js";
export const createProblem = async (req, res) => {
  //going to get all the data from the body
  const {
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    testcases,
    codeSnippets,
    referenceSolutions,
  } = req.body;
  //going to check user role
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({
      error: "Forbidden - You don't have permission to perform this action",
    });
  }
  //
  try {
    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      const languageId = getJudge0LanguageId(language);
      if (!languageId) {
        return res.status(400).json({
          error: `Unsupported language: ${language}`,
        });
      }
      const submissions = testcases.map(({ input, output }) => ({
        source_code: solutionCode,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      }));
      const submissionResults = await submitbatch(submissions);
      const tokens = submissionResults.map((res) => res.token);
      const results = await pollbatchResults(tokens);
      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        console.log("result--", result);
        if (result.status.id !== 3) {
          return res.status(400).json({
            error: `Reference solution failed for language ${language} on testcase ${i + 1}`,
          });
        }
      }
    }
    const newProblem = await db.problem.create({
      data: {
        title,
        description,
        difficulty,
        tags,
        examples,
        constraints,
        testcases,
        codeSnippets,
        referenceSolutions,
        userId: req.user.id,
      },
    });
    return res.status(201).json({
      success: true,
      message: "Problem created successfully",
      problem: newProblem,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Error While Creating Problem",
    });
  }
};
export const getAllProblems = async (req, res) => {
  try {
    const problems = await db.problem.findMany();
    if (!problems) {
      return res.status(404).json({
        error: "No problems found",
      });
    }
    res.status(200).json({
      sucess: true,
      message: "Message Fetched Successfully",
      problems,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Error While Fetching Problems",
    });
  }
};
export const getProblemById = async (req, res) => {
  const { id } = req.params;
  try {
    const problem = await db.problem.findUnique({
      where: {
        id,
      },
    });
    if (!problem) {
      return res.status(404).json({
        error: "Problem not found",
      });
    }
    res.status(200).json({
      sucess: true,
      message: "Problem Fetched Successfully",
      problem,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Error While Fetching Problem",
    });
  }
};

export const updateProblem = async (req, res) => {
  const { id } = req.params;
  try {
    const problem = await db.problem.findUnique({
      where: {
        id,
      },
    });
    if (!problem) {
      return res.status(404).json({
        error: "Problem not found",
      });
    }
  } catch (error) {}
};
export const deleteProblem = async (req, res) => {
  const { id } = req.params;
  try {
    const problem = await db.problem.findUnique({ where: { id } });

    if (!problem) {
      return res.status(404).json({ error: "Problem Not found" });
    }

    await db.problem.delete({ where: { id } });

    res.status(200).json({
      success: true,
      message: "Problem deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Error While deleting the problem",
    });
  }
};
export const getAllSolveProblemsByUser = async (req, res) => {
  try{
    const problems = await db.problem.findMany({
      where: {
        solvedBy:{
          some:{
            userId: req.user.id,
          }
        }
      },
      include:{
        solvedBy:{
          where:{
            userId: req.user.id,
          }
        }
      }
    });
    res.status(200).json({
      sucess: true,
      message: "Problems Fetched Successfully",
      problems,
    })
  }catch(error){
    console.log(error);
    return res.status(500).json({
      error: "Error While Fetching Problems",
    });
  }
};
