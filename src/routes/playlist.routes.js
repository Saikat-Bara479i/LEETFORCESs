import express from "express"
import { authMiddleware } from "../middleware/auth.middleware.js";
import { createPlaylist, getAllPlaylists, getPlaylistDetails, addProblemToPlaylist, removeProblemFromPlaylist, deletePlaylist } from "../controller/playlist.controller.js";
const playlistRoute = express.Router();
playlistRoute.get("/",authMiddleware,getAllPlaylists)
playlistRoute.get("/:playlistId",authMiddleware,getPlaylistDetails)
playlistRoute.post("/create-playlist",authMiddleware,createPlaylist)
playlistRoute.post("/:playlistId/add-problem",authMiddleware,addProblemToPlaylist)
playlistRoute.delete("/:playlistId",authMiddleware,deletePlaylist)
playlistRoute.delete("/:playlistId/remove-problem",authMiddleware,removeProblemFromPlaylist)

export default playlistRoute;