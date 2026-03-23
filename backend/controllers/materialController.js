const Material = require('../models/Material');

const uploadMaterial = async (req, res) => {
  try {
    console.log("\n--- 1. INCOMING UPLOAD REQUEST ---");
    console.log("Body Data:", req.body);
    console.log("File Data:", req.file ? "File received!" : "NO FILE DETECTED");

    const { title, courseCode } = req.body;

    if (!req.file) {
      console.log("--- UPLOAD FAILED: No File ---");
      return res.status(400).json({ error: 'No file uploaded by Multer!' });
    }

    // Cloudinary URL
    const fileUrl = req.file.path; 
    console.log("--- 2. CLOUDINARY UPLOAD SUCCESS ---");
    console.log("Cloudinary URL:", fileUrl);

    if (!title || !courseCode) {
      console.log("--- UPLOAD FAILED: Missing Text Fields ---");
      return res.status(400).json({ error: 'Please provide title and courseCode.' });
    }

    // Save to MongoDB
    console.log("--- 3. SAVING TO MONGODB ---");
    const newMaterial = new Material({ title, fileUrl, courseCode });
    const savedMaterial = await newMaterial.save();
    
    console.log("--- 4. MONGODB SAVE SUCCESS! ---");
    res.status(201).json(savedMaterial);

  } catch (error) {
    console.error("\n=== UPLOAD CRASHED ===");
    console.error(error); // This will print the REAL error instead of [object Object]
    
    // Send a clear message back to React
    res.status(500).json({ 
      error: error.message || 'Database or Server Error' 
    });
  }
};

const getMaterialsByCourse = async (req, res) => {
  try {
    const { courseCode } = req.params;
    const materials = await Material.find({ courseCode: courseCode });
    res.status(200).json(materials);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching materials', error: error.message });
  }
};

module.exports = { uploadMaterial, getMaterialsByCourse };