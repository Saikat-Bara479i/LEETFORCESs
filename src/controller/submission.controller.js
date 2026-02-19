export const getAllSubmissions = async (req, res) => {
  try {
    const userId = req.user.id;
    // Fetch all submissions for the user from the database
    const submissions = await db.submission.findMany({
      where: {
        userId: userId,
      },
    });
    res.status(200).json({
      success: true,
      message: "Submissions fetched successfully",
      submissions,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Error while fetching submissions",
    });
  }
};
export const getSubmissionForProblem = async (req, res) => {
  try {
    const userid = req.user.id;
    const problemId = req.params.problemId;
    const submission = await db.submission.findMany({
      where: {
        userId: userid,
        problemId: problemId,
      },
    });
    res.status(200).json({
      success: true,
      message: "Submission fetched successfully",
      submission,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Error while fetching submissions",
    });
  }
};
export const getSubmissionsCountByProblem = async (req, res) => {
  try {
    const problemId = req.params.problemId;
    const submission = await db.submission.count({
      where: {
        problemId: problemId,
      },
    });

    res.status(200).json({
      success: true,
      message: "Submissions Fetched successfully",
      count: submission,
    });
  } catch (err) {
    console.log(error);
    res.status(500).json({
      error: "Error while fetching submissions",
    });
  }
};
