import { db } from "../libs/db.js";

export const createPlaylist = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user.id;
    const playlist = await db.playlist.create({
      data: {
        name,
        description,
        userId,
      },
    });
    res.status(200).json({
      success: true,
      message: "Playlist created successfully",
      playlist,
    });
  } catch (error) {
    console.error("Error creating playlist:", error);
    res.status(500).json({ error: "Failed to create playlist" });
  }
};
export const getAllPlaylists = async (req, res) => {
  try {
    const Playlist = await db.playlist.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        problems: {
          include: {
            problem: true,
          },
        },
      },
    });
    console.log(Playlist);

    res.status(200).json({
      success: true,
      message: "Playlist fetched successfully",
      Playlist,
    });
  } catch (error) {
    console.error("Error fetching playlist:", error);
    res.status(500).json({ error: "Failed to fetch playlist" });
  }
};
export const getPlaylistDetails = async (req, res) => {
  const { playlistId } = req.params;
  try {
    const Playlist = await db.playlist.findUnique({
      where: {
        id: playlistId,
        userId: req.user.id,
      },
      include: {
        problems: {
          include: {
            problem: true,
          },
        },
      },
    });
    if (!Playlist) {
      return res.status(404).json({
        error: "Playlist not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Playlist fetched successfully",
      playList,
    });
  } catch (error) {
    console.error("Error fetching playlist:", error);
    res.status(500).json({ error: "Failed to fetch playlist" });
  }
};
export const addProblemToPlaylist = async (req, res) => {
  const { playlistId } = req.params;
  const { problemId } = req.body;
  try {
    if (!Array.isArray(problemId) || problemId.length === 0) {
      return res.status(400).json({
        error: "problemId should be a non-empty array",
      });
    }
    const problemInPlaylist = await db.problemPlaylist.createMany({
      data: problemId.map((id) => ({
        playlistId,
        problemId: id,
      })),
    });
    res.status(201).json({
      success: true,
      message: "Problems added to playlist successfully",
      problemInPlaylist,
    });
  } catch (error) {
    console.error("Error adding problems to playlist:", error);
    res.status(500).json({ error: "Failed to add problems to playlist" });
  }
};
export const removeProblemFromPlaylist = async (req, res) => {
  const { playlistId } = req.params;
  const { problemIds } = req.body;
  try {
    if (!Array.isArray(problemIds) || problemIds.length === 0) {
      return res.status(400).json({
        error: "Invalid problemIds. It should be a non-empty array.",
      });
    }
    const deleteProblems = await db.problemPlaylist.deleteMany({
      where: {
        playlistId,
        problemId: {
          in: problemIds,
        },
      },
    });
    res.status(200).json({
      success: true,
      message: "Problem removed from playlist successfully",
      deleteProblems,
    });
  } catch (error) {
    console.error("Error removing problem from playlist:", error.message);
    res.status(500).json({ error: "Failed to remove problem from playlist" });
  }
};
export const deletePlaylist = async (req, res) => {
  const { playlistId } = req.params;
  try {
    const deletePlaylist = await db.playlist.delete({
      where: {
        id: playlistId,
      },
    });
    res.status(200).json({
      success: true,
      message: "Playlist deleted successfully",
      deletePlaylist,
    });
  } catch (error) {
    console.error("Error deleting playlist:", error.message);
    res.status(500).json({ error: "Failed to delete playlist" });
  }
};
