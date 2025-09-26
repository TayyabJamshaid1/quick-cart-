import multer from "multer";

const storage = multer.memoryStorage(); //disk or his memory storage,i decided memory storage in its own server

const uploadFiles = multer({ storage }).array("files", 10);

export default uploadFiles;