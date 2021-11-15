import multer from "multer";

const avatar = multer({
  limits: {
    fileSize: 1000000, // 1MB
  },
  fileFilter: function (req, file, cb) {
    // Throw an error if file is not an image
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      cb(new Error("Please upload an image file"));
    }

    // Accept the file if it is an image file
    cb(null, true);
  },
});

export const uploadAvatar = avatar.single("avatar");
